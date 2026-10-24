// Edit property records here. Page-specific SEO stays in each static HTML page.
window.PropertyListings = (() => {
  const properties = [
    {
      id: "77-blackthorn-lane",
      slug: "77-blackthorn-lane",
      title: "77 Blackthorn Lane",
      address: "77 Blackthorn Lane",
      city: "Brampton",
      province: "ON",
      provinceName: "Ontario",
      postalCode: "L6V 3L1",
      price: 949000,
      currency: "CAD",
      bedrooms: 4,
      bathrooms: 3,
      status: "For Sale",
      description:
        "A spacious 4-level detached home designed for comfortable family living, featuring a bright kitchen, private patio access and a versatile multi-level layout.",
      coverImage: "assets/images/1.png",
      coverImageAlt: "Front exterior of 77 Blackthorn Lane",
      galleryImages: [
        {
          src: "assets/images/1.png",
          alt: "Front exterior of 77 Blackthorn Lane",
        },
        ...Array.from({ length: 37 }, (_, index) => {
          const number = index + 2;
          const extension = number === 35 || number === 36 ? "jpg" : "JPG";
          return {
            src: `assets/images/${number}.${extension}`,
            alt: `77 Blackthorn Lane gallery image ${number}`,
          };
        }),
      ],
      url: "property-77-blackthorn-lane.html",
      featured: true,
      displayOrder: 1,
    },
    {
      id: "4-virgilwood-crescent",
      slug: "4-virgilwood-crescent",
      title: "4 Virgilwood Crescent",
      address: "4 Virgilwood Crescent",
      city: "Barrie",
      province: "ON",
      provinceName: "Ontario",
      postalCode: "L4M 4Y3",
      neighbourhood: "Cundles East",
      price: 655555,
      currency: "CAD",
      mlsNumber: "S13929722",
      bedrooms: 3,
      basementBedrooms: 1,
      bedroomsDisplay: "3+1",
      bathrooms: 2,
      status: "For Sale",
      propertyType: "Detached house",
      buildingStyle: "3-level backsplit",
      advertisedSquareFootage: "700–1,100 sq. ft.",
      advertisedSquareFootageNote:
        "Advertised range; not the total finished floor area.",
      lotSize: { width: 50, depth: 110, unit: "feet" },
      ownership: "Freehold",
      garage: "Attached",
      annualPropertyTaxes: 4358.49,
      description:
        "A beautifully renovated 3-level backsplit in Barrie's Cundles East, featuring 3+1 bedrooms, a modern kitchen, and a finished basement with a separate entrance.",
      coverImage: "assets/4 Virgilwood Crescent, Barrie/1.jpg",
      coverImageAlt: "Front exterior of 4 Virgilwood Crescent",
      galleryImages: Array.from({ length: 53 }, (_, index) => {
        const number = index + 1;
        const view = number <= 8
          ? "Front exterior"
          : number <= 45 ? "Interior" : "Backyard and rear exterior";
        return {
          src: `assets/4 Virgilwood Crescent, Barrie/${number}.jpg`,
          alt: `${view} of 4 Virgilwood Crescent, image ${number}`,
        };
      }),
      url: "property-4-virgilwood-crescent.html",
      featured: false,
      displayOrder: 2,
    },
  ];

  function getAll() {
    const ids = new Set();
    return properties
      .filter((property) => {
        if (!property || typeof property.id !== "string" || !property.id.trim()) {
          console.warn("Skipping property without a valid ID.");
          return false;
        }
        if (ids.has(property.id)) {
          console.warn(`Skipping duplicate property ID: ${property.id}`);
          return false;
        }
        ids.add(property.id);
        return true;
      })
      .sort((a, b) => {
        const orderA = Number.isFinite(a.displayOrder) ? a.displayOrder : Infinity;
        const orderB = Number.isFinite(b.displayOrder) ? b.displayOrder : Infinity;
        return orderA === orderB ? 0 : orderA - orderB;
      });
  }

  function formatPrice(property) {
    if (!Number.isFinite(property.price)) return "";
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: property.currency || "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price);
  }

  function location(property, fullProvince = false, includePostalCode = false) {
    const province = fullProvince
      ? property.provinceName || property.province
      : property.province;
    const region = [province, includePostalCode ? property.postalCode : ""]
      .filter(Boolean)
      .join(" ");
    return [property.city, region].filter(Boolean).join(", ");
  }

  function facts(property) {
    return [
      property.bedrooms != null
        ? `${property.bedroomsDisplay ?? property.bedrooms} Beds`
        : "",
      property.bathrooms != null ? `${property.bathrooms} Baths` : "",
    ].filter(Boolean);
  }

  // Property links and photos use relative paths. Reject executable URL schemes.
  function localPath(value) {
    return typeof value === "string" && value.trim() &&
      !/^(?:[a-z][a-z\d+.-]*:|[\/\\])|[\\\u0000-\u001f]/i.test(value.trim())
      ? value.trim()
      : "";
  }

  return {
    properties,
    getAll,
    getById: (id) => getAll().find((property) => property.id === id),
    getFeatured: () => {
      const sorted = getAll();
      return sorted.find((property) => property.featured === true) || sorted[0];
    },
    formatPrice,
    location,
    facts,
    localPath,
  };
})();
