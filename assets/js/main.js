/* ============================================================
   GESTORÍA INTEGRAL LA SOCIEDAD — main.js
   Sin dependencias externas: menú mobile, acordeón FAQ
   y reveals on-scroll vía IntersectionObserver.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Navbar scroll ---------- */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var onNavbarScroll = function () {
      if (window.scrollY > 10) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onNavbarScroll, { passive: true });
    onNavbarScroll();
  }

  /* ---------- Menú mobile ---------- */
  var navToggle = document.getElementById('navToggle');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar el menú al elegir un link
    navbar.querySelectorAll('.navbar__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navbar.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Acordeón FAQ ---------- */
  document.querySelectorAll('.faq-item__q').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      var answer = item.querySelector('.faq-item__a');
      var isOpen = item.classList.contains('is-open');

      // Cierra los otros items abiertos (acordeón exclusivo)
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-item__a').style.height = '0px';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        answer.style.height = '0px';
      } else {
        item.classList.add('is-open');
        answer.style.height = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Galería: reveal escalonado y ligado al scroll ---------- */
  var galleryGrid = document.getElementById('galleryGrid');

  if (galleryGrid) {
    var items = Array.prototype.slice.call(galleryGrid.querySelectorAll('.gallery-item'));
    var cols = 5;
    var centerRow = 1, centerCol = 2; // índice 7 (0-based) = fila 1, col 2

    // Orden de aparición: del centro hacia afuera
    var withOrder = items.map(function (item, i) {
      var row = Math.floor(i / cols);
      var col = i % cols;
      var distance = Math.hypot(row - centerRow, col - centerCol);
      return { item: item, distance: distance };
    });
    withOrder.sort(function (a, b) { return a.distance - b.distance; });
    withOrder.forEach(function (entry, order) {
      entry.item.dataset.order = order;
    });

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
    } else {
      var total = items.length;
      var ticking = false;

      var updateGallery = function () {
        ticking = false;
        var rect = galleryGrid.getBoundingClientRect();
        var vh = window.innerHeight;

        // Ventana de scroll en la que se "despliega" la galería
        var start = vh * 0.92;  // el grid empieza a revelarse al entrar
        var end = vh * 0.3;     // termina de revelarse bien adentro del viewport

        var progress = (start - rect.top) / (start - end);
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        items.forEach(function (item) {
          var order = Number(item.dataset.order);
          var threshold = order / total;
          if (progress >= threshold) {
            item.classList.add('is-visible');
          } else {
            item.classList.remove('is-visible');
          }
        });
      };

      var onScroll = function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateGallery);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      updateGallery();
    }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: si no hay soporte, mostrar todo directo
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

});
