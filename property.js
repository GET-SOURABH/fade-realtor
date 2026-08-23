const propertyGalleries = {
  "77-blackthorn-lane": {
    title: "77 Blackthorn Lane",
    images: [
      {
        src: "assets/images/1.png",
        alt: "Front exterior of 77 Blackthorn Lane",
      },
      ...Array.from({ length: 37 }, (_, index) => {
        const imageNumber = index + 2;

        return {
          src: `assets/images/${imageNumber}.JPG`,
          alt: `77 Blackthorn Lane gallery image ${imageNumber}`,
        };
      }),
    ],
  },
};

const propertyGallery = document.querySelector("[data-property-gallery]");

if (propertyGallery) {
  const propertyKey = propertyGallery.dataset.propertyGallery;
  const gallery = propertyGalleries[propertyKey];

  if (gallery) {
    propertyGallery.innerHTML = gallery.images
      .map(
        (image) => `
          <figure class="property-gallery-item">
            <img src="${image.src}" alt="${image.alt}" loading="lazy" />
          </figure>
        `,
      )
      .join("");
  }
}
