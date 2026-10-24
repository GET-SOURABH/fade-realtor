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
    });
    gallery.replaceChildren(fragment);
  }
})();
