"""
AUTO SCREEN RECORDER FOR PROJECT SHOWCASE
Records your live project with cursor highlights and auto-zooms
100% FREE - Uses Selenium + pyautogui
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyautogui
import time
import subprocess
import json

class ProjectShowcaseRecorder:
    def __init__(self, project_url="http://localhost:5500"):
        self.url = project_url
        self.driver = None
        self.recording_process = None
        
    def setup_browser(self):
        """Setup Chrome with recording-friendly options"""
        options = webdriver.ChromeOptions()
        options.add_argument('--start-maximized')
        options.add_argument('--disable-notifications')
        self.driver = webdriver.Chrome(options=options)
        
    def start_recording(self, output_file="demo.mp4"):
        """Start OBS recording via command line"""
        # For OBS Studio with obs-cli installed
        # Alternative: Use FFmpeg screen capture
        cmd = [
            'ffmpeg',
            '-f', 'gdigrab',  # Windows screen capture
            '-framerate', '60',
            '-i', 'desktop',
            '-f', 'dshow',  # Audio
            '-i', 'audio="Microphone"',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-pix_fmt', 'yuv420p',
            output_file
        ]
        self.recording_process = subprocess.Popen(cmd)
        time.sleep(2)  # Wait for recording to start
        
    def stop_recording(self):
        """Stop the recording"""
        if self.recording_process:
            self.recording_process.terminate()
            time.sleep(1)
            
    def smooth_scroll(self, pixels=500, duration=2):
        """Smooth scroll for cinematic effect"""
        self.driver.execute_script(f"""
            window.scrollBy({{
                top: {pixels},
                behavior: 'smooth'
            }});
        """)
        time.sleep(duration)
        
    def highlight_element(self, element):
        """Add visual highlight to element"""
        self.driver.execute_script("""
            arguments[0].style.border = '3px solid #00ff88';
            arguments[0].style.boxShadow = '0 0 20px #00ff88';
        """, element)
        time.sleep(0.5)
        
    def remove_highlight(self, element):
        """Remove highlight"""
        self.driver.execute_script("""
            arguments[0].style.border = '';
            arguments[0].style.boxShadow = '';
        """, element)
        
    def record_lucky_draw_demo(self):
        """Record Lucky Draw feature showcase"""
        print("🎬 Recording Lucky Draw Demo...")
        
        # Navigate to lucky draw page
        self.driver.get(f"{self.url}/lucky-draw.html")
        time.sleep(3)
        
        # Scroll to show header
        self.smooth_scroll(200, 2)
        
        # Fill name field with highlight
        name_field = self.driver.find_element(By.ID, "name")
        self.highlight_element(name_field)
        name_field.send_keys("Demo Customer")
        time.sleep(1)
        self.remove_highlight(name_field)
        
        # Fill phone
        phone_field = self.driver.find_element(By.ID, "phone")
        self.highlight_element(phone_field)
        phone_field.send_keys("9876543210")
        time.sleep(1)
        self.remove_highlight(phone_field)
        
        # Fill email
        email_field = self.driver.find_element(By.ID, "email")
        self.highlight_element(email_field)
        email_field.send_keys("demo@example.com")
        time.sleep(1)
        
        # Click Send OTP button (ZOOM MOMENT)
        otp_btn = self.driver.find_element(By.ID, "sendOTPBtn")
        self.highlight_element(otp_btn)
        time.sleep(1)
        otp_btn.click()
        time.sleep(2)
        
        # Show OTP section appearing
        time.sleep(3)
        
        # Scroll to show live feed
        self.smooth_scroll(400, 2)
        time.sleep(3)
        
        print("✅ Lucky Draw demo recorded!")
        
    def record_marketplace_demo(self):
        """Record Marketplace feature showcase"""
        print("🎬 Recording Marketplace Demo...")
        
        self.driver.get(f"{self.url}/marketplace.html")
        time.sleep(3)
        
        # Show tabs
        tabs = self.driver.find_elements(By.CLASS_NAME, "mp-tab")
        for tab in tabs:
            self.highlight_element(tab)
            time.sleep(0.5)
            self.remove_highlight(tab)
            
        # Click Kids tab
        tabs[0].click()
        time.sleep(2)
        
        # Scroll through products
        self.smooth_scroll(500, 3)
        time.sleep(2)
        self.smooth_scroll(500, 3)
        
        # Highlight a product card
        product_card = self.driver.find_element(By.CLASS_NAME, "mp-card")
        self.highlight_element(product_card)
        time.sleep(2)
        
        print("✅ Marketplace demo recorded!")
        
    def record_full_overview(self):
        """Record complete project overview"""
        print("🎬 Recording Full Project Overview...")
        
        # Home page
        self.driver.get(self.url)
        time.sleep(3)
        self.smooth_scroll(300, 2)
        time.sleep(2)
        self.smooth_scroll(300, 2)
        
        # Services section
        time.sleep(2)
        self.smooth_scroll(400, 2)
        
        # Navigate to different pages quickly
        pages = [
            "/services.html",
            "/marketplace.html",
            "/lucky-draw.html",
            "/about.html"
        ]
        
        for page in pages:
            self.driver.get(f"{self.url}{page}")
            time.sleep(2)
            self.smooth_scroll(300, 1.5)
            
        print("✅ Full overview recorded!")
        
    def cleanup(self):
        """Close browser and stop recording"""
        if self.driver:
            self.driver.quit()
        self.stop_recording()


# USAGE EXAMPLE
if __name__ == "__main__":
    recorder = ProjectShowcaseRecorder("http://127.0.0.1:5500")
    
    try:
        recorder.setup_browser()
        recorder.start_recording("lucky_draw_demo.mp4")
        
        # Record specific feature
        recorder.record_lucky_draw_demo()
        
        # Or record full overview
        # recorder.record_full_overview()
        
    finally:
        recorder.cleanup()
        print("🎉 Recording complete! Check your output file.")
