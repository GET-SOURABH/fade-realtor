(() => {
  const data = window.PropertyListings;
  const template = document.getElementById("propertyCardTemplate");
  const grid = document.getElementById("allListingsGrid");
  const track = document.getElementById("listingTrack");
  const container = grid || track;
  if (!data || !container || !template) return;

  const featured = track ? data.getFeatured() : null;
  // The homepage has no listing navigation controls; preserve its single card.
  const properties = grid ? data.getAll() : featured ? [featured] : [];
  const cards = document.createDocumentFragment();

  properties.forEach((property) => {
    const card = template.content.cloneNode(true);
    const title = property.title || property.address || "";
    const link = card.querySelector(".property-card-link");
    const url = data.localPath(property.url);
    if (url) link.setAttribute("href", url);
    link.setAttribute("aria-label", `View ${title} property details`);

    const image = card.querySelector(".property-image img");
    const cover = data.localPath(property.coverImage);
    if (cover) image.setAttribute("src", cover);
    else image.hidden = true;
    image.alt = title;

    const tag = card.querySelector(".tag");
    tag.textContent = property.status || "";
    tag.hidden = !property.status;
    card.querySelector(".property-meta h3").textContent = data.formatPrice(property);
    card.querySelector(".property-meta p").textContent = title;
    card.querySelector(".property-meta small").textContent = [
      data.location(property, false, true),
      ...data.facts(property),
    ].filter(Boolean).join(" · ");
    cards.appendChild(card);
  });
  container.replaceChildren(cards);

  const copy = document.querySelector(".featured-property-copy");
  if (track && copy) {
    copy.hidden = !featured;
    if (!featured) return;
    copy.querySelector("h3").textContent = featured.title || featured.address || "";
    copy.querySelector("p").textContent = featured.description || "";
    copy.querySelector("span").textContent = data.location(featured, true);
    const link = copy.querySelector("a");
    const url = data.localPath(featured.url);
    if (url) link.setAttribute("href", url);
    else link.removeAttribute("href");
  }
})();
