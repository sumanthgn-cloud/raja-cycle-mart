"""
SIMPLE VIDEO EDITOR - Works with MoviePy 2.x
Adds text overlays to your recording
"""

from moviepy import VideoFileClip, TextClip, CompositeVideoClip
import os

def create_showcase_reel(input_video_path, output_path="lucky_draw_showcase_FINAL.mp4"):
    """Create showcase reel with text overlays"""
    
    print("=" * 60)
    print("  CREATING SHOWCASE REEL")
    print("=" * 60)
    print("")
    print(f">> Loading: {os.path.basename(input_video_path)}")
    
    # Load video
    video = VideoFileClip(input_video_path)
    
    print(f">> Size: {video.w}x{video.h}")
    print(f">> Duration: {video.duration:.1f} seconds")
    
    # Trim to 45 seconds if needed
    if video.duration > 45:
        print(">> Trimming to 45 seconds...")
        video = video.subclipped(0, 45)
    
    print("")
    print(">> Adding text overlays...")
    
    # Create text overlays
    clips = [video]
    
    # Hook (0-3 sec)
    hook = TextClip(
        text="I AUTOMATED MY\nCYCLE SHOP'S LOTTERY",
        font_size=60,
        color='white',
        font='Arial',
        stroke_color='black',
        stroke_width=3,
        text_align='center',
        size=(video.w - 100, None)
    ).with_position(('center', 150)).with_duration(3).with_start(0)
    clips.append(hook)
    
    # Firebase text (8-13 sec)
    firebase = TextClip(
        text="Firebase Real-time Database",
        font_size=45,
        color='#00ff88',
        font='Arial',
        stroke_color='black',
        stroke_width=2,
        text_align='center',
        size=(video.w - 100, None)
    ).with_position(('center', video.h - 200)).with_duration(5).with_start(8)
    clips.append(firebase)
    
    # OTP text (15-20 sec)
    otp = TextClip(
        text="Email OTP Verification",
        font_size=45,
        color='#0ea5e9',
        font='Arial',
        stroke_color='black',
        stroke_width=2,
        text_align='center',
        size=(video.w - 100, None)
    ).with_position(('center', video.h - 200)).with_duration(5).with_start(15)
    clips.append(otp)
    
    # Results (30-35 sec)
    if video.duration >= 30:
        results = TextClip(
            text="500+ Entries/Month\n0 Fake Submissions",
            font_size=50,
            color='white',
            font='Arial',
            stroke_color='black',
            stroke_width=3,
            text_align='center',
            size=(video.w - 100, None)
        ).with_position(('center', 200)).with_duration(5).with_start(30)
        clips.append(results)
    
    # CTA (last 3 sec)
    cta_start = max(0, video.duration - 3)
    cta = TextClip(
        text="Need a Developer? DM Me!",
        font_size=55,
        color='#FFD700',
        font='Arial',
        stroke_color='black',
        stroke_width=3,
        text_align='center',
        size=(video.w - 100, None)
    ).with_position(('center', video.h // 2)).with_duration(3).with_start(cta_start)
    clips.append(cta)
    
    # Composite
    print(">> Compositing...")
    final = CompositeVideoClip(clips)
    
    # Export
    print("")
    print(">> Exporting (this may take 2-5 minutes)...")
    print("")
    
    final.write_videofile(
        output_path,
        fps=30,
        codec='libx264',
        audio_codec='aac',
        preset='medium',
        threads=4,
        logger='bar'
    )
    
    print("")
    print("=" * 60)
    print("  SUCCESS!")
    print(f"  Saved to: {output_path}")
    print("=" * 60)
    print("")
    print(">> Ready to post!")
    print("")

if __name__ == "__main__":
    input_video = r"C:\Users\sumanth\Videos\Captures\Lucky Draw - Raja Cycle Mart - Google Chrome 2026-01-15 22-29-01.mp4"
    output_video = r"C:\Users\sumanth\Videos\lucky_draw_showcase_FINAL.mp4"
    
    if not os.path.exists(input_video):
        print(f"ERROR: Video not found!")
        print(f"Looking for: {input_video}")
    else:
        create_showcase_reel(input_video, output_video)
