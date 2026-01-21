"""
SIMPLE DEMO RECORDER - Records your LIVE deployed website
No local server needed! Just run this script.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def record_demo():
    """Simple demo recorder for your live website"""
    
    print(">> Starting demo recorder...")
    print(">> Instructions:")
    print("   1. This will open your live website")
    print("   2. Manually navigate and demonstrate features")
    print("   3. Use OBS Studio or Windows Game Bar to record")
    print("   4. Press Win+G to start Windows Game Bar recording")
    print("")
    
    # Setup Chrome
    options = webdriver.ChromeOptions()
    options.add_argument('--start-maximized')
    options.add_argument('--disable-notifications')
    
    # Auto-install ChromeDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        # Open your live website
        print(">> Opening raja-cycle-mart.vercel.app...")
        driver.get("https://raja-cycle-mart.vercel.app/lucky-draw.html")
        time.sleep(3)
        
        print("")
        print(">> Website loaded!")
        print("")
        print(">> NOW START RECORDING:")
        print("   - Press Win+G (Windows Game Bar)")
        print("   - Or use OBS Studio")
        print("   - Or use any screen recorder")
        print("")
        print(">> DEMO SCRIPT:")
        print("   1. Show the Lucky Draw header")
        print("   2. Fill in name: 'Demo Customer'")
        print("   3. Fill in phone: '9876543210'")
        print("   4. Fill in email: 'demo@example.com'")
        print("   5. Click 'Send OTP' button")
        print("   6. Show the OTP section appearing")
        print("   7. Scroll down to show live feed")
        print("   8. Stop recording")
        print("")
        print(">> Browser will stay open for 5 minutes...")
        print("   Close this window when done recording.")
        
        # Keep browser open for manual demo
        time.sleep(300)  # 5 minutes
        
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        print("\n>> Demo complete! Closing browser...")
        driver.quit()

if __name__ == "__main__":
    print("=" * 60)
    print("  RAJA CYCLE MART - DEMO RECORDER")
    print("=" * 60)
    print("")
    record_demo()
