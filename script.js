const revealElements = document.querySelectorAll(".reveal");
const progressBars = document.querySelectorAll("progress[data-value]");
const scrollProgress = document.querySelector(".scroll-progress");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  progressBars.forEach((progress) => {
    progress.value = 0;
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        entry.target.querySelectorAll?.("progress[data-value]").forEach((progress) => {
          progress.value = Number(progress.dataset.value || 0);
        });

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -48px 0px",
  },
);

revealElements.forEach((element) => observer.observe(element));

progressBars.forEach((progress) => {
  if (!progress.closest(".reveal")) {
    progress.value = Number(progress.dataset.value || 0);
  }
});

const updateScrollProgress = () => {
  if (!scrollProgress) return;

  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
  );
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const scrollable = documentHeight - viewportHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const progress = scrollable > 0 ? scrollTop / scrollable : 0;

  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
