// Castle Robotics site scripts: mobile menu, dropdowns, animated counters.

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");

function closeDropdowns(except) {
  dropdownToggles.forEach((btn) => {
    if (btn !== except) btn.setAttribute("aria-expanded", "false");
  });
}

navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
  document.body.classList.toggle("nav-open", !open);
});

dropdownToggles.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = btn.getAttribute("aria-expanded") === "true";
    closeDropdowns(btn);
    btn.setAttribute("aria-expanded", String(!open));
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".has-dropdown")) closeDropdowns();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const openBtn = document.querySelector('[data-dropdown-toggle][aria-expanded="true"]');
  closeDropdowns();
  openBtn?.focus();
});

// Shadow on the sticky header once the page scrolls.
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Count-up animation. Numbers are already correct in the HTML, so the
// animation is purely decorative and is skipped for reduced-motion users.
const counters = document.querySelectorAll("[data-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
  const animate = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => io.observe(el));
}
