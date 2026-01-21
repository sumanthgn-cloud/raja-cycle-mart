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
  localStorage.setItem("cookie_consent", "accepted"); // Support for local file opening
  const banner = document.getElementById("cookie-banner");
  if (banner) banner.style.display = "none";
  loadGA();
}

// --------- CHATBOT (IFRAME) ----------
// --------- CHATBOT (NATIVE) ----------
function initChatbot() {
  const chatWindow = document.getElementById('chatbotWindow');
  if (!chatWindow) return;

  // Luxury Concierge CSS
  const styleTag = document.getElementById('chatbot-premium-styles') || document.createElement('style');
  styleTag.id = 'chatbot-premium-styles';
  styleTag.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Outfit:wght@500;700;900&display=swap');
    
    @keyframes luxeReveal { from { transform: scale(0.98) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
    @keyframes glowPulse { 0% { box-shadow: 0 0 5px rgba(0, 255, 163, 0.2); } 50% { box-shadow: 0 0 20px rgba(0, 255, 163, 0.5); } 100% { box-shadow: 0 0 5px rgba(0, 255, 163, 0.2); } }
    
    .luxe-card {
      background: rgba(15, 15, 15, 0.95);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      font-family: 'Inter', sans-serif;
      animation: luxeReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      color: #fff;
    }
    .luxe-header {
      background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
    }
    .luxe-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      background: linear-gradient(135deg, #fff 0%, #00ffa3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }
    .luxe-input {
      width: 100%;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 0.95rem;
      color: #fff;
      transition: all 0.3s;
      outline: none;
      margin-bottom: 15px;
    }
    .luxe-input:focus {
      border-color: #00ffa3;
      background: rgba(0, 255, 163, 0.02);
      box-shadow: 0 0 15px rgba(0, 255, 163, 0.1);
    }
    .luxe-chip-input { 
      appearance: none;
      -webkit-appearance: none;
      width: 20px; 
      height: 20px;
      border: 2px solid #555;
      border-radius: 6px;
      background: rgba(0,0,0,0.3);
      display: inline-block;
      position: relative;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .luxe-chip-input:checked {
      background: #00ffa3;
      border-color: #00ffa3;
    }
    .luxe-chip-input:checked::after {
      content: '✔';
      font-size: 14px;
      color: #000;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: 800;
    }
    .luxe-chip-label {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      font-size: 0.92rem;
      color: #ccc;
      cursor: pointer;
      transition: all 0.25s ease;
      margin-bottom: 8px;
    }
    .luxe-chip-label:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .luxe-chip-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
    }
    /* When label is clicked, it triggers input inside */
    
    .luxe-btn {
      width: 100%;
      padding: 16px;
      background: #00ffa3;
      color: #000;
      border: none;
      border-radius: 16px;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.4s;
      box-shadow: 0 10px 30px -5px rgba(0, 255, 163, 0.4);
    }
    .luxe-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px -5px rgba(0, 255, 163, 0.6);
    }
    .scroll-hint {
      font-size: 0.75rem;
      color: #888;
      text-align: center;
      margin-top: 5px;
      animation: glowPulse 3s infinite;
    }
  `;
  if (!document.getElementById('chatbot-premium-styles')) document.head.appendChild(styleTag);

  chatWindow.innerHTML = `
    <div class="luxe-card">
      <div class="luxe-header">
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 42px; height: 42px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">📅</div>
            <div>
                <div class="luxe-title">Raja Service Booking</div>
                <div style="font-size: 0.8rem; color: #aaa;">Book Your Cycle Repair Slot</div>
            </div>
        </div>
      </div>
      
      <div style="flex: 1; padding: 20px; overflow-y: auto;">
        <form id="chatBookingForm" onsubmit="handleChatBooking(event)">
          
          <!-- 1. Name & Email -->
          <div style="margin-bottom: 25px;">
            <label style="color: #00ffa3; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 8px;">1. YOUR DETAILS</label>
            <input type="text" id="chatName" placeholder="Your Name" required class="luxe-input">
            <input type="email" id="chatEmail" placeholder="Email Address (Optional)" class="luxe-input" style="margin-bottom: 5px;">
            <div style="font-size: 0.7rem; color: #666;">* We will verify details via email if provided</div>
          </div>
          
          <!-- 2. Common Problems -->
          <div style="margin-bottom: 25px;">
            <label style="color: #00ffa3; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 8px;">2. SELECT PROBLEM</label>
            <div class="scroll-hint">↓ Scroll down for more options</div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 10px;">
                <label class="luxe-chip-label">
                    <input type="checkbox" name="chatProblemOption" value="Gear Problem" class="luxe-chip-input">
                    <span>⚙️ Gear / Shifting Issue</span>
                </label>

                <label class="luxe-chip-label">
                    <input type="checkbox" name="chatProblemOption" value="Brake Problem" class="luxe-chip-input">
                    <span>🛑 Brakes / Safety Check</span>
                </label>

                <label class="luxe-chip-label">
                    <input type="checkbox" name="chatProblemOption" value="Chain Issue" class="luxe-chip-input">
                    <span>⛓️ Chain / Noise</span>
                </label>

                <label class="luxe-chip-label">
                    <input type="checkbox" name="chatProblemOption" value="Wheel Issue" class="luxe-chip-input">
                    <span>🎡 Wheel / Alignment</span>
                </label>

                <label class="luxe-chip-label">
                    <input type="checkbox" name="chatProblemOption" value="General Service" class="luxe-chip-input">
                    <span>🛠️ General Service</span>
                </label>
                
                <label class="luxe-chip-label">
                    <input type="checkbox" name="chatProblemOption" value="Accessories" class="luxe-chip-input">
                    <span>🔔 Fitting Accessories</span>
                </label>
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #d4af37;">💰 Charges start from ₹50 (after check)</div>
          </div>

          <!-- 3. Other/Details -->
          <div style="margin-bottom: 25px;">
            <label style="color: #00ffa3; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 8px;">3. OTHER DETAILS</label>
            <textarea id="chatProblemOther" placeholder="Any specific brand or sound? (Optional)" rows="2" class="luxe-input" style="resize: none; font-family: inherit;"></textarea>
          </div>
          
          <!-- 4. Phone -->
          <div style="margin-bottom: 30px;">
            <label style="color: #00ffa3; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 8px;">4. PHONE NUMBER</label>
            <input type="tel" id="chatPhone" placeholder="WhatsApp Number" class="luxe-input">
          </div>
          
          <button type="submit" id="chatSubmitBtn" class="luxe-btn">
             Click to Book Service
          </button>
          
          <div class="luxe-footer-info">
            <p style="margin-bottom: 5px;">📍 SS Puram, Near Sitharama Temple</p>
            <p style="font-size: 0.75rem; opacity: 0.6;">Walk-ins Welcome | Fast Reply</p>
          </div>
        </form>
        
        <div id="chatResponse" style="display: none; height: 100%;"></div>
      </div>
    </div>
  `;
}

function handleChatBooking(e) {
  e.preventDefault();

  const btn = document.getElementById('chatSubmitBtn');
  const name = document.getElementById('chatName').value;
  const email = document.getElementById('chatEmail').value.trim();
  const phone = document.getElementById('chatPhone').value.trim();
  const otherProblem = document.getElementById('chatProblemOther').value;
  const form = document.getElementById('chatBookingForm');
  const responseDiv = document.getElementById('chatResponse');

  const checkboxes = document.querySelectorAll('input[name="chatProblemOption"]:checked');
  let selectedProblems = [];
  checkboxes.forEach((checkbox) => { selectedProblems.push(checkbox.value); });

  let problem = selectedProblems.join(", ");
  if (otherProblem.trim()) {
    if (problem) problem += " | Details: " + otherProblem.trim();
    else problem = otherProblem.trim();
  }

  if (!problem) { alert("Please select a problem."); return; }
  if (phone && !/^[6-9]\d{9}$/.test(phone)) { alert("Please enter valid mobile number."); return; }

  const originalContent = btn.innerHTML;
  btn.style.opacity = '0.6';
  btn.innerHTML = `Sending...`;
  btn.disabled = true;

  fetch("/api/book-service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, problem }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        form.style.display = 'none';
        responseDiv.style.display = 'flex';
        responseDiv.style.flexDirection = 'column';
        responseDiv.style.alignItems = 'center';
        responseDiv.style.justifyContent = 'center';

        let mailMsg = "";
        if (email) {
          mailMsg = `<div style="margin-top:15px; padding:10px; background:rgba(0,255,163,0.1); border-radius:8px; color:#00ffa3; font-size:0.9rem;">📧 Confirmation sent to: ${email}</div>`;
        }

        responseDiv.innerHTML = `
        <div style="text-align: center; animation: luxeReveal 0.8s ease-out;">
          <div style="font-size: 3rem; color: #00ffa3; margin-bottom: 20px;">✅</div>
          <h2 style="color: #fff; margin-bottom: 15px;">Booking Confirmed</h2>
          <p style="color: #aaa; margin-bottom: 20px;">We will contact you shortly.</p>
          
          <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
            <div style="color: #888; font-size: 0.8rem;">Booking ID</div>
            <div style="color: #d4af37; font-size: 1.2rem; font-family: monospace;">${data.bookingId || 'RCM-OK'}</div>
          </div>
          
          ${mailMsg}

          <button onclick="resetChatForm()" style="background:none; border:1px solid #555; color:#888; padding:10px 20px; border-radius:20px; margin-top:30px; cursor:pointer;">New Booking</button>
        </div>
      `;
      } else {
        alert("Error: " + data.error);
        btn.innerHTML = originalContent;
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    })
    .catch(err => {
      alert("Error. Please try again.");
      btn.innerHTML = originalContent;
      btn.disabled = false;
      btn.style.opacity = '1';
    });
}

function resetChatForm() {
  document.getElementById('chatBookingForm').reset();
  document.getElementById('chatBookingForm').style.display = 'block';
  document.getElementById('chatResponse').style.display = 'none';
  const btn = document.getElementById('chatSubmitBtn');
  btn.innerHTML = "Complete Service Request";
  btn.disabled = false;
  btn.style.opacity = '1';
}

function toggleChatbot() {
  const window = document.getElementById('chatbotWindow');
  const toggleBtn = document.getElementById('chatbotToggle');

  // Initialize content on first open if empty or iframe
  if (window.innerHTML.includes('<iframe')) {
    initChatbot();
  }

  if (window.style.display === 'none' || window.style.display === '') {
    window.style.display = 'block';
    toggleBtn.innerHTML = '<i class="fas fa-times"></i>';

    // Auto initialization if content is missing (fallback)
    if (!window.querySelector('#chatBookingForm')) {
      initChatbot();
    }
  } else {
    window.style.display = 'none';
    toggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
  }
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
  // Check for existing consent (Cookie OR LocalStorage)
  if (getCookie("cookie_consent") === "accepted" || localStorage.getItem("cookie_consent") === "accepted") {
    loadGA();
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "none";
  } else {
    // Show banner if not accepted
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.style.display = "flex";
      // Force redraw to ensure visibility
      setTimeout(() => banner.style.opacity = "1", 10);
    }
  }

  // Chatbot - Check state
  // Chatbot - Check state (Removed - default closed)
  // checkChatbotState();

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
