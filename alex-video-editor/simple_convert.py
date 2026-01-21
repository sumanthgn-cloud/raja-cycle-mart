"""
SIMPLE VIDEO CONVERTER v1.0
Just converts to vertical format without silence removal
Works without FFmpeg!
"""

import os
import sys
from moviepy import VideoFileClip

def convert_video(input_path, output_path="output/converted.mp4"):
    """Simple video converter - vertical format only"""
    
    print("=" * 60)
    print("  SIMPLE VIDEO CONVERTER")
    print("=" * 60)
    print("")
    print(f">> Loading: {os.path.basename(input_path)}")
    
    # Load video
    video = VideoFileClip(input_path)
    
    print(f"   Duration: {video.duration:.1f}s")
    print(f"   Size: {video.w}x{video.h}")
    print("")
    
    # Trim to 45 seconds if needed
    if video.duration > 45:
        print(">> Trimming to 45 seconds...")
        video = video.subclipped(0, 45)
    
    # Already vertical, just export
    print(">> Exporting...")
    print("   This will take 1-2 minutes...")
    print("")
    
    # Create output directory
    os.makedirs("output", exist_ok=True)
    
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
    
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python simple_convert.py input_video.mp4")
        sys.exit(1)
    
    input_video = sys.argv[1]
    
    if not os.path.exists(input_video):
        print(f"Error: File not found: {input_video}")
        sys.exit(1)
    
    convert_video(input_video)
