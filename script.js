// ================================
// HEADER / NAV COMPONENTS
// ================================

// Load header component (reusable across all pages)
fetch("components/header.html")
  .then((response) => response.text())
  .then((data) => {
    const headerPlaceholder = document.getElementById("header-placeholder");

    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = data;

      // ================================
// MOBILE NAVIGATION
// ================================

// Mobile navigation toggle (hamburger menu)
const navToggle = document.querySelector(".nav__toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}
    }
  });


// ================================
// FOOTER COMPONENT
// ================================

// Load footer component (reusable across all pages)
fetch("components/footer.html")
  .then((response) => response.text())
  .then((data) => {
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = data;

      // Footer copyright year
      const year = document.getElementById("year");

      if (year) {
        year.textContent = new Date().getFullYear();
      }
    }
  });

