
const products = [
  {
    id: 1,
    name: "جاكيت كلاسيكي",
    category: "رجالي",
    description: "قطعة عصرية لإطلالة يومية مميزة.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    label: "اختيار المحرر",
    rating: "★★★★★",
    tag: "CASUAL"
  },
  {
    id: 2,
    name: "حذاء رياضي",
    category: "أحذية",
    description: "راحة وعصرية في كل خطوة.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    label: "TRENDING",
    rating: "★★★★★",
    tag: "SPORT"
  },
  {
    id: 3,
    name: "حقيبة أنيقة",
    category: "إكسسوارات",
    description: "تفاصيل بسيطة تكمل إطلالتك.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85",
    label: "MINIMAL",
    rating: "★★★★☆",
    tag: "ACCESSORIES"
  },
  {
    id: 4,
    name: "قميص أبيض",
    category: "رجالي",
    description: "أساس كل خزانة ملابس أنيقة.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
    label: "ESSENTIAL",
    rating: "★★★★★",
    tag: "BASIC"
  },
  {
    id: 5,
    name: "إطلالة عصرية",
    category: "نسائي",
    description: "تنسيق يجمع البساطة والتميز.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85",
    label: "NEW SEASON",
    rating: "★★★★★",
    tag: "MODERN"
  },
  {
    id: 6,
    name: "حذاء يومي",
    category: "أحذية",
    description: "تصميم بسيط يسهل تنسيقه.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85",
    label: "EVERYDAY",
    rating: "★★★★☆",
    tag: "CASUAL"
  },
  {
    id: 7,
    name: "كنزة مريحة",
    category: "نسائي",
    description: "خامة ناعمة لإطلالة هادئة.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85",
    label: "COMFORT",
    rating: "★★★★★",
    tag: "SOFT"
  },
  {
    id: 8,
    name: "ساعة كلاسيكية",
    category: "إكسسوارات",
    description: "لمسة أنيقة بتفاصيل دقيقة.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
    label: "TIMELESS",
    rating: "★★★★★",
    tag: "CLASSIC"
  }
];

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const savedKey = "noir-discovery-saved";

let saved = loadSaved();
let currentFilter = "الكل";
let searchQuery = "";
let sortMode = "featured";
let toastTimer;

