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
// EVENT PAGE POPUPS
// ================================

// Reusable event directions/calendar popup
const eventModal = document.getElementById("event-modal");
const eventModalTitle = document.getElementById("event-modal-title");
const eventModalType = document.getElementById("event-modal-type");
const eventModalActions = document.getElementById("event-modal-actions");

if (eventModal && eventModalTitle && eventModalType && eventModalActions) {
  const closeEventModal = () => {
    eventModal.hidden = true;
    eventModalActions.innerHTML = "";
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-modal]");

    if (trigger) {
      const modalType = trigger.dataset.modal;
      const title = trigger.dataset.title || "Choose an Option";

      eventModalTitle.textContent = title;
      eventModalActions.innerHTML = "";

      if (modalType === "directions") {
        eventModalType.textContent = "Directions";

        const appleLink = document.createElement("a");
        appleLink.className = "event-modal__link";
        appleLink.href = trigger.dataset.apple;
        appleLink.target = "_blank";
        appleLink.rel = "noopener noreferrer";
        appleLink.textContent = "Open in Apple Maps";

        const googleLink = document.createElement("a");
        googleLink.className = "event-modal__link event-modal__link--secondary";
        googleLink.href = trigger.dataset.google;
        googleLink.target = "_blank";
        googleLink.rel = "noopener noreferrer";
        googleLink.textContent = "Open in Google Maps";

        eventModalActions.append(appleLink, googleLink);
      }

      if (modalType === "calendar") {
        eventModalType.textContent = "Add to Calendar";

        const icsLink = document.createElement("a");
        icsLink.className = "event-modal__link";
        icsLink.href = trigger.dataset.ics;
        icsLink.textContent = "Apple Calendar / Outlook (.ics)";

        const googleCalendarLink = document.createElement("a");
        googleCalendarLink.className = "event-modal__link event-modal__link--secondary";
        googleCalendarLink.href = trigger.dataset.googleCalendar;
        googleCalendarLink.target = "_blank";
        googleCalendarLink.rel = "noopener noreferrer";
        googleCalendarLink.textContent = "Google Calendar";

        eventModalActions.append(icsLink, googleCalendarLink);
      }

      eventModal.hidden = false;
      return;
    }

    if (event.target.closest("[data-modal-close]")) {
      closeEventModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !eventModal.hidden) {
      closeEventModal();
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
