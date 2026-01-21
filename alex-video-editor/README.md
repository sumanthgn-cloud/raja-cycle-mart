# 🎬 Auto Video Editor v1.0

Automated video editing system that transforms raw screen recordings into polished, viral-ready content.

## ✨ Features

- **Auto Silence Removal** - Cuts videos by 30-40%, faster pacing
- **AI Captions** - Whisper AI generates perfect subtitles
- **Background Music** - Auto-ducking when you speak
- **Vertical Format** - Perfect 9:16 for Reels/TikTok
- **One Command** - `python auto_edit.py video.mp4`

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd alex-video-editor
pip install -r requirements.txt
```

### 2. Add Background Music (Optional)

```bash
# Create assets folder
mkdir -p assets/music

# Download free music from StreamBeats or YouTube Audio Library
# Save as: assets/music/lofi_coding.mp3
```

### 3. Process Your First Video

```bash
python auto_edit.py path/to/your/video.mp4
```

### 4. Get Your Edited Video

```
output/your_video_edited_20260115_235000.mp4
```

---

## ⚙️ Configuration

Edit `config.yaml` to customize:

```yaml
# Your branding
branding:
  name: "Sumanth GN"
  handle: "@sumanthgn"

# Video settings
video:
  output_format: "9:16"  # or "16:9"
  target_duration: 45    # seconds
  
# Silence removal
silence:
  enabled: true
  threshold_db: -40
  
# Captions
captions:
  enabled: true
  font_size: 50
  color: "#ffffff"
  
# Music
music:
  enabled: true
  volume: 0.3
```

---

## 📊 What It Does

### Input:
- 5-minute raw screen recording
- Lots of pauses and silence
- Horizontal 1920x1080

### Output:
- 45-second polished video
- All silence removed
- Auto-generated captions
- Background music
- Vertical 1080x1920
- Ready to post!

---

## 🎯 Usage Examples

### Basic Usage
```bash
python auto_edit.py lucky_draw_demo.mp4
```

### With Custom Config
```bash
python auto_edit.py video.mp4 --config my_config.yaml
```

### Batch Processing (Coming in v1.1)
```bash
python auto_edit.py input/*.mp4
```

---

## 🛠️ Troubleshooting

### "ModuleNotFoundError: No module named 'whisper'"
```bash
pip install openai-whisper
```

### "FFmpeg not found"
Download from: https://ffmpeg.org/download.html
Add to PATH

### Video is too short
Adjust in `config.yaml`:
```yaml
silence:
  threshold_db: -45  # More aggressive (was -40)
```

### Captions not appearing
Check font is installed:
```yaml
captions:
  font: "Arial"  # Use system font
```

---

## 📁 Folder Structure

```
alex-video-editor/
├── auto_edit.py          # Main script
├── config.yaml           # Settings
├── requirements.txt      # Dependencies
├── README.md            # This file
├── assets/
│   ├── music/           # Background music files
│   └── fonts/           # Custom fonts (optional)
├── input/               # Drop raw videos here
├── output/              # Edited videos appear here
└── temp/                # Temporary files (auto-deleted)
```

---

## 🎬 Workflow

1. **Record** your screen (OBS, phone, etc.)
2. **Drop** video in `input/` folder
3. **Run** `python auto_edit.py input/video.mp4`
4. **Get** edited video from `output/`
5. **Post** to Instagram/TikTok/YouTube

---

## 🔮 Roadmap

### v1.0 (Current)
- ✅ Silence removal
- ✅ Auto captions (Whisper)
- ✅ Background music
- ✅ Vertical conversion

### v1.1 (This Week)
- 📅 Auto-zoom on timestamps
- 📅 Text overlay system
- 📅 Batch processing
- 📅 Progress bar

### v1.2 (This Month)
- 📅 Auto-zoom on clicks (telemetry)
- 📅 Hook template library
- 📅 Simple animations
- 📅 Multi-platform export

### v2.0 (Next Month)
- 📅 Full Alex-style effects
- 📅 AI script generation
- 📅 Auto-upload to socials
- 📅 Analytics integration

---

## 💡 Tips for Best Results

1. **Record in good lighting** - Better for future auto-zoom features
2. **Speak clearly** - Whisper AI works better
3. **Minimize background noise** - Cleaner silence detection
4. **Use a script** - More coherent final video
5. **Test settings** - Adjust `config.yaml` for your style

---

## 🆓 100% Free Stack

- **Python** - Free
- **MoviePy** - MIT License
- **Whisper AI** - MIT License
- **FFmpeg** - GPL License
- **Background Music** - StreamBeats (Royalty-free)

**Total Cost: $0**

---

## 🤝 Support

Issues? Questions?
- Check `config.yaml` settings
- Read troubleshooting section
- Test with a short video first

---

## 📝 License

MIT License - Use freely for personal or commercial projects

---

**Built with ❤️ for content creators who want agency-level results without agency-level costs.**

**Ship fast. Ship often. Let the automation handle the boring stuff.** 🚀
