// Raja Cycle Mart - Site JavaScript
// Handles: Cookie Consent, Email Capture, Booking, Discount Popup, Chatbot

// --------- BASIC COOKIE HELPERS ----------
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
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

// --------- CONSENT MODE V2 ----------
function acceptAllCookies() {
  setCookie("cookie_consent", "accepted", 365);
  localStorage.setItem("cookie_consent", "accepted");
  hideCookieElements();
  enableConsentedFeatures();
}

function rejectAllCookies() {
  setCookie("cookie_consent", "rejected", 365);
  localStorage.setItem("cookie_consent", "rejected");
  hideCookieElements();
}

function savePreferences() {
  // In a real app, check toggle states
  // For now, assume if they clicked "Save", they accept selected (which are usually essential + analytics)
  setCookie("cookie_consent", "custom", 365);
  localStorage.setItem("cookie_consent", "custom");
  hideCookieElements();
}

function hideCookieElements() {
  const banner = document.getElementById('cookieBar');
  if (banner) banner.style.display = 'none';
  const panel = document.getElementById('cookiePreferencesPanel');
  if (panel) panel.style.display = 'none';
}

function checkExistingConsent() {
  const consent = localStorage.getItem("cookie_consent") || getCookie("cookie_consent");

  if (!consent) {
    // Show banner if no choice made yet
    setTimeout(() => {
      const banner = document.getElementById('cookieBar');
      if (banner) {
        banner.style.display = 'flex';
        updateCookieBarUI(banner);
      }
    }, 1000);
  } else {
    if (consent === "accepted" || consent === "custom") {
      enableConsentedFeatures();
    }
  }
}

function updateCookieBarUI(banner) {
  // Dynamically update buttons to match new requirement without editing all HTML files
  const actions = banner.querySelector('.cookie-actions');
  if (actions) {
    actions.innerHTML = `
      <button class="btn btn-sm" style="background:none; border:none; color:var(--text-muted); text-decoration:underline; cursor:pointer;" onclick="openCookiePreferences()">Cookie settings</button>
      <button class="btn btn-primary btn-sm" onclick="acceptAllCookies()">Accept</button>
    `;
  }

  // Inject Panel if not exists
  if (!document.getElementById('cookiePreferencesPanel')) {
    const panel = document.createElement('div');
    panel.id = 'cookiePreferencesPanel';
    panel.className = 'cookie-preferences-panel';
    panel.innerHTML = `
      <h4>Cookie Preferences</h4>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Manage your cookie settings. Essential cookies are always on.</p>
      
      <div class="preference-item">
        <span>Essential Cookies</span>
        <input type="checkbox" checked disabled>
      </div>
      <div class="preference-item">
        <span>Analytics & Performance</span>
        <input type="checkbox" checked id="prefAnalytics">
      </div>
      
      <div style="margin-top:1.5rem; display:flex; gap:10px; justify-content:flex-end;">
        <button class="btn btn-secondary btn-sm" onclick="hideCookieElements()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="savePreferences()">Save Preferences</button>
      </div>
    `;
    document.body.appendChild(panel);
  }
}

function openCookiePreferences() {
  const panel = document.getElementById('cookiePreferencesPanel');
  if (panel) panel.style.display = 'block';
}

function enableConsentedFeatures() {
  console.log("Consented features enabled");
  // Initialize Analytics, Pixel, etc. here
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
  // Only auto-open if explicitly set to 'open' or not set (first visit logic handled elsewhere)
  // User requested: "When the user closes the chatbot, remember it... so it doesn't keep reopening"
  // So if state is 'closed', do NOT open.
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

// --------- EMAIL POPUP ----------
function showEmailPopup() {
  // If called via scroll (no args), check session storage. If called via button, always show.
  if (arguments.length === 0 && sessionStorage.getItem('emailPopupShown')) return;

  if (document.getElementById('emailPopup')) return; // Already open

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
  // Check cookies
  checkExistingConsent();

  // Discount Popup
  // showDiscountPopup(); // User feedback: "unwanted" - disabled auto-show

  // Email Popup (if discount not shown, to avoid overlap?)
  // Let's prioritize Discount Popup first, then Email Popup later if needed.
  // Or just show Email Popup if Discount is already closed.
  /*
  if (localStorage.getItem('discountShown')) {
    showEmailPopup();
  }
  */

  // Chatbot - Check state
  checkChatbotState();

  // If first visit (no state set), auto-open after delay
  if (!localStorage.getItem('chatbotState')) {
    setTimeout(() => {
      toggleChatbot();
    }, 2000);
  }

  // Close mobile menu on click outside
  document.addEventListener('click', (e) => {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.primary-nav');
    const toggle = document.querySelector('.mobile-toggle');

    if (header.classList.contains('mobile-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
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
        // Close mobile menu if open
        document.querySelector('.site-header').classList.remove('mobile-open');
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
