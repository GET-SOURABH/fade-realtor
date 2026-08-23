const listings = [
  {
    title: "77 Blackthorn Lane",
    location: "Brampton, ON L6V 3L1",
    price: "$949,000",
    beds: "4 Beds",
    baths: "3 Baths",
    image: "assets/images/1.png",
    status: "For Sale",
    url: "property-77-blackthorn-lane.html",
  },
];

const allListingsGrid = document.getElementById("allListingsGrid");

if (allListingsGrid) {
  allListingsGrid.innerHTML = listings
    .map(
      (listing) => `
        <article class="property-card">
          <a
            class="property-card-link"
            href="${listing.url}"
            aria-label="View ${listing.title} property details"
          >
            <div class="property-image">
              <img
                src="${listing.image}"
                alt="${listing.title}"
                loading="lazy"
              />
              <span class="tag">${listing.status}</span>
            </div>
            <div class="property-meta">
              <h3>${listing.price}</h3>
              <p>${listing.title}</p>
              <small>
                ${listing.location} · ${listing.beds} · ${listing.baths}
              </small>
            </div>
          </a>
        </article>
      `,
    )
    .join("");
}
