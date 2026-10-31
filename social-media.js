(() => {
  const section = document.getElementById("media");
  const data = window.SocialMediaData;
  if (!section || !data) return;

  const platformNames = { instagram: "Instagram", youtube: "YouTube" };
  let instagramScriptPromise;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function platformIcon(platform) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "social-media-icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    // Fixed icon artwork; video data is inserted only through DOM attributes/text.
    svg.innerHTML = platform === "instagram"
      ? '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-media-icon-dot" cx="17.5" cy="6.5" r="1"/>'
      : '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>';
    return svg;
  }

  function externalLink(url, label, accessibleLabel = label) {
    const link = element("a", "underline-link", label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${accessibleLabel} (opens in a new tab)`);
    return link;
  }

  function loadInstagramScript() {
    if (window.instgrm?.Embeds?.process) return Promise.resolve();
    if (!instagramScriptPromise) {
      instagramScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const fail = () => {
          clearTimeout(timeout);
          script.remove();
          reject(new Error("Instagram embed script unavailable"));
        };
        const timeout = setTimeout(fail, 10000);
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          if (!window.instgrm?.Embeds?.process) {
            fail();
            return;
          }
          clearTimeout(timeout);
          resolve();
        };
        script.onerror = fail;
        document.head.appendChild(script);
      }).catch((error) => {
        instagramScriptPromise = undefined;
        throw error;
      });
    }
    return instagramScriptPromise;
  }

  function loadYouTube(item, stage, status, close) {
    const player = document.createElement("iframe");
    player.src = `https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&playsinline=1&rel=0`;
    player.title = item.title;
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    // Created only by a click. Keep the external link available for blocked players.
    stage.replaceChildren(player);
    close.hidden = false;
    status.textContent = "If playback is unavailable, watch on YouTube below.";
    player.focus();
  }

  async function loadInstagram(item, stage, button, action, status, close) {
    button.disabled = true;
    action.textContent = "Loading Reel…";
    stage.setAttribute("aria-busy", "true");
    status.textContent = "Loading Instagram. You can also watch using the link below.";

    const host = element("div", "social-media-instagram-embed");
    const quote = element("blockquote", "instagram-media");
    quote.setAttribute("data-instgrm-permalink", item.url);
    quote.setAttribute("data-instgrm-version", "14");
    quote.appendChild(externalLink(item.url, "Watch on Instagram"));
    host.appendChild(quote);
    stage.appendChild(host);

    let finished = false;
    let observedPlayer;
    const finish = (ready) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      observer.disconnect();
      stage.removeAttribute("aria-busy");
      if (ready) {
        button.remove();
        host.classList.add("is-ready");
        close.hidden = false;
        status.textContent = "Press play in Instagram's player. If unavailable, watch on Instagram below.";
        observedPlayer.focus();
      } else {
        host.remove();
        button.disabled = false;
        action.textContent = "Try Again";
        status.textContent = "Reel unavailable here. Watch on Instagram using the link below.";
        button.focus();
      }
    };
    // Cross-origin player contents cannot be inspected. An always-visible original
    // link also covers private, removed, login-required and embedding-disabled Reels.
    const observer = new MutationObserver(() => {
      const player = host.querySelector("iframe");
      if (!player || player === observedPlayer) return;
      observedPlayer = player;
      player.title = `Instagram Reel ${item.shortcode} by Fade Ayad`;
      player.addEventListener("load", () => finish(true), { once: true });
      player.addEventListener("error", () => finish(false), { once: true });
    });
    observer.observe(host, { childList: true, subtree: true });
    const timeout = setTimeout(() => finish(false), 15000);

    try {
      await loadInstagramScript();
      if (!finished) window.instgrm.Embeds.process();
    } catch {
      finish(false);
    }
  }

  function renderCard(item, index) {
    const isReel = item.platform === "instagram";
    const platform = platformNames[item.platform];
    const label = item.title || `Instagram Reel ${String(index + 1).padStart(2, "0")}`;
    const card = element("article", `social-media-card social-media-card--${item.platform}`);
    card.setAttribute("aria-label", label);
    const stage = element("div", "social-media-stage");
    const button = element("button", "social-media-preview");
    button.type = "button";
    button.setAttribute("aria-label", `${isReel ? "Load" : "Play"} ${label}`);
    const badge = element("span", "social-media-badge", platform);
    badge.prepend(platformIcon(item.platform));
    const brand = element("span", "social-media-brand");
    brand.append(element("strong", "", "FadeAyad"), element("span", "", "REALTOR"));
    button.append(badge, brand);

    if (item.thumbnail) {
      const image = element("img", "social-media-thumbnail");
      image.src = item.thumbnail;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.width = isReel ? 540 : 480;
      image.height = isReel ? 960 : 360;
      image.addEventListener("error", () => image.remove(), { once: true });
      button.prepend(image);
    }

    const play = element("span", "social-media-play", "▶");
    play.setAttribute("aria-hidden", "true");
    const action = element("span", "social-media-action", isReel ? "Load Reel" : "Play Property Tour");
    button.append(play, action);
    stage.appendChild(button);
    const copy = element("div", "social-media-card-copy");
    if (item.title) copy.appendChild(element("h4", "social-media-title", item.title));
    const status = element("p", "social-media-status");
    status.setAttribute("role", "status");
    const close = element("button", "social-media-reset", "Close player");
    close.type = "button";
    close.hidden = true;
    close.setAttribute("aria-label", `Close player for ${label}`);
    close.addEventListener("click", () => {
      stage.replaceChildren(button);
      button.disabled = false;
      action.textContent = isReel ? "Load Reel" : "Play Property Tour";
      status.textContent = "";
      close.hidden = true;
      button.focus();
    });
    copy.append(status, close, externalLink(item.url, `Watch on ${platform} ↗`, `Watch ${label} on ${platform}`));
    card.append(stage, copy);
    button.addEventListener("click", () => {
      if (isReel) loadInstagram(item, stage, button, action, status, close);
      else loadYouTube(item, stage, status, close);
    });
    return card;
  }

  function initializeInstagramCarousel(grid) {
    const mobile = window.matchMedia("(max-width: 760px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wrapper = element("div", "instagram-carousel");
    const arrows = element("div", "instagram-carousel-arrows");
    const previous = element("button", "instagram-carousel-arrow instagram-carousel-arrow--previous", "‹");
    const next = element("button", "instagram-carousel-arrow instagram-carousel-arrow--next", "›");
    const pagination = element("div", "instagram-carousel-dots");
    let cards = [];
    let dots = [];
    let activeIndex = 0;
    let frame = 0;

    grid.id = grid.id || "instagram-reels";
    arrows.setAttribute("role", "group");
    arrows.setAttribute("aria-label", "Instagram Reel navigation");
    pagination.setAttribute("role", "group");
    pagination.setAttribute("aria-label", "Choose an Instagram Reel");
    [previous, next].forEach((button, index) => {
      button.type = "button";
      button.setAttribute("aria-label", `${index ? "Next" : "Previous"} Instagram Reel`);
      button.setAttribute("aria-controls", grid.id);
    });
    arrows.append(previous, next);
    grid.before(wrapper);
    wrapper.append(grid, arrows, pagination);

    function update() {
      frame = 0;
      if (!mobile.matches || !cards.length) return;
      const left = grid.getBoundingClientRect().left;
      activeIndex = cards.reduce((nearest, card, index) =>
        Math.abs(card.getBoundingClientRect().left - left) <
        Math.abs(cards[nearest].getBoundingClientRect().left - left) ? index : nearest, 0);
      previous.hidden = activeIndex === 0;
      next.hidden = activeIndex === cards.length - 1;
      dots.forEach((dot, index) => {
        if (index === activeIndex) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if ((previous.hidden && document.activeElement === previous) ||
          (next.hidden && document.activeElement === next)) {
        dots[activeIndex].focus({ preventScroll: true });
      }
    }

    function queueUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function navigate(index) {
      if (!mobile.matches || !cards.length) return;
      const card = cards[Math.max(0, Math.min(index, cards.length - 1))];
      grid.scrollTo({
        left: grid.scrollLeft + card.getBoundingClientRect().left - grid.getBoundingClientRect().left,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    }

    function refresh() {
      cards = Array.from(grid.children).filter((card) => card.classList.contains("social-media-card--instagram"));
      dots = cards.map((card, index) => {
        const dot = element("button", "instagram-carousel-dot");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to Instagram Reel ${index + 1} of ${cards.length}`);
        dot.setAttribute("aria-controls", grid.id);
        dot.addEventListener("click", () => navigate(index));
        return dot;
      });
      pagination.replaceChildren(...dots);
      arrows.hidden = pagination.hidden = cards.length < 2;
      update();
    }

    previous.addEventListener("click", () => navigate(activeIndex - 1));
    next.addEventListener("click", () => navigate(activeIndex + 1));
    grid.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    new MutationObserver(refresh).observe(grid, { childList: true });
    refresh();
  }

  section.querySelectorAll("[data-social-profile]").forEach((link) => {
    link.href = data.profiles[link.dataset.socialProfile];
    link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
  });

  section.querySelectorAll("[data-social-grid]").forEach((grid) => {
    data.items
      .filter((item) => item.platform === grid.dataset.socialGrid)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((item, index) => grid.appendChild(renderCard(item, index)));
    if (grid.dataset.socialGrid === "instagram") initializeInstagramCarousel(grid);
  });
})();
