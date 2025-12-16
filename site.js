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
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
  }
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
    '🎁 Win Prizes! Join our Monthly Lucky Draw',
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

// --------- MOBILE MENU (UPDATED) ----------
function initMobileMenu() {
  const navContainer = document.querySelector('.nav-container');
  const navLeft = document.querySelector('.nav-left');

  if (!navContainer || document.querySelector('.mobile-toggle')) return;

  // 1. Inject Hamburger Button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'mobile-toggle';
  toggleBtn.ariaLabel = 'Toggle Menu';
  toggleBtn.innerHTML = '<span></span><span></span><span></span>';

  // Insert after brand logo (nav-left)
  if (navLeft) {
    navLeft.insertAdjacentElement('afterend', toggleBtn);
  } else {
    navContainer.prepend(toggleBtn);
  }

  // 2. Inject Backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-backdrop';
  document.body.appendChild(backdrop);

  // 3. Clone CTA buttons into Nav Center (Drawer) for Mobile
  const navCenter = document.querySelector('.nav-center');
  const navRight = document.querySelector('.nav-right');

  if (navCenter && navRight) {
    const mobileCtaGroup = document.createElement('div');
    mobileCtaGroup.className = 'mobile-cta-group';
    mobileCtaGroup.innerHTML = navRight.innerHTML; // Clone buttons
    navCenter.appendChild(mobileCtaGroup);
  }

  // 4. Formatting Links for Mobile Drawers
  // (Optional: Could add icons here if needed via JS loop)

  // 5. Event Listeners
  const header = document.querySelector('.site-header');

  function closeMenu() {
    header.classList.remove('mobile-open');
    document.body.style.overflow = ''; // Restore scroll
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = header.classList.contains('mobile-open');
    if (isOpen) {
      closeMenu();
    } else {
      header.classList.add('mobile-open');
      document.body.style.overflow = 'hidden'; // Lock scroll
    }
  });

  backdrop.addEventListener('click', closeMenu);

  // Close when clicking a link
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close buttons in mobile group
  if (navCenter) {
    const mobileBtns = navCenter.querySelectorAll('.btn');
    mobileBtns.forEach(btn => btn.addEventListener('click', closeMenu));
  }
}

// Ensure this runs
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
});

// Original simple toggle function (Deprecated but kept for safety if referenced elsewhere)
function toggleMobileMenu() {
  const header = document.querySelector('.site-header');
  header.classList.toggle('mobile-open');
}



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

  // --- ACTIVE LINK & NAV SCROLL ---
  // Improved Logic: Normalize paths to handle filenames and avoid conflicts
  const normalizePath = (url) => {
    try {
      const a = document.createElement('a'); // use anchor to parse
      a.href = url;
      let path = a.pathname;

      // Remove trailing slash
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      // Remove 'index.html' from end
      if (path.endsWith('/index.html')) {
        path = path.slice(0, -11); // remove /index.html
      } else if (path === 'index.html') {
        path = '';
      }

      return decodeURIComponent(path).toLowerCase();
    } catch (e) {
      return url;
    }
  };

  const currentPath = normalizePath(window.location.href);
  const currentFilename = currentPath.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-link');
  const navCenter = document.querySelector('.nav-center');
  const currentLocation = window.location.href.toLowerCase();

  navLinks.forEach(link => {
    // Reset active state first to ensure no duplicates
    link.classList.remove('active');

    const linkPath = normalizePath(link.href);
    const linkFilename = linkPath.split('/').pop();

    let isActive = false;

    // 1. Strict Path Match (Primary check)
    if (linkPath === currentPath) {
      isActive = true;
    }
    // 2. Fallback: Filename Match (Secondary check for non-index pages)
    // This catches cases like lucky-draw.html even if path resolution differs slightly
    // We explicitly exclude 'index.html' case (which becomes empty string after normalization)
    // to avoid the Home/Blog conflict.
    else if (linkFilename && linkFilename === currentFilename && linkFilename !== '') {
      isActive = true;
    }

    // 3. EXPLICIT OVERRIDE for Lucky Draw (Nuclear Option)
    // If the browser URL contains 'lucky-draw.html' and the link href contains 'lucky-draw.html',
    // force it to be active. This bypasses all path normalization issues.
    if (!isActive && currentLocation.includes('lucky-draw.html') && link.href.toLowerCase().includes('lucky-draw.html')) {
      isActive = true;
    }

    if (isActive) {
      link.classList.add('active');

      // Scroll nav to center this link
      if (navCenter) {
        setTimeout(() => {
          const linkRect = link.getBoundingClientRect();
          const navRect = navCenter.getBoundingClientRect();
          const scrollLeft = link.offsetLeft - (navCenter.offsetWidth / 2) + (link.offsetWidth / 2);

          navCenter.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });
});
