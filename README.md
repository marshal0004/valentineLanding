# Here are your Instructions
"# 💝 ValentineMemories3D - 3D Storytelling Landing Page

A beautiful, animated 3D Valentine's Day memory page with admin panel for content management.

---

## ⚡ Quick Start (Arch Linux)

### Option 1: Automated Setup (Recommended)
```bash
cd /app
./setup.sh
```

Then start the application:
```bash
./start-tmux.sh  # Runs both backend and frontend in tmux
```

### Option 2: Manual Setup
See detailed instructions in [LOCAL_SETUP.md](LOCAL_SETUP.md)

---

## 🌐 Access URLs

- **Public Page**: http://localhost:3000 (Password: `143`)
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:8001/api

---

## 📋 Prerequisites

- **Python 3.11+**
- **Node.js 16+** and **Yarn**
- **MongoDB** (running as service)

Install on Arch Linux:
```bash
sudo pacman -S python python-pip nodejs npm mongodb mongodb-tools
sudo npm install -g yarn
sudo systemctl enable mongodb --now
```

---

## 🎯 Features

### Public Experience
- 🔐 Password-protected entry
- 💖 Animated intro with 3D crystal heart
- 📸 8 unique memory sections with different 3D animations:
  - Floating Polaroids
  - 3D Carousel
  - Scattered Desk Photos
  - Glowing Film Strip
  - Photo Cube
  - Floating Bubbles
  - Vinyl Records
  - Gallery Wall
- 💌 Interactive love letter in envelope (final section)
- ⏱️ Live countdown timer (relationship duration)
- 🎵 Background music player
- ✨ Persistent particle effects (rose petals, floating hearts)

### Admin Panel
- 📊 Dashboard with section management
- ✏️ Section editor (upload photos, edit titles/captions)
- ⚙️ Global settings (couple names, password, date, love letter)
- 📱 QR code generator (for sharing)

---

## 🚀 Running the Application

### Start Backend
```bash
cd /app/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Start Frontend
```bash
cd /app/frontend
yarn start
```

### Using tmux (Easier)
```bash
cd /app
./start-tmux.sh
```

---

## 📸 Adding Your Photos

1. Go to http://localhost:3000/admin
2. Click on any section to edit
3. Upload:
   - 1 **Background Photo** (full-section background)
   - 4 **Overlay Photos** (animated gallery)
4. Photos are auto-compressed and optimized

---

## 🎨 Tech Stack

**Backend:**
- FastAPI (Python)
- MongoDB (motor async driver)
- Pillow (image compression)

**Frontend:**
- React 19
- Tailwind CSS
- Framer Motion (animations)
- Howler.js (music)
- Zustand (state management)
- React Router (routing)

---

## 🐛 Troubleshooting

### MongoDB not running
```bash
sudo systemctl start mongodb
```

### Port already in use
```bash
# Kill process on port 8001 (backend)
sudo lsof -i :8001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (frontend)
sudo lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Dependencies issues
```bash
# Backend
cd /app/backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd /app/frontend
rm -rf node_modules yarn.lock
yarn install
```

---

## 📚 Documentation

- [LOCAL_SETUP.md](LOCAL_SETUP.md) - Detailed setup guide
- [REMOVED_EMERGENT_CONFIGS.md](REMOVED_EMERGENT_CONFIGS.md) - Changes made for local development
- [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - Full feature documentation

---

## 🎁 Customization

### Change Password
1. Admin → Settings
2. Update \"Access Password\"
3. Save

### Change Couple Names
1. Admin → Settings
2. Update \"Couple Names\"
3. Save

### Write Love Letter
1. Admin → Settings
2. Scroll to \"Love Letter\"
3. Write your message
4. Save

### Upload Music
1. Admin → Settings
2. Click \"Upload Music\"
3. Select MP3 file
4. Save

---

## 📝 Default Configuration

- **Password**: `143`
- **Database**: `valentine_memories`
- **Backend Port**: `8001`
- **Frontend Port**: `3000`
- **Couple Names**: \"You & Your Love\"
- **Relationship Start**: February 14, 2023

---

## ✅ Verification Checklist

- [ ] MongoDB running: `sudo systemctl status mongodb`
- [ ] Backend running: `curl http://localhost:8001/api/sections`
- [ ] Frontend running: `http://localhost:3000` opens in browser
- [ ] Password `143` works
- [ ] Admin panel accessible
- [ ] Photos upload successfully
- [ ] All sections display
- [ ] Animations work
- [ ] Love letter reveals

---

## 💡 Tips

- Use **tmux** for easier terminal management
- Upload high-quality photos (they'll be auto-compressed)
- Test on mobile devices for responsive design
- Generate QR code for easy sharing on same WiFi network

---

## 🎉 Made with ❤️

A beautiful way to celebrate your love story!

---

## 📞 Support

For issues or questions, check the troubleshooting section in [LOCAL_SETUP.md](LOCAL_SETUP.md)
"