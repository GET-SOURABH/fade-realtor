# Managing property listings

`properties-data.js` is the single source of property records. It exposes
`window.PropertyListings` to the existing vanilla JavaScript pages; no build step,
server API, or dependency is required. Load it before `listings.js` or `property.js`.

- `index.html` supplies its original card template. `listings.js` fills that card
  and the adjacent featured copy from the featured property.
- `listings.html` supplies its original grid card template. The same script fills
  one card for every property, sorted by numeric `displayOrder` (lowest first).
- Each static property HTML page sets `data-property-id` on its body.
  `property.js` looks up that ID and fills the existing detail hero and gallery.
  The original URL, `property-77-blackthorn-lane.html`, is unchanged.

## Add the second property

1. Choose a unique lowercase, hyphenated ID/slug for the actual property. Create
   `assets/properties/<slug>/` and put its real photos there, for example
   `cover.jpg`, `image-01.jpg`, and `image-02.jpg`. Keep filename case exact.
   Leave all existing photos in `assets/images/` untouched.
2. Add a second object to the `properties` array in `properties-data.js` (before
   its closing `];`). Copy the first object's field names, then replace **all**
   its property-specific values with the actual second listing information:

   | Field | Value |
   | --- | --- |
   | `id`, `slug` | The new unique ID/slug |
   | `title`, `address` | Actual listing title and street address |
   | `city`, `province`, `provinceName`, `postalCode` | Location; e.g. abbreviated province and its full name |
   | `price`, `currency` | Numeric price without `$` or commas; use `"CAD"` |
   | `bedrooms`, `bathrooms` | Actual counts; use `null` or omit unknown counts |
   | `status`, `description` | Actual status and full description, as plain text |
   | `coverImage`, `coverImageAlt` | Relative cover path and descriptive alt text |
   | `galleryImages` | Ordered array of `{ src: "relative/photo/path.jpg", alt: "Description" }` objects |
   | `url` | `"property-<slug>.html"`, matching the new page filename |
   | `featured`, `displayOrder` | Boolean featured flag and numeric listing order |

   Replace the existing property's entire `galleryImages` value when copying;
   its generated filename sequence belongs only to the original listing.
3. Copy `property-77-blackthorn-lane.html` to `property-<slug>.html` in the project
   root. This is the reusable page pattern; keep its markup, classes, scripts,
   navigation, and contact links.
4. Set the copied body's `data-property-id` to the exact new object's `id`.
   Do not enter property content elsewhere in the page.
5. Update that page's static `<title>` and `<meta name="description">`. If adding
   canonical or Open Graph tags, give them that property's own URL, content,
   and image. The original page currently has no canonical or Open Graph tags.
6. Save the files. The All Listings page automatically renders the second card
   and links it to the configured `url`. No edits to listing layouts or scripts
   are needed. All page and image paths are relative to the project root; keep
   property HTML pages there.
7. To feature the new property, set its `featured` to `true` and the original's
   to `false`. If none is featured, the lowest `displayOrder` is used. If several
   are featured, the first featured property in that order is used. Equal orders
   keep array order; omitted orders sort last.
8. Manually inspect desktop and mobile pages and follow each card link.

## Defensive behavior and limits

- Duplicate IDs are skipped after the first occurrence, with a console warning.
  Records without a valid ID are skipped too; always supply unique IDs.
- Missing optional text/counts/prices are omitted. Prices are formatted in the
  existing whole-dollar style (`$949,000` for CAD). Use valid currency codes.
- A missing/empty gallery falls back to the cover photo when present; otherwise
  it remains empty. Invalid gallery entries are skipped.
- Empty property arrays render no cards and hide the homepage featured copy.
  An unknown detail-page ID displays `Property not found` without throwing.
- Text is assigned with DOM text APIs. Links and images accept relative paths,
  rejecting executable URL schemes. Provide each property's real cover and URL.
- The homepage retains one featured property because its existing listing track
  has no navigation controls and hides horizontal overflow. Every property is
  available through **See All Listings**. No controls or layout changes were added.
- The main marketing hero and its existing slide labels are independent,
  unchanged marketing content. Selecting a featured listing does not alter it.
- Property body content now requires JavaScript, as the listings grid and gallery
  already did. Each detail page retains static SEO metadata, but updating an
  address/description also requires updating that page's metadata manually.
- The original 38-photo gallery keeps its original order. References for photos
  35 and 36 use the existing lowercase `.jpg` filenames so they also work on
  case-sensitive hosting; no image files were renamed or changed.
- The unrelated Buyers/Sellers sections still reference `35.JPG` and `36.JPG`,
  while those files use lowercase `.jpg`. Those pre-existing references were
  left unchanged to respect the restriction on editing those sections.
- Visual behavior must be checked manually. This refactor uses only static and
  script-level checks, without browser inspection or automation.
