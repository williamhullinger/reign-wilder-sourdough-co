// ================================
// MOBILE NAVIGATION
// ================================

function initMobileNavigation() {
  const navToggle = document.querySelector(".nav__toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (!navToggle || !mobileMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const isClickInsideMenu =
      mobileMenu.contains(event.target) || navToggle.contains(event.target);

    if (!isClickInsideMenu && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ================================
// EVENT PAGE POPUPS
// ================================

function initEventModal() {
  const eventModal = document.getElementById("event-modal");
  const eventModalTitle = document.getElementById("event-modal-title");
  const eventModalType = document.getElementById("event-modal-type");
  const eventModalActions = document.getElementById("event-modal-actions");

  if (!eventModal || !eventModalTitle || !eventModalType || !eventModalActions) {
    return;
  }

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
        appleLink.href = trigger.dataset.apple || "#";
        appleLink.target = "_blank";
        appleLink.rel = "noopener noreferrer";
        appleLink.textContent = "Open in Apple Maps";

        const googleLink = document.createElement("a");
        googleLink.className = "event-modal__link event-modal__link--secondary";
        googleLink.href = trigger.dataset.google || "#";
        googleLink.target = "_blank";
        googleLink.rel = "noopener noreferrer";
        googleLink.textContent = "Open in Google Maps";

        eventModalActions.append(appleLink, googleLink);
      }

      if (modalType === "calendar") {
        eventModalType.textContent = "Add to Calendar";

        const icsLink = document.createElement("a");
        icsLink.className = "event-modal__link";
        icsLink.href = trigger.dataset.ics || "#";
        icsLink.textContent = "Apple Calendar / Outlook (.ics)";

        const googleCalendarLink = document.createElement("a");
        googleCalendarLink.className = "event-modal__link event-modal__link--secondary";
        googleCalendarLink.href = trigger.dataset.googleCalendar || "#";
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
// EVENTS GALLERY CAROUSEL
// ================================

function initEventsCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const viewport = carousel.querySelector(".events-carousel__viewport");
  const track = carousel.querySelector(".events-carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".events-carousel__slide"));
  const prevBtn = carousel.querySelector(".events-carousel__btn--prev");
  const nextBtn = carousel.querySelector(".events-carousel__btn--next");
  const dotsContainer = document.querySelector("[data-carousel-dots]");

  if (!viewport || !track || !slides.length || !prevBtn || !nextBtn || !dotsContainer) {
    return;
  }

  let currentIndex = 0;
  let autoplayId = null;

  dotsContainer.innerHTML = "";

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "events-carousel__dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.dataset.index = String(index);
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".events-carousel__dot"));

  function updateCarousel() {
    const activeSlide = slides[currentIndex];
    const viewportWidth = viewport.clientWidth;
    const slideWidth = activeSlide.offsetWidth;
    const slideLeft = activeSlide.offsetLeft;
    const offset = slideLeft - (viewportWidth - slideWidth) / 2;

    track.style.transform = `translateX(-${Math.max(offset, 0)}px)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = window.setInterval(nextSlide, 3500);
  }

  function stopAutoplay() {
    if (autoplayId !== null) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.index));
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  window.addEventListener("resize", updateCarousel);
  window.addEventListener("load", updateCarousel);

  updateCarousel();
  startAutoplay();
}

// ================================
// HEADER / FOOTER COMPONENTS
// ================================

function loadHeader() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  fetch("components/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerPlaceholder.innerHTML = data;
      initMobileNavigation();
    })
    .catch((error) => {
      console.error("Error loading header:", error);
    });
}

function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  fetch("components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      footerPlaceholder.innerHTML = data;

      const year = document.getElementById("year");
      if (year) {
        year.textContent = String(new Date().getFullYear());
      }
    })
    .catch((error) => {
      console.error("Error loading footer:", error);
    });
}

// ================================
// INIT
// ================================

loadHeader();
loadFooter();
initEventModal();
initEventsCarousel();