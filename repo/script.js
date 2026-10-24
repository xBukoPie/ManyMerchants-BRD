// Data loading module
export const dataLoader = {
  async load() {
    const res = await fetch('./data/products.json');
    if (!res.ok) throw new Error(`Failed to load products.json: ${res.status}`);
    return await res.json();
  }
};

// Carousel module
export const carousel = {
  init(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const slides = container.querySelectorAll('.carousel-slide');
    if (slides.length < 2) return;

    let currentIndex = 0;
    const carouselContainer = container.querySelector('.carousel-container');
    const prevBtn = container.querySelector('.carousel-arrow.prev');
    const nextBtn = container.querySelector('.carousel-arrow.next');

    const updateCarousel = () => {
      carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    };

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-advance every 5 seconds
    let intervalId;
    const startAutoplay = () => {
      intervalId = setInterval(nextSlide, 5000);
    };
    const stopAutoplay = () => clearInterval(intervalId);

    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    startAutoplay();

    updateCarousel();
  }
};

// Modal module
export const modal = {
  currentProductId: null,
  form: null,

  init() {
    this.form = document.getElementById('preorder-form');
    if (!this.form) return;

    // Close on X or outside
    const modalEl = document.getElementById('preorder-modal');
    modalEl?.querySelector('.close-modal')?.addEventListener('click', () => this.close());
    modalEl?.addEventListener('click', (e) => {
      if (e.target === modalEl) this.close();
    });

    // Submit handler
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      // Simple validation
      if (!data.name || !data.email) {
        alert('Please fill out name and email');
        return;
      }
      // TODO: send to API or log
      console.log('Pre‑order submitted:', { productId: this.currentProductId, data });
      this.close();
    });
  },

  open(productId, productName) {
    this.currentProductId = productId;
    const modalEl = document.getElementById('preorder-modal');
    modalEl.classList.add('show');
    if (productName) {
      // optional: set product name in modal title
      const titleEl = modalEl.querySelector('.modal-content h2');
      if (titleEl) titleEl.textContent = `Pre‑order: ${productName}`;
    }
  },

  close() {
    const modalEl = document.getElementById('preorder-modal');
    modalEl.classList.remove('show');
    this.form?.reset();
  }
};

// Main UI rendering
async function renderIndexPage() {
  try {
    const products = await dataLoader.load();

    // Render hero carousel (first 3 products or a static subset)
    const heroContainer = document.getElementById('hero-carousel');
    const heroHtml = products.slice(0, 3).map((p, i) => `
      <div class="carousel-slide">
        <img src="${p.image}" alt="${p.name}">
        <div class="carousel-caption">
          <h3>${p.name}</h3>
          <p>$${p.price.toFixed(2)}</p>
        </div>
      </div>
    `).join('');
    if (heroContainer) {
      heroContainer.innerHTML = `
        <div class="carousel">
          <div class="carousel-container">
            ${heroHtml}
          </div>
          <button class="carousel-arrow prev">&#10094;</button>
          <button class="carousel-arrow next">&#10095;</button>
        </div>
      `;
      carousel.init('#hero-carousel .carousel');
    }

    // Render on‑sale carousel (only products where onSale:true)
    const onSaleContainer = document.getElementById('on-sale-carousel');
    const onSaleProducts = products.filter(p => p.onSale);
    const onSaleHtml = onSaleProducts.map(p => `
      <div class="carousel-slide">
        <img src="${p.image}" alt="${p.name}">
        <div class="carousel-caption">
          <h3>${p.name}</h3>
          <p>$${p.price.toFixed(2)} <span>(On Sale)</span></p>
        </div>
      </div>
    `).join('');
    if (onSaleContainer) {
      onSaleContainer.innerHTML = `
        <div class="carousel">
          <div class="carousel-container">
            ${onSaleHtml}
          </div>
          <button class="carousel-arrow prev">&#10094;</button>
          <button class="carousel-arrow next">&#10095;</button>
        </div>
      `;
      carousel.init('#on-sale-carousel .carousel');
    }

    // Render product grid (all products)
    const gridContainer = document.getElementById('product-grid');
    const gridHtml = products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <div class="content">
          <h3>${p.name}</h3>
          <p>${p.description || ''}</p>
          <div class="price">$${p.price.toFixed(2)}</div>
          <button class="preorder-btn" data-id="${p.id}" data-name="${p.name}">Pre‑order</button>
        </div>
      </div>
    `).join('');
    if (gridContainer) {
      gridContainer.innerHTML = gridHtml;
      // Attach pre‑order listeners
      gridContainer.querySelectorAll('.preorder-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const name = btn.dataset.name;
          modal.open(id, name);
        });
      });
    }

    // Products page – render full catalog with same card structure
    const catalogContainer = document.getElementById('product-list');
    if (catalogContainer) {
      catalogContainer.innerHTML = products.map(p => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <div class="content">
            <h3>${p.name}</h3>
            <p>${p.description || ''}</p>
            <div class="price">$${p.price.toFixed(2)}</div>
            <button class="preorder-btn" data-id="${p.id}" data-name="${p.name}">Pre‑order</button>
          </div>
        </div>
      `).join('');
      catalogContainer.querySelectorAll('.preorder-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const name = btn.dataset.name;
          modal.open(id, name);
        });
      });
    }

  } catch (err) {
    console.error('Error rendering page:', err);
    const main = document.querySelector('main');
    if (main) main.innerHTML += `<p class="error">Failed to load products: ${err.message}</p>`;
  }
}

// Initialize everything on DOMContentLoaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    modal.init();
    // Render index/home page UI only if on index.php
    if (window.location.pathname.endsWith('index.php') || window.location.pathname === '/' || window.location.pathname === '/index.php') {
      renderIndexPage();
    } else {
      // For products.php and info.php (non‑index pages) just load modal
      // Optionally fetch and render products on products.php when not index
      if (window.location.pathname.endsWith('products.php')) {
        renderIndexPage(); // same rendering logic; could be factored later
      }
    }
  });
}
