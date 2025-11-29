const POSTS_JSON = window.location.pathname.includes('/blog/')
  ? '../posts.json'
  : 'posts.json';

async function loadPosts() {
  try {
    const response = await fetch(POSTS_JSON);
    if (!response.ok) throw new Error('Unable to load posts metadata');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

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

function renderPreview(posts) {
  const container = document.querySelector('[data-blog-preview]');
  if (!container) return;
  container.innerHTML = '';
  posts.slice(0, 5).forEach((post) => container.appendChild(createBlogCard(post)));
}

function renderBlogList(posts, container) {
  container.innerHTML = '';
  posts.forEach((post) => container.appendChild(createBlogCard(post)));
  if (!posts.length) {
    container.innerHTML = '<p>No articles found. Try another keyword.</p>';
  }
}

function initBlogPages(posts) {
  const listContainer = document.querySelector('[data-blog-list]');
  const searchInput = document.querySelector('[data-blog-search]');
  const chips = document.querySelectorAll('[data-category]');

  if (!listContainer) return;

  let activeCategory = 'all';
  let query = '';

  function filterPosts() {
    return posts.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
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

function initRelated(posts) {
  const relatedContainer = document.querySelector('[data-related]');
  if (!relatedContainer) return;

  const canonical = document.querySelector('link[rel="canonical"]');
  const slug = canonical ? canonical.href.split('/').pop()?.replace('.html', '') : '';
  const current = posts.find((post) => post.slug === slug);
  const related = posts
    .filter((post) => post.slug !== slug && (post.category === current?.category || (post.tags || []).some((tag) => current?.tags?.includes(tag))))
    .slice(0, 3);

  relatedContainer.innerHTML = '';
  related.forEach((post) => {
    const link = document.createElement('a');
    link.href = post.url;
    link.textContent = post.title;
    relatedContainer.appendChild(link);
  });

  if (!related.length) {
    relatedContainer.innerHTML = '<p>No related articles yet. More posts coming soon.</p>';
  }
}

function initContactForm() {
  const form = document.querySelector('[data-mailto]');
  if (!form) return;
  const mailto = form.dataset.mailto;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const subject = encodeURIComponent(`Cycle service request from ${formData.get('name') || 'Raja Cycle Mart site'}`);
    const body = encodeURIComponent(
      `Phone: ${formData.get('phone')}\nCycle model: ${formData.get('model') || 'Not provided'}\nMessage: ${formData.get('message')}`
    );
    window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
  });
}

/* CHATBOT LOGIC */
function toggleChatbot() {
  const window = document.querySelector('.chatbot-window');
  const badge = document.querySelector('.chatbot-badge');
  const isHidden = window.hidden;
  window.hidden = !isHidden;
  if (isHidden) {
    badge.style.display = 'none';
    setTimeout(() => document.getElementById('chat-input').focus(), 100);
  }
}

function addMessage(text, sender) {
  const container = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = `<p>${text}</p>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function handleOption(option) {
  let response = '';
  switch (option) {
    case 'pricing':
      response = "CycleAssist here! 🛠️ Our service charges start from ₹50. Punctures are ₹80-120. For a full checkup, please visit the shop for a quote.";
      break;
    case 'hours':
      response = "We are open Mon-Sat 9:30 AM - 8:00 PM, and Sun 10:00 AM - 5:00 PM. ⏰";
      break;
    case 'location':
      response = "Find us at SS Puram Main Road, near Sri Sitharama Temple. 📍 Click 'Get Directions' in the menu!";
      break;
    case 'repair':
      response = "We fix all cycles! MTBs, gear cycles, kids' bikes. Punctures & brakes are done instantly. 🚲";
      break;
    default:
      response = "I'm just a bot, but Mr. Nagabhushan is the expert! Please call +91 98446 29722 for help. 📞";
  }
  addMessage(response, 'bot');
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';

  // CycleAssist Logic
  setTimeout(() => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('price') || lowerText.includes('cost')) handleOption('pricing');
    else if (lowerText.includes('time') || lowerText.includes('open')) handleOption('hours');
    else if (lowerText.includes('where') || lowerText.includes('location')) handleOption('location');
    else if (lowerText.includes('puncture') || lowerText.includes('repair')) handleOption('repair');
    else addMessage("I'm learning! 🧠 For now, please call us or visit the shop for that.", 'bot');
  }, 600);
}

function handleEnter(event) {
  if (event.key === 'Enter') sendMessage();
}

/* BOOKING LOGIC */
function handleBooking(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('name');
  const cycle = formData.get('cycle_type');
  const service = formData.get('service_type');
  const date = formData.get('date');

  const text = `Hello Raja Cycle Mart, I would like to book a service.%0A%0A*Name:* ${name}%0A*Cycle:* ${cycle}%0A*Service:* ${service}%0A*Date:* ${date}`;

  window.open(`https://wa.me/919844629722?text=${text}`, '_blank');
  document.getElementById('booking-modal').close();
}

/* COOKIE BANNER & ANALYTICS */
function loadAnalytics() {
  // Prevent duplicate loading
  if (document.querySelector('script[src*="googletagmanager"]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-DP7GDRXVQB";
  document.head.appendChild(script);

  gtag('config', 'G-DP7GDRXVQB');
}

function acceptCookies() {
  document.getElementById('cookie-banner').hidden = true;
  // Set cookie for 365 days
  document.cookie = "cookieConsent=true; max-age=31536000; path=/; SameSite=Lax";
  loadAnalytics();
}

function checkCookies() {
  // Check if cookie exists
  if (!document.cookie.split('; ').find(row => row.startsWith('cookieConsent=true'))) {
    document.getElementById('cookie-banner').hidden = false;
  } else {
    loadAnalytics();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  initContactForm();
  checkCookies();

  // Load blog posts if on blog pages
  const posts = await loadPosts();
  if (posts.length) {
    renderPreview(posts);
    initBlogPages(posts);
    initRelated(posts);
  }
});