function loadSaved() {
  try {
    const data = JSON.parse(localStorage.getItem(savedKey) || "[]");
    return Array.isArray(data) ? data.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function saveSaved() {
  try {
    localStorage.setItem(savedKey, JSON.stringify(saved));
  } catch {
    showToast("تعذر حفظ الاختيارات في هذا المتصفح");
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

function createProductCard(product) {
  const isSaved = saved.includes(product.id);

  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
        >

        <span class="product-label">
          ${escapeHTML(product.label)}
        </span>

        <button
          class="favorite-button ${isSaved ? "active" : ""}"
          data-favorite="${product.id}"
          aria-label="${isSaved ? "إزالة من المحفوظات" : "حفظ القطعة"}"
          aria-pressed="${isSaved}"
        >${isSaved ? "♥" : "♡"}</button>

        <button
          class="view-button"
          data-view="${product.id}"
        >${isSaved ? "✓ محفوظة لديك" : "♡ احفظ هذه القطعة"}</button>
      </div>

      <div class="product-info">
        <div class="product-category">
          ${escapeHTML(product.category)}
        </div>

        <h3 class="product-title">
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="product-rating">${product.rating}</div>

        <div class="product-details">
          <span class="product-tag">${escapeHTML(product.tag)}</span>
          <span class="product-tag">للاكتشاف والإلهام</span>
        </div>

        <button
          class="product-link"
          data-view="${product.id}"
        >
          <span>اكتشف تفاصيل القطعة</span>
          <span>←</span>
        </button>
      </div>
    </article>
  `;
}

function getFilteredProducts() {
  let result = products.filter(product => {
    const categoryMatch =
      currentFilter === "الكل" ||
      product.category === currentFilter;

    const searchText =
      `${product.name} ${product.category} ${product.description} ${product.tag}`
        .toLocaleLowerCase("ar");

    const searchMatch =
      searchText.includes(searchQuery.toLocaleLowerCase("ar"));

    return categoryMatch && searchMatch;
  });

  if (sortMode === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  }

  if (sortMode === "newest") {
    result.sort((a, b) => b.id - a.id);
  }

  return result;
}

function renderProducts() {
  const result = getFilteredProducts();

  $("#productGrid").innerHTML =
    result.map(createProductCard).join("");

  $("#resultsCount").textContent =
    `${result.length} ${result.length === 1 ? "اكتشاف" : "اكتشافات"}`;

  $("#emptyState").hidden = result.length > 0;
}

function renderSaved() {
  const result = products.filter(product => saved.includes(product.id));

  $("#savedGrid").innerHTML =
    result.map(createProductCard).join("");

  $("#savedEmpty").hidden = result.length > 0;
}

function renderAll() {
  renderProducts();
  renderSaved();
}

function setFilter(category) {
  currentFilter = category;

  $$(".filter-button").forEach(button => {
    const active = button.dataset.filter === category;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderProducts();
}

function toggleSaved(id) {
  if (saved.includes(id)) {
    saved = saved.filter(item => item !== id);
    showToast("تمت إزالة القطعة من المحفوظات");
  } else {
    saved.push(id);
    showToast("تم حفظ القطعة في اختياراتك");
  }

  saveSaved();
  renderAll();
}

function handleProductAction(event) {
  const favorite = event.target.closest("[data-favorite]");
  const view = event.target.closest("[data-view]");

  if (favorite) {
    toggleSaved(Number(favorite.dataset.favorite));
    return;
  }

  if (view) {
    const product = products.find(
      item => item.id === Number(view.dataset.view)
    );

    if (product) {
      showToast(`${product.name} — ${product.description}`);
    }
  }
}

// البحث
$("#searchInput").addEventListener("input", event => {
  searchQuery = event.target.value.trim();
  renderProducts();
});

$("#clearSearch").addEventListener("click", () => {
  $("#searchInput").value = "";
  searchQuery = "";
  renderProducts();
  $("#searchInput").focus();
});

$("#searchToggle").addEventListener("click", () => {
  $("#searchArea").scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => {
    $("#searchInput").focus();
  }, 350);
});

// تصنيفات المنتجات
$("#filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  setFilter(button.dataset.filter);
});

$$(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    setFilter(card.dataset.category);

    $("#discover").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// الترتيب
$("#sortSelect").addEventListener("change", event => {
  sortMode = event.target.value;
  renderProducts();
});

// إعادة ضبط البحث والتصنيفات
$("#resetFilters").addEventListener("click", () => {
  searchQuery = "";
  currentFilter = "الكل";
  sortMode = "featured";

  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";

  setFilter("الكل");
});

// المفضلة: يعمل الحدث في شبكتي المنتجات والمحفوظات
$("#productGrid").addEventListener("click", handleProductAction);
$("#savedGrid").addEventListener("click", handleProductAction);

// قائمة الهاتف
$("#menuToggle").addEventListener("click", () => {
  const isOpen = $("#nav").classList.toggle("open");

  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").textContent = isOpen ? "×" : "☰";
});

$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    $("#nav").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    $("#menuToggle").textContent = "☰";

    $$(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// إظهار رابط القسم النشط عند التمرير
const sections = $$("main section[id]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;

    const id = visible[0].target.id;

    $$(".nav-link").forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${id}`
      );
    });
  }, {
    rootMargin: "-25% 0px -60% 0px",
    threshold: [0, 0.1, 0.3, 0.6]
  });

  sections.forEach(section => observer.observe(section));
}

// التشغيل الأول
renderAll();
