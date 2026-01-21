"""
ALEX-STYLE VIDEO EDITOR AUTOMATION
Adds text overlays, zooms, transitions, and effects
100% FREE - Uses MoviePy + FFmpeg
"""

from moviepy.editor import *
from moviepy.video.fx.all import *
import numpy as np

class AlexStyleEditor:
    def __init__(self):
        self.width = 1080
        self.height = 1920  # 9:16 ratio
        self.fps = 60
        
    def create_text_clip(self, text, duration, position='center', 
                        fontsize=72, color='white', style='bold'):
        """Create animated text overlay - Alex style"""
        txt = TextClip(
            text,
            fontsize=fontsize,
            color=color,
            font='Arial-Black',
            stroke_color='black',
            stroke_width=3,
            method='caption',
            size=(self.width - 100, None)
        )
        
        # Pop-in animation
        txt = txt.set_duration(duration)
        txt = txt.set_position(position)
        
        # Scale animation: 0% -> 105% -> 100%
        def scale_effect(t):
            if t < 0.15:
                return 0 + (t / 0.15) * 1.05
            elif t < 0.25:
                return 1.05 - ((t - 0.15) / 0.1) * 0.05
            else:
                return 1.0
                
        txt = txt.resize(lambda t: scale_effect(t))
        
        return txt
        
    def add_zoom_effect(self, clip, start_time, duration, zoom_factor=1.5):
        """Add zoom effect at specific timestamp"""
        def zoom(get_frame, t):
            frame = get_frame(t)
            h, w = frame.shape[:2]
            
            # Calculate zoom
            if start_time <= t < start_time + duration:
                progress = (t - start_time) / duration
                current_zoom = 1 + (zoom_factor - 1) * progress
            elif t >= start_time + duration:
                current_zoom = zoom_factor
            else:
                current_zoom = 1.0
                
            # Apply zoom
            new_h, new_w = int(h / current_zoom), int(w / current_zoom)
            y1, x1 = (h - new_h) // 2, (w - new_w) // 2
            
            cropped = frame[y1:y1+new_h, x1:x1+new_w]
            return np.array(Image.fromarray(cropped).resize((w, h)))
            
        return clip.fl(zoom)
        
    def add_glow_effect(self, clip):
        """Add subtle glow to make it pop"""
        # Increase saturation and add slight blur
        clip = clip.fx(colorx, 1.1)  # Increase color intensity
        return clip
        
    def create_hook_screen(self, text, duration=3):
        """Create attention-grabbing hook screen"""
        # Black background
        bg = ColorClip(
            size=(self.width, self.height),
            color=(10, 10, 15),
            duration=duration
        )
        
        # Main text with glitch effect
        main_text = self.create_text_clip(
            text.upper(),
            duration,
            position='center',
            fontsize=85,
            color='white'
        )
        
        # Accent line
        accent = ColorClip(
            size=(800, 8),
            color=(0, 255, 136),  # Electric green
            duration=duration
        ).set_position(('center', self.height // 2 + 100))
        
        return CompositeVideoClip([bg, main_text, accent])
        
    def create_split_screen(self, problem_text, solution_text, duration=7):
        """Create problem/solution split screen"""
        # Background
        bg = ColorClip(
            size=(self.width, self.height),
            color=(10, 10, 15),
            duration=duration
        )
        
        # Problem side (red)
        problem_bg = ColorClip(
            size=(self.width // 2, self.height),
            color=(255, 85, 85),
            duration=duration
        ).set_position((0, 0)).set_opacity(0.2)
        
        problem_txt = self.create_text_clip(
            f"❌ {problem_text}",
            duration,
            position=(50, self.height // 3),
            fontsize=48,
            color='#ff5555'
        )
        
        # Solution side (green)
        solution_bg = ColorClip(
            size=(self.width // 2, self.height),
            color=(0, 255, 136),
            duration=duration
        ).set_position((self.width // 2, 0)).set_opacity(0.2)
        
        solution_txt = self.create_text_clip(
            f"✅ {solution_text}",
            duration,
            position=(self.width // 2 + 50, self.height // 3),
            fontsize=48,
            color='#00ff88'
        )
        
        return CompositeVideoClip([bg, problem_bg, solution_bg, problem_txt, solution_txt])
        
    def create_tech_stack_screen(self, tech_items, duration=10):
        """Animated tech stack showcase"""
        bg = ColorClip(
            size=(self.width, self.height),
            color=(10, 10, 15),
            duration=duration
        )
        
        title = self.create_text_clip(
            "⚡ TECH STACK",
            2,
            position=('center', 200),
            fontsize=65,
            color='#ffaa00'
        )
        
        # Animate each tech item appearing
        clips = [bg, title]
        y_pos = 400
        
        for i, tech in enumerate(tech_items):
            delay = i * 0.5
            tech_clip = self.create_text_clip(
                f"→ {tech}",
                duration - delay,
                position=(150, y_pos),
                fontsize=55,
                color='white'
            ).set_start(delay)
            clips.append(tech_clip)
            y_pos += 120
            
        return CompositeVideoClip(clips)
        
    def create_results_screen(self, stats, duration=7):
        """Animated results with counting numbers"""
        bg = ColorClip(
            size=(self.width, self.height),
            color=(10, 10, 15),
            duration=duration
        )
        
        title = self.create_text_clip(
            "✅ RESULTS",
            duration,
            position=('center', 200),
            fontsize=75,
            color='#00ff88'
        )
        
        clips = [bg, title]
        y_pos = 500
        
        for stat in stats:
            stat_clip = self.create_text_clip(
                stat,
                duration,
                position=('center', y_pos),
                fontsize=58,
                color='white'
            )
            clips.append(stat_clip)
            y_pos += 150
            
        return CompositeVideoClip(clips)
        
    def create_cta_screen(self, handle, website, duration=3):
        """End screen with CTA"""
        bg = ColorClip(
            size=(self.width, self.height),
            color=(10, 10, 15),
            duration=duration
        )
        
        main_text = self.create_text_clip(
            "WANT THIS FOR YOUR BUSINESS?",
            duration,
            position=('center', 600),
            fontsize=60,
            color='white'
        )
        
        handle_text = self.create_text_clip(
            f"@{handle}",
            duration,
            position=('center', 900),
            fontsize=70,
            color='#00ff88'
        )
        
        link_text = self.create_text_clip(
            "LINK IN BIO ⬇️",
            duration,
            position=('center', 1100),
            fontsize=50,
            color='#ffaa00'
        )
        
        return CompositeVideoClip([bg, main_text, handle_text, link_text])
        
    def compile_lucky_draw_reel(self, screen_recording_path, output_path):
        """Compile complete Lucky Draw showcase reel"""
        print("🎬 Compiling Lucky Draw Reel...")
        
        # Load screen recording
        demo_clip = VideoFileClip(screen_recording_path)
        demo_clip = demo_clip.resize((self.width, self.height))
        
        # Create sections
        hook = self.create_hook_screen(
            "I AUTOMATED MY CYCLE SHOP'S LOTTERY",
            duration=3
        )
        
        problem_solution = self.create_split_screen(
            "Paper tickets got lost\nFake entries\nManual drawing",
            "Digital OTP verification\nFirebase real-time\nAuto winner selection",
            duration=7
        )
        
        # Use first 15 seconds of demo
        demo_section = demo_clip.subclip(0, 15)
        demo_section = self.add_glow_effect(demo_section)
        
        tech_stack = self.create_tech_stack_screen(
            ["Firebase Firestore", "EmailJS OTP", "Vercel Serverless", "Real-time Updates"],
            duration=10
        )
        
        results = self.create_results_screen(
            ["500+ entries/month", "0 fake entries", "10 hours saved"],
            duration=7
        )
        
        cta = self.create_cta_screen(
            "yourhandle",
            "raja-cycle-mart.vercel.app",
            duration=3
        )
        
        # Concatenate all sections
        final = concatenate_videoclips([
            hook,
            problem_solution,
            demo_section,
            tech_stack,
            results,
            cta
        ])
        
        # Add background music (you'll need to provide the file)
        # audio = AudioFileClip("background_music.mp3").set_duration(final.duration)
        # final = final.set_audio(audio)
        
        # Export
        final.write_videofile(
            output_path,
            fps=self.fps,
            codec='libx264',
            audio_codec='aac',
            preset='medium'
        )
        
        print(f"✅ Reel saved to: {output_path}")


# USAGE EXAMPLE
if __name__ == "__main__":
    editor = AlexStyleEditor()
    
    # Compile the reel
    editor.compile_lucky_draw_reel(
        screen_recording_path="lucky_draw_demo.mp4",
        output_path="lucky_draw_showcase_FINAL.mp4"
    )
