const header = document.getElementById("siteHeader");
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}
updateHeader();
window.addEventListener("scroll", updateHeader);

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("mobileMenu");
const menuClose = document.getElementById("menuClose");
function setMenu(open) {
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn.addEventListener("click", () => setMenu(true));
menuClose.addEventListener("click", () => setMenu(false));
menu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => setMenu(false)));

const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroPagination = document.getElementById("heroPagination");
const heroProperty = document.getElementById("heroProperty");
if (heroSlides.length && heroPagination && heroProperty) {
  const propertyLabels = [
    ["77 BLACKTHORN LANE", "BRAMPTON, ON"],
    ["SPACIOUS DETACHED HOME", "Oakville, ON"],
    ["TIMELESS BRICK RESIDENCE", "ETOBICOKE, ON"],
    ["CONTEMPORARY FAMILY HOME", "BURLINGTON, ON"],
  ];
  const dots = [];
  let heroIndex = 0;
  let heroTimer;

  function goHero(i) {
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, index) =>
      slide.classList.toggle("active", index === heroIndex),
    );
    dots.forEach((dot, index) =>
      dot.classList.toggle("active", index === heroIndex),
    );
    heroProperty.innerHTML = `${propertyLabels[heroIndex][0]} <span>${propertyLabels[heroIndex][1]}</span>`;
    clearInterval(heroTimer);
    heroTimer = setInterval(() => goHero(heroIndex + 1), 6000);
  }

  heroSlides.forEach((_, index) => {
    const button = document.createElement("button");
    button.className = "hero-dot" + (index === 0 ? " active" : "");
    button.textContent = String(index + 1).padStart(2, "0");
    button.addEventListener("click", () => goHero(index));
    heroPagination.appendChild(button);
    dots.push(button);
  });

  heroTimer = setInterval(() => goHero(heroIndex + 1), 6000);
}

const listingTrack = document.getElementById("listingTrack");

const listingPrev = document.getElementById("listingPrev");
const listingNext = document.getElementById("listingNext");

if (listingPrev && listingNext && listingTrack) {
  listingPrev.addEventListener("click", () =>
    listingTrack.scrollBy({
      left: -listingTrack.clientWidth * 0.72,
      behavior: "smooth",
    }),
  );

  listingNext.addEventListener("click", () =>
    listingTrack.scrollBy({
      left: listingTrack.clientWidth * 0.72,
      behavior: "smooth",
    }),
  );
}

const q = document.getElementById("testimonialQuote"),
  n = document.getElementById("testimonialName"),
  c = document.getElementById("testCount");
const testPrev = document.getElementById("testPrev");
const testNext = document.getElementById("testNext");

if (q && n && c && testPrev && testNext) {
  const testimonials = [
    [
      "Professional, strategic and deeply knowledgeable. The team made the process clear from beginning to end and delivered the level of care we hoped for.",
      "Sara D.",
    ],
    [
      "Communication was prompt, the advice was thoughtful and every detail felt organized. We always knew what the next step was.",
      "Thomas B.",
    ],
    [
      "From presentation to negotiation, the process felt polished and transparent. The marketing made our property stand out immediately.",
      "Ayan F.",
    ],
    [
      "Patient, responsive and never pushy. We felt genuinely represented throughout the entire buying experience.",
      "Megah W.",
    ],
  ];
  let testIndex = 0;

  function showTest(i) {
    testIndex = (i + testimonials.length) % testimonials.length;
    q.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 350 },
    );
    q.textContent = testimonials[testIndex][0];
    n.textContent = "— " + testimonials[testIndex][1];
    c.textContent =
      String(testIndex + 1).padStart(2, "0") +
      " / " +
      String(testimonials.length).padStart(2, "0");
  }

  testPrev.addEventListener("click", () => showTest(testIndex - 1));
  testNext.addEventListener("click", () => showTest(testIndex + 1));
}

document.querySelectorAll(".faq-item button").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const ans = item.querySelector(".faq-answer");
    const open = item.classList.toggle("open");
    ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0px";
  }),
);

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    }),
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const logoRow = document.querySelector(".logo-row");
if (logoRow) logoRow.innerHTML += logoRow.innerHTML;

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector(".contact-submit");
    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = "Sending...";

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        contactForm.reset();

        submitButton.innerHTML = "Message Sent ✓";

        setTimeout(() => {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }, 3000);
      } else {
        submitButton.innerHTML = "Please Try Again";

        setTimeout(() => {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }, 3000);
      }
    } catch (error) {
      submitButton.innerHTML = "Something Went Wrong";

      setTimeout(() => {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }, 3000);
    }
  });
}
