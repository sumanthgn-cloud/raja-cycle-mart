// kids-deals.js — lightweight toast + return-from-affiliate logic
(function () {
    const WA_BASE = "https://wa.me/919113943291";
    const TOAST_ID = "kd-toast";

    function createToast(text, productName) {
        if (document.getElementById(TOAST_ID)) return;
        const toast = document.createElement("div");
        toast.id = TOAST_ID;
        toast.style.position = "fixed";
        toast.style.left = "50%";
        toast.style.bottom = "28px";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "#111";
        toast.style.color = "#fff";
        toast.style.padding = "12px 16px";
        toast.style.borderRadius = "10px";
        toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
        toast.style.zIndex = 9999;
        toast.style.display = "flex";
        toast.style.alignItems = "center";
        toast.style.gap = "12px";
        toast.innerHTML = `<div style="max-width:520px;font-size:14px">Thanks for checking Amazon! To claim your in-shop discount, message us on WhatsApp: "I checked the Amazon link for ${productName}". Show this message at counter.</div>`;

        const btn = document.createElement("a");
        btn.href = WA_BASE + "?text=" + encodeURIComponent("Hi Raja Cycle Mart, I checked the Amazon link for " + productName + " and want to claim the shop discount. My name is [Your Name].");
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        btn.style.background = "#25D366";
        btn.style.color = "#fff";
        btn.style.padding = "8px 10px";
        btn.style.borderRadius = "8px";
        btn.style.fontWeight = 700;
        btn.innerText = "Message Now";
        toast.appendChild(btn);

        const close = document.createElement("button");
        close.innerText = "✕";
        close.style.background = "transparent";
        close.style.color = "#fff";
        close.style.border = "none";
        close.style.fontSize = "16px";
        close.style.cursor = "pointer";
        close.onclick = () => toast.remove();
        toast.appendChild(close);

        document.body.appendChild(toast);

        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 10000);
    }

    // show toast if sessionStorage flag set (user clicked buy)
    window.addEventListener('load', () => {
        const buyReturn = sessionStorage.getItem('kd_clicked_amazon');
        const prod = sessionStorage.getItem('kd_product_name') || 'product';
        if (buyReturn === '1') {
            createToast('Thanks for checking Amazon! To claim your in-shop discount, message us on WhatsApp.', prod);
            sessionStorage.removeItem('kd_clicked_amazon');
            sessionStorage.removeItem('kd_product_name');
        }
    });

    // attach listeners to Buy on Amazon links to set flag before leaving
    document.addEventListener('click', function (e) {
        const a = e.target.closest && e.target.closest('a');
        if (!a) return;
        if (a.classList && a.classList.contains('btn-amazon')) {
            const prod = a.getAttribute('data-product-name') || 'product';
            try {
                sessionStorage.setItem('kd_clicked_amazon', '1');
                sessionStorage.setItem('kd_product_name', prod);
            } catch (e) { }
            // let link proceed
        }
        if (a.classList && a.classList.contains('btn-wa')) {
            const prod = a.closest('.kd-card') && a.closest('.kd-card').getAttribute('data-product') || 'product';
            createToast('', prod); // show immediate toast and allow whatsapp open
        }
    }, false);
})();
