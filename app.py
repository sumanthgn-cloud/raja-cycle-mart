import gradio as gr
import requests
import os
from datetime import datetime

# ================= CONFIG =================
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

# ================= HELPERS =================
def generate_booking_id():
    today = datetime.now().strftime("%Y%m%d")
    time_part = datetime.now().strftime("%H%M%S")
    return f"RCM-{today}-{time_part}"

def suggested_internal_time():
    hour = datetime.now().hour
    if hour < 12:
        return "11:00 AM – 1:00 PM"
    elif hour < 17:
        return "4:00 PM – 6:00 PM"
    else:
        return "Next day morning"

def send_to_telegram(data):
    message = f"""
🚲 *New Service Request*

🆔 ID: {data['id']}
👤 Name: {data['name']}
🔧 Problem: {data['problem']}
📞 Phone: {data['phone']}
⏰ Suggested Time: {data['time']}
📍 SS Puram, Tumkur
"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "Markdown"
    }
    try:
        requests.post(url, json=payload)
    except Exception as e:
        print(f"Error sending to Telegram: {e}")

# ================= MAIN FUNCTION =================
# ================= MAIN FUNCTION =================
def book_service(name, email, selected_problems, other_details, phone):
    problem_list = selected_problems if selected_problems else []
    
    problem_str = ", ".join(problem_list)
    if other_details.strip():
        if problem_str:
            problem_str += " | Details: " + other_details.strip()
        else:
            problem_str = other_details.strip()

    if not problem_str:
        return "❌ Please select at least one problem or describe the issue."

    booking_id = generate_booking_id()
    internal_time = suggested_internal_time()

    data = {
        "id": booking_id,
        "name": name.strip() if name else "Not shared",
        "email": email.strip() if email else "Not provided",
        "problem": problem_str,
        "phone": phone.strip() if phone else "Will WhatsApp",
        "time": internal_time
    }

    send_to_telegram(data)
    
    mail_msg = ""
    if email.strip():
        mail_msg = f"\n📧 **Confirmation details sent to {email.strip()}**"

    return f"""
# ✅ Booking Confirmed!

The shop owner will WhatsApp you shortly to confirm details.
### Please visit **Raja Cycle Mart, SS Puram**.

**Booking ID:** `{booking_id}`
{mail_msg}

💰 **Charges start from ₹50 (after check)**
🎓 **Student discount available (ID required)**

---
📍 Raja Cycle Mart, SS Puram Main Road, Tumkur  
Near Sri Sitharama Temple
🚲 Trusted since 1987  
🙏 Thanks for reaching out

**Encouraged: Walk-in visits are welcome!**
"""

# ================= UI =================
with gr.Blocks(theme=gr.themes.Default(primary_hue="emerald", secondary_hue="slate")) as app:
    gr.Markdown("""
# 🚲 Raja Service Booking
### 📅 Book Your Cycle Repair Slot
Namaste! Experience world-class cycle care.  
**Trusted in Tumkur since 1987**
""")
    
    with gr.Column():
        with gr.Group():
            gr.Markdown("### 1. YOUR DETAILS")
            name = gr.Textbox(
                label="Your Name", 
                placeholder="e.g. Sumanth",
                container=True
            )
            email = gr.Textbox(
                label="Email Address (Optional)", 
                placeholder="e.g. name@example.com",
            )
            
            gr.Markdown("### 2. SELECT SERVICE")
            problems = gr.CheckboxGroup(
                label="Scroll down for more options",
                choices=[
                    "⚙️ Gear Repair / Shifting Issue",
                    "🛑 Brakes Repair / Safety Check",
                    "⛓️ Chain Issue / Noise",
                    "🎡 Wheel Alignment / Truing",
                    "🛠️ General Service / Tune-up",
                    "🧸 Kids Cycle Repair",
                    "🔔 Fitting Accessories"
                ]
            )
            gr.Markdown("💰 **Charges start from ₹50**")
            
        with gr.Group():
            gr.Markdown("### 3. OTHER DETAILS")
            other = gr.Textbox(
                label="Specific brand or hidden sounds? (Optional)",
                placeholder="e.g. Giant, Trek, or clicking noise...",
                lines=2
            )
            
            gr.Markdown("### 4. CONTACT INFO")
            phone = gr.Textbox(
                label="WhatsApp Number",
                placeholder="e.g. 9876543210"
            )
            
        submit = gr.Button("✅ CLICK TO BOOK SERVICE", variant="primary")
        
        output = gr.Markdown()

    submit.click(book_service, [name, email, problems, other, phone], output)

    gr.Markdown("""
---
⏱️ **15-MINUTE WHATSAPP RESPONSE**

👑 **SCHOLAR PRIVILEGE**  
*10% OFF Maintenance for Students (ID Required)*

📍 **Raja Cycle Mart, SS Puram Main Road, Tumkur**  
*Boutique Open — Walk-ins Welcome 🙏*
""")

if __name__ == "__main__":
    app.launch()
