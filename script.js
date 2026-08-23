const header = document.getElementById("siteHeader");
window.addEventListener("scroll", () =>
  header.classList.toggle("scrolled", window.scrollY > 40),
);

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
const propertyLabels = [
  ["345 Mountain Brow Road", "Waterdown, ON"],
  ["2054 Lakeshore Road East", "Oakville, ON"],
  ["1540 Watersedge Road", "Mississauga, ON"],
  ["Signature Residence", "Oakville, ON"],
];
let heroIndex = 0,
  heroTimer;
heroSlides.forEach((_, i) => {
  const b = document.createElement("button");
  b.className = "hero-dot" + (i === 0 ? " active" : "");
  b.textContent = String(i + 1).padStart(2, "0");
  b.addEventListener("click", () => goHero(i));
  heroPagination.appendChild(b);
});
const dots = [...document.querySelectorAll(".hero-dot")];
function goHero(i) {
  heroIndex = (i + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((s, n) => s.classList.toggle("active", n === heroIndex));
  dots.forEach((d, n) => d.classList.toggle("active", n === heroIndex));
  heroProperty.innerHTML = `${propertyLabels[heroIndex][0]} <span>${propertyLabels[heroIndex][1]}</span>`;
  clearInterval(heroTimer);
  heroTimer = setInterval(() => goHero(heroIndex + 1), 6000);
}
heroTimer = setInterval(() => goHero(heroIndex + 1), 6000);

const listingTrack = document.getElementById("listingTrack");
document.getElementById("listingPrev").addEventListener("click", () =>
  listingTrack.scrollBy({
    left: -listingTrack.clientWidth * 0.72,
    behavior: "smooth",
  }),
);
document.getElementById("listingNext").addEventListener("click", () =>
  listingTrack.scrollBy({
    left: listingTrack.clientWidth * 0.72,
    behavior: "smooth",
  }),
);

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
const q = document.getElementById("testimonialQuote"),
  n = document.getElementById("testimonialName"),
  c = document.getElementById("testCount");
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
document
  .getElementById("testPrev")
  .addEventListener("click", () => showTest(testIndex - 1));
document
  .getElementById("testNext")
  .addEventListener("click", () => showTest(testIndex + 1));

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
