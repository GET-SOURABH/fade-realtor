(() => {
  const data = window.PropertyListings;
  const page = document.querySelector("[data-property-id]");
  if (!data || !page) return;
  const property = data.getById(page.dataset.propertyId);
  const gallery = page.querySelector("[data-property-gallery]");

  function setText(selector, value) {
    const element = page.querySelector(selector);
    if (element) element.textContent = value || "";
  }

  if (!property) {
    setText("#propertyTitle", "Property not found");
    if (gallery) gallery.replaceChildren();
    console.warn(`Property ID not found: ${page.dataset.propertyId}`);
    return;
  }

  const title = property.title || property.address || "";
  setText("#propertyTitle", title);
  setText("[data-property-status]", property.status);
  setText("[data-property-location]", data.location(property, true));
  setText(".property-hero-price", data.formatPrice(property));
  setText("[data-property-description]", property.description);

  const facts = page.querySelector(".property-hero-facts");
  if (facts) {
    const labels = data.facts(property);
    const separator = facts.querySelector("span");
    facts.replaceChildren();
    labels.forEach((label, index) => {
      if (index && separator) facts.append(" ", separator, " ");
      facts.append(document.createTextNode(label));
    });
  }

  const caption = page.querySelector(".hero-property");
  if (caption) {
    const region = caption.querySelector("span");
    region.textContent = data.location(property);
    caption.replaceChildren(document.createTextNode(`${property.address || title} `), region);
  }

  const hero = page.querySelector(".property-detail-hero .hero-slide");
  const cover = data.localPath(property.coverImage);
  if (hero) {
    if (cover) hero.style.setProperty("--bg", `url(${JSON.stringify(cover)})`);
    hero.setAttribute("aria-label", property.coverImageAlt || title);
  }

  if (gallery) {
    gallery.setAttribute("aria-label", `${title} image gallery`);
    const images = Array.isArray(property.galleryImages) ? property.galleryImages : [];
    const galleryImages = images.length ? images : cover ? [{ src: cover, alt: property.coverImageAlt || title }] : [];
    const fragment = document.createDocumentFragment();
    const galleryItems = [];
    galleryImages.forEach((image) => {
      const src = data.localPath(image && image.src);
      if (!src) return;
      const figure = document.createElement("figure");
      figure.className = "property-gallery-item";
      const photo = document.createElement("img");
      photo.src = src;
      photo.alt = image.alt || title;
      photo.loading = "lazy";
      figure.appendChild(photo);
      fragment.appendChild(figure);
      galleryItems.push({ src, alt: photo.alt, thumbnail: photo });
    });
    gallery.replaceChildren(fragment);
    if (galleryItems.length) initializeLightbox(galleryItems);
  }

  function initializeLightbox(items) {
    const dialog = document.createElement("dialog");
    dialog.className = "property-lightbox";
    dialog.id = "propertyGalleryLightbox";
    dialog.setAttribute("aria-label", `${title} image gallery`);
    dialog.setAttribute("aria-modal", "true");

    function button(className, label, symbol) {
      const control = document.createElement("button");
      control.type = "button";
      control.className = `property-lightbox-button ${className}`;
      control.setAttribute("aria-label", label);
      control.textContent = symbol;
      return control;
    }

    const closeButton = button("property-lightbox-close", "Close image gallery", "×");
    const previousButton = button("property-lightbox-previous", "Previous photograph", "‹");
    const nextButton = button("property-lightbox-next", "Next photograph", "›");
    previousButton.disabled = nextButton.disabled = items.length < 2;

    const stage = document.createElement("div");
    stage.className = "property-lightbox-stage";
    const image = document.createElement("img");
    image.className = "property-lightbox-image";
    image.alt = "";
    image.decoding = "async";
    stage.appendChild(image);

    const counter = document.createElement("p");
    counter.className = "property-lightbox-counter";
    counter.setAttribute("role", "status");
    counter.setAttribute("aria-live", "polite");
    counter.setAttribute("aria-atomic", "true");
    dialog.append(closeButton, previousButton, stage, nextButton, counter);
    document.body.appendChild(dialog);

    let currentIndex = 0;
    let returnFocus = null;
    let scrollState = null;
    let touchStart = null;

    function showImage(index) {
      currentIndex = (index + items.length) % items.length;
      const selected = items[currentIndex];
      image.alt = selected.alt;
      image.src = selected.src;
      counter.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    function openLightbox(index, thumbnail) {
      if (dialog.open) return;
      returnFocus = thumbnail;
      scrollState = {
        x: window.scrollX,
        y: window.scrollY,
        bodyStyle: document.body.getAttribute("style"),
        rootStyle: document.documentElement.getAttribute("style"),
      };
      // Fix the page in place as well as hiding overflow for mobile browsers.
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollState.y}px`;
      document.body.style.left = `-${scrollState.x}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      showImage(index);
      dialog.showModal();
      closeButton.focus({ preventScroll: true });
    }

    function restoreStyle(element, value) {
      if (value === null) element.removeAttribute("style");
      else element.setAttribute("style", value);
    }

    dialog.addEventListener("close", () => {
      if (!scrollState) return;
      restoreStyle(document.body, scrollState.bodyStyle);
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(scrollState.x, scrollState.y);
      restoreStyle(document.documentElement, scrollState.rootStyle);
      scrollState = null;
      touchStart = null;
      image.removeAttribute("src");
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    });

    closeButton.addEventListener("click", () => dialog.close());
    previousButton.addEventListener("click", () => showImage(currentIndex - 1));
    nextButton.addEventListener("click", () => showImage(currentIndex + 1));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target === stage || event.target === counter) dialog.close();
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      dialog.close();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.close();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showImage(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
      } else if (event.key === "Tab") {
        event.preventDefault();
        const controls = [closeButton, previousButton, nextButton].filter((control) => !control.disabled);
        const index = controls.indexOf(document.activeElement);
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
      }
    });

    stage.addEventListener("touchstart", (event) => {
      touchStart = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
        : null;
    }, { passive: true });
    stage.addEventListener("touchmove", (event) => {
      if (event.touches.length !== 1) touchStart = null;
    }, { passive: true });
    stage.addEventListener("touchcancel", () => { touchStart = null; });
    stage.addEventListener("touchend", (event) => {
      if (!touchStart || event.changedTouches.length !== 1) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        // Prevent the swipe from also becoming a backdrop click.
        event.preventDefault();
        showImage(currentIndex + (dx < 0 ? 1 : -1));
      }
    }, { passive: false });

    items.forEach(({ thumbnail, alt }, index) => {
      thumbnail.tabIndex = 0;
      thumbnail.setAttribute("role", "button");
      thumbnail.setAttribute("aria-haspopup", "dialog");
      thumbnail.setAttribute("aria-controls", dialog.id);
      thumbnail.setAttribute("aria-label", `Open photograph ${index + 1} of ${items.length}: ${alt}`);
      thumbnail.addEventListener("click", () => openLightbox(index, thumbnail));
      thumbnail.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index, thumbnail);
        }
      });
    });
  }
})();
