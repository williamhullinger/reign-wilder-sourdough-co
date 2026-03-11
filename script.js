const navToggle = document.querySelector(".nav__toggle");
const leftLinks = document.querySelector(".nav__links--left");
const rightLinks = document.querySelector(".nav__links--right");

if (navToggle && leftLinks && rightLinks) {
  navToggle.addEventListener("click", () => {
    leftLinks.classList.toggle("is-open");
    rightLinks.classList.toggle("is-open");
  });
}