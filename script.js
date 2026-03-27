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

  // close mobile menu when clicking outside of it
  document.addEventListener("click", (event) => {
    const isClickInsideMenu = 
    mobileMenu.contains(event.target) || navToggle.contains(event.target);

    if (!isClickInsideMenu && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", false);
    }
  });
}


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
    }
  });
