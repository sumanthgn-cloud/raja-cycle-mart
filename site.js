// Decide where to load posts.json from
const POSTS_JSON = window.location.pathname.includes('/blog/')
  ? '../posts.json'
  : 'posts.json';

async function loadPosts() {
  try {
    const response = await fetch(POSTS_JSON);
    if (!response.ok) throw new Error('Unable to load posts metadata');
    return await response.json();
  } catch (error) {
    console.error('Error loading posts.json:', error);
    return [];
  }
}

// --- Card creation & listing ---

function createBlogCard(post) {
  const card = document.createElement('article');
  card.className = 'blog-card';
  card.innerHTML = `
    <p class="blog-meta">${post.category} · ${post.readTime} min read</p>
    <h3>${post.title}</h3>
    <p>${post.excerpt}</p>
    <a href="${post.url}">Read article →</a>
  `;
  return card;
}

// Home page preview (max 3 posts)
function renderPreview(posts) {
  const container = document.querySelector('[data-blog-preview]');
  if (!container) return;
  container.innerHTML = '';
  posts.slice(0, 3).forEach((post) => {
    container.appendChild(createBlogCard(post));
  });
}

// Blog index list (ALL matching posts)
function renderBlogList(posts, container) {
  container.innerHTML = '';
  if (!posts.length) {
    container.innerHTML = '<p>No articles found. Try another keyword.</p>';
    return;
  }
  posts.forEach((post) => {
    container.appendChild(createBlogCard(post));
  });
}

// Blog index search + filters
function initBlogPages(posts) {
  const listContainer = document.querySelector('[data-blog-list]');
  const searchInput = document.querySelector('[data-blog-search]');
  const chips = document.querySelectorAll('[data-category]');

  if (!listContainer) return;

  let activeCategory = 'all';
  let query = '';

  function filterPosts() {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'all' || post.category === activeCategory;
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  function updateList() {
    renderBlogList(filterPosts(), listContainer);
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category;
      updateList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      query = event.target.value.trim().toLowerCase();
      updateList();
    });
  }

  updateList();
}

// Related posts on article pages
function initRelated(posts) {
  const relatedContainer = document.querySelector('[data-related]');
  if (!relatedContainer) return;

  const canonical = document.querySelector('link[rel="canonical"]');
  const slug = canonical
    ? canonical.href.split('/').pop().replace('.html', '')
    : '';

  const current = posts.find((post) => post.slug === slug);

  const related = posts
    .filter((post) => {
      if (post.slug === slug) return false;
      if (!current) return true;
      const sameCategory = post.category === current.category;
      const sharedTag = post.tags?.some((tag) =>
        current.tags?.includes(tag)
      );
      return sameCategory || sharedTag;
    })
    .slice(0, 3);

  relatedContainer.innerHTML = '';
  if (!related.length) {
    relatedContainer.innerHTML =
      '<p>No related articles yet. More posts coming soon.</p>';
    return;
  }

  related.forEach((post) => {
    const link = document.createElement('a');
    link.href = post.url;
    link.textContent = post.title;
    relatedContainer.appendChild(link);
  });
}

// Contact form mailto
function initContactForm() {
  const form = document.querySelector('[data-mailto]');
  if (!form) return;
  const mailto = form.dataset.mailto;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const subject = encodeURIComponent(
      `Cycle service request from ${
        formData.get('name') || 'Raja Cycle Mart site'
      }`
    );
    const body = encodeURIComponent(
      `Phone: ${formData.get('phone')}\n` +
        `Cycle model: ${
          formData.get('model') || 'Not provided'
        }\n` +
        `Message: ${formData.get('message')}`
    );
    window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
  });
}

// Initialise everything
document.addEventListener('DOMContentLoaded', async () => {
  initContactForm();

  const posts = await loadPosts();
  if (!posts.length) return;

  renderPreview(posts);
  initBlogPages(posts);
  initRelated(posts);
});
