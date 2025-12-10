// Raja Cycle Mart - Site JavaScript
// Handles: Cookie Consent, Email Capture, Booking, Discount Popup, Chatbot

// --------- COOKIE BANNER (NEW) ----------
// basic cookie helpers
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

function loadGA() {
  console.log("GA4 Loaded");
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
}

function acceptAllCookies() {
  setCookie("cookie_consent", "accepted", 365);
  const banner = document.getElementById("cookie-banner");
  if (banner) banner.style.display = "none";
  loadGA();
}

// --------- CHATBOT ----------
let chatbotOpen = false;

function toggleChatbot() {
  const window = document.getElementById('chatbotWindow');

  if (!chatbotOpen) {
    window.classList.add('active');
    window.style.display = 'block';
    chatbotOpen = true;
    localStorage.setItem('chatbotState', 'open');
  } else {
    window.classList.remove('active');
    window.style.display = 'none';
    chatbotOpen = false;
    localStorage.setItem('chatbotState', 'closed');
  }
}

// Check chatbot state on load
function checkChatbotState() {
  const state = localStorage.getItem('chatbotState');
  if (state === 'open') {
    const window = document.getElementById('chatbotWindow');
    if (window) {
      window.classList.add('active');
      window.style.display = 'block';
      chatbotOpen = true;
    }
  }
}

function sendChatMessage(message) {
  const chatBody = document.getElementById('chatBody');

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Bot response
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';

    if (message === 'Book a service') {
      botMsg.innerHTML = 'Great choice. Most riders book in under 1 minute. You can <a href="#book-service" onclick="toggleChatbot()" style="color: #2F7A44; font-weight: bold;">book your slot here</a> or WhatsApp / call us on <strong>+91 98446 29722</strong>. We’ll just ask for your cycle model and service type.';
    } else if (message === 'Service price') {
      botMsg.innerHTML = 'To keep things transparent, common services are:<br>• Basic safety check from <strong>₹300</strong><br>• Puncture repair around <strong>₹50</strong><br><br>Prices may vary by cycle model. Share your model on WhatsApp for an exact quote – no obligation.';
    } else if (message === 'Timing & location') {
      botMsg.innerHTML = 'We are at SS Puram Main Road, near Sri Sitharama Temple, Tumkur. <br><strong>Mon-Sat:</strong> 9:30 AM - 8:00 PM<br><strong>Sun:</strong> 10:00 AM - 5:00 PM';
    } else if (message === 'Buying a new cycle') {
      botMsg.innerHTML = 'Thinking of a new cycle? Visit our shop and we’ll help you choose based on height, purpose, and budget. You can also read our <a href="blog/best-budget-cycles-guide.html" style="color:#2F7A44; font-weight:bold;">budget cycle guide</a> before you visit.';
    } else {
      botMsg.innerHTML = 'Thanks for your message. For quick help, you can call or WhatsApp us on <strong>+91 98446 29722</strong>, or visit the shop during working hours. We’ll give clear, honest suggestions – no pressure to buy.';
    }

    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

// Rotate top bar offers
function initTopBarRotation() {
  const el = document.getElementById('topBarOffer');
  if (!el) return;
  const offers = [
    'Student Discount – 10% OFF on full tune-up',
    'Free brake check with every puncture repair',
    'Refer a friend and get ₹50 OFF'
  ];
  let idx = 0;
  el.textContent = offers[idx];
  setInterval(() => {
    idx = (idx + 1) % offers.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = offers[idx];
      el.style.opacity = '1';
    }, 200);
  }, 5000);
}

// --------- MOBILE MENU ----------
function toggleMobileMenu() {
  const header = document.querySelector('.site-header');
  header.classList.toggle('mobile-open');
}

// Auto-active link highlighting
(function () {
  try {
    var links = document.querySelectorAll('.nav-center .nav-link');
    var path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      // normalize: compare last part of the href
      var hrefName = href.split('/').pop();
      if (hrefName === path) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  } catch (e) { console.warn(e); }
})();

// --------- EMAIL POPUP ----------
function showEmailPopup() {
  if (arguments.length === 0 && sessionStorage.getItem('emailPopupShown')) return;
  if (document.getElementById('emailPopup')) return;

  const popup = document.createElement('div');
  popup.id = 'emailPopup';
  popup.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 3000;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(5px); animation: fadeIn 0.3s ease;
  `;

  popup.innerHTML = `
    <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
      <button onclick="closeEmailPopup()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
      <div style="width: 60px; height: 60px; background: #e8f5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #2E8B57; font-size: 1.5rem;">
        <i class="fas fa-envelope-open-text"></i>
      </div>
      <h3 style="margin-bottom: 0.5rem; color: #2C3E50;">Get Cycle Tips</h3>
      <p style="color: #666; margin-bottom: 1.5rem; font-size: 0.95rem;">Join 500+ Tumkur cyclists. Get maintenance tips and exclusive offers delivered to your inbox.</p>
      <form onsubmit="handleEmailSubmit(event)">
        <input type="email" placeholder="Your email address" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 1rem; font-family: inherit;">
        <button type="submit" class="btn btn-primary" style="width: 100%;">Subscribe Free</button>
      </form>
      <p style="font-size: 0.8rem; color: #999; margin-top: 1rem;">No spam. Unsubscribe anytime.</p>
    </div>
  `;

  document.body.appendChild(popup);
  sessionStorage.setItem('emailPopupShown', 'true');
}

function closeEmailPopup() {
  const popup = document.getElementById('emailPopup');
  if (popup) popup.remove();
}

function handleEmailSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const input = e.target.querySelector('input');

  btn.textContent = 'Subscribing...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Success! ✅';
    btn.style.backgroundColor = '#2E8B57';
    input.value = '';

    setTimeout(() => {
      closeEmailPopup();
    }, 1500);
  }, 1000);
}

// --------- INITIALIZATION ----------
document.addEventListener('DOMContentLoaded', () => {
  // Check for existing consent
  if (getCookie("cookie_consent") === "accepted") {
    loadGA();
  } else {
    // Show banner if not accepted
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "flex";
  }

  // Chatbot - Check state
  checkChatbotState();

  // Close mobile menu on click outside
  document.addEventListener('click', (e) => {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.primary-nav');
    const toggle = document.querySelector('.mobile-toggle');

    if (header && header.classList.contains('mobile-open') && nav && !nav.contains(e.target) && toggle && !toggle.contains(e.target)) {
      header.classList.remove('mobile-open');
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const header = document.querySelector('.site-header');
        if (header) header.classList.remove('mobile-open');
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  // Lead magnet popup on scroll ~50%
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrolled > 0.5 && !sessionStorage.getItem('emailPopupShown')) {
      showEmailPopup();
    }
  }, { passive: true });

  // Top bar rotation
  initTopBarRotation();
});
