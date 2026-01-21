"""
SIMPLE VIDEO CONVERTER
Converts to vertical format (9:16) for Instagram/TikTok
No text overlays - just format conversion
"""

from moviepy import VideoFileClip
import os

def convert_to_vertical(input_path, output_path):
    """Convert video to vertical 9:16 format"""
    
    print("=" * 60)
    print("  VIDEO CONVERTER")
    print("=" * 60)
    print("")
    print(f">> Loading: {os.path.basename(input_path)}")
    
    # Load video
    video = VideoFileClip(input_path)
    
    print(f">> Original size: {video.w}x{video.h}")
    print(f">> Duration: {video.duration:.1f} seconds")
    
    # Trim to 45 seconds if needed
    if video.duration > 45:
        print(">> Trimming to 45 seconds...")
        video = video.subclipped(0, 45)
    
    # Convert to vertical (9:16) by cropping
    if video.w > video.h:
        print(">> Converting to vertical format (9:16)...")
        # Calculate crop dimensions
        target_w = int(video.h * 9 / 16)
        x_center = video.w // 2
        x1 = x_center - target_w // 2
        
        # Crop using subclip method
        video = video.cropped(x1=x1, x2=x1+target_w)
        print(f">> New size: {video.w}x{video.h}")
    
    # Resize to standard 1080x1920
    if video.w != 1080 or video.h != 1920:
        print(">> Resizing to 1080x1920...")
        video = video.resized((1080, 1920))
    
    print("")
    print(">> Exporting (this may take 2-5 minutes)...")
    print("")
    
    # Export
    video.write_videofile(
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
    print(">> Ready to post to Instagram Reels / TikTok!")
    print("")

if __name__ == "__main__":
    input_video = r"C:\Users\sumanth\Videos\Captures\Lucky Draw - Raja Cycle Mart - Google Chrome 2026-01-15 22-29-01.mp4"
    output_video = r"C:\Users\sumanth\Videos\lucky_draw_vertical.mp4"
    
    if not os.path.exists(input_video):
        print(f"ERROR: Video not found!")
        print(f"Looking for: {input_video}")
    else:
        convert_to_vertical(input_video, output_video)
