"""
AUTOMATED DEMO RECORDER
Automatically demonstrates your website features and records the process

Usage:
    python auto_demo_recorder.py
"""

from playwright.sync_api import sync_playwright
import time

def record_lucky_draw_demo():
    """Automatically demonstrate and record the Lucky Draw feature"""
    
    print("=" * 60)
    print("  AUTOMATED DEMO RECORDER")
    print("=" * 60)
    print("")
    print(">> Starting browser...")
    
    with sync_playwright() as p:
        # Launch browser with video recording
        browser = p.chromium.launch(
            headless=False,  # Show browser so you can see it working
            slow_mo=1000     # Slow down by 1 second per action (looks more natural)
        )
        
        # Create context with video recording
        context = browser.new_context(
            viewport={'width': 1080, 'height': 1920},  # Vertical format for mobile
            record_video_dir="recordings/",
            record_video_size={'width': 1080, 'height': 1920}
        )
        
        page = context.new_page()
        
        print(">> Opening Lucky Draw page...")
        page.goto("https://raja-cycle-mart.vercel.app/lucky-draw.html", timeout=60000)
        
        # Wait for page to load (simpler approach)
        time.sleep(5)  # Give it 5 seconds to fully load
        
        print(">> Demonstrating feature...")
        
        # Step 1: Fill in name
        print("   1. Filling name field...")
        page.fill("#name", "Demo Customer")
        time.sleep(1)
        
        # Step 2: Fill in phone
        print("   2. Filling phone field...")
        page.fill("#phone", "9876543210")
        time.sleep(1)
        
        # Step 3: Fill in email
        print("   3. Filling email field...")
        page.fill("#email", "demo@test.com")
        time.sleep(1)
        
        # Step 4: Fill lucky code
        print("   4. Filling lucky code...")
        page.fill("#luckyCode", "TEST123")
        time.sleep(1)
        
        # Step 5: Fill bill number
        print("   5. Filling bill number...")
        page.fill("#billNumber", "BILL001")
        time.sleep(1)
        
        # Step 6: Select purchase date
        print("   6. Selecting purchase date...")
        page.fill("#purchaseDate", "2026-01-15")
        time.sleep(1)
        
        # Step 7: Click Send OTP button
        print("   7. Clicking Send OTP...")
        page.click("#sendOTPBtn")
        time.sleep(3)  # Wait for OTP section to appear
        
        # Step 8: Show OTP section
        print("   8. Showing OTP verification...")
        time.sleep(2)
        
        # Step 9: Scroll to live feed
        print("   9. Scrolling to live feed...")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(3)
        
        print("")
        print(">> Demo complete! Saving video...")
        
        # Close browser (this saves the video)
        context.close()
        browser.close()
        
        print("")
        print("=" * 60)
        print("  SUCCESS!")
        print("  Video saved to: recordings/")
        print("=" * 60)
        print("")
        print(">> Check the recordings/ folder for your demo video!")
        print("")

if __name__ == "__main__":
    record_lucky_draw_demo()
