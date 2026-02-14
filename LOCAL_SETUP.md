"# 🚀 ValentineMemories3D - Local Development Setup (Arch Linux)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your Arch Linux system:

### 1. Install Python 3.11+
```bash
sudo pacman -S python python-pip
python --version  # Should be 3.11 or higher
```

### 2. Install Node.js and Yarn
```bash
sudo pacman -S nodejs npm
sudo npm install -g yarn
node --version  # Should be 16+ or higher
yarn --version
```

### 3. Install MongoDB
```bash
# Install MongoDB
sudo pacman -S mongodb mongodb-tools

# Enable and start MongoDB service
sudo systemctl enable mongodb
sudo systemctl start mongodb

# Verify MongoDB is running
sudo systemctl status mongodb

# Test MongoDB connection
mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
```

### 4. Install Git (if not already installed)
```bash
sudo pacman -S git
```

---

## 🛠️ Project Setup

### Step 1: Navigate to Project Directory
```bash
cd /app
# Or wherever you've placed the project
```

### Step 2: Backend Setup

#### Install Backend Dependencies
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Activate virtual environment

# Install dependencies
pip install -r requirements.txt
```

#### Verify Backend .env Configuration
```bash
cat .env
# Should contain:
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=valentine_memories
# CORS_ORIGINS=http://localhost:3000
```

#### Test Backend
```bash
# Make sure you're in /app/backend directory with venv activated
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Open a new terminal and test:
```bash
curl http://localhost:8001/api/sections
# Should return JSON with sections data
```

If successful, you'll see JSON output. Press `Ctrl+C` to stop the server.

---

### Step 3: Frontend Setup

#### Install Frontend Dependencies
```bash
# Open a new terminal
cd /app/frontend

# Install dependencies using yarn
yarn install

# This may take 5-10 minutes depending on your internet speed
```

#### Verify Frontend .env Configuration
```bash
cat .env
# Should contain:
# REACT_APP_BACKEND_URL=http://localhost:8001
```

#### Test Frontend
```bash
# Make sure you're in /app/frontend directory
yarn start
```

The app should open automatically at `http://localhost:3000`

---

## 🎯 Running the Complete Application

### Option 1: Manual (3 Terminals)

This is the recommended approach for development:

#### Terminal 1 - MongoDB (usually runs as service)
```bash
# MongoDB should already be running as a system service
# Check status:
sudo systemctl status mongodb

# If not running, start it:
sudo systemctl start mongodb
```

#### Terminal 2 - Backend
```bash
cd /app/backend
source venv/bin/activate  # Activate virtual environment
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
```

#### Terminal 3 - Frontend
```bash
cd /app/frontend
yarn start
```

You should see:
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

### Option 2: Using tmux (Single Terminal with Multiple Panes)

```bash
# Install tmux if not already installed
sudo pacman -S tmux

# Create a new tmux session
tmux new -s valentine

# Split terminal horizontally
Ctrl+b then \"

# In top pane, run backend:
cd /app/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Switch to bottom pane
Ctrl+b then down-arrow

# Run frontend:
cd /app/frontend
yarn start

# Navigate between panes: Ctrl+b then arrow keys
# Detach from session: Ctrl+b then d
# Reattach to session: tmux attach -t valentine
```

---

## 🔐 Access the Application

### Public Page
1. Open browser: `http://localhost:3000`
2. Enter password: `143`
3. Explore the Valentine's memory experience!

### Admin Panel
1. Open browser: `http://localhost:3000/admin`
2. Create/edit sections, upload photos, configure settings

---

## 📸 Uploading Photos

### From Admin Panel
1. Navigate to `http://localhost:3000/admin`
2. Click on a section to edit
3. Upload:
   - **1 Background Photo** (displays as section background)
   - **Up to 4 Overlay Photos** (displays in the animated gallery)
4. Supported formats: JPG, JPEG, PNG, WEBP
5. Max file size: 10MB per photo
6. Photos are automatically compressed and stored in `backend/uploads/`

---

## 🎵 Adding Background Music

1. Navigate to `http://localhost:3000/admin/settings`
2. Click \"Upload Music\" button
3. Select an MP3 file (recommended: 3-5 minutes, loopable)
4. Music will play automatically on the public experience page

---

## 🧪 Testing & Verification

### Test Backend API
```bash
# Get all sections
curl http://localhost:8001/api/sections | jq

# Get settings
curl http://localhost:8001/api/settings | jq

# Test password verification
curl -X POST http://localhost:8001/api/auth/verify \
  -H \"Content-Type: application/json\" \
  -d '{\"password\": \"143\"}'
```

### Test Frontend
1. **Password Gate**: Enter `143` → should redirect to experience
2. **Intro Section**: Should show animated heart, countdown timer
3. **Memory Sections**: Scroll through 8 unique animated galleries
4. **Final Section**: Click envelope → love letter reveals
5. **Admin Panel**: Create/edit/delete sections, upload photos

---

## 🐛 Troubleshooting

### MongoDB Not Running
```bash
# Check status
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# View MongoDB logs
sudo journalctl -u mongodb -f
```

### Backend Errors
```bash
# Check if port 8001 is already in use
sudo lsof -i :8001

# Kill process on port 8001
sudo kill -9 <PID>

# View backend logs (when running)
# Logs appear in the terminal where uvicorn is running
```

### Frontend Errors
```bash
# Clear node modules and reinstall
cd /app/frontend
rm -rf node_modules yarn.lock
yarn install

# Clear cache
yarn cache clean

# Check if port 3000 is already in use
sudo lsof -i :3000

# Kill process on port 3000
sudo kill -9 <PID>
```

### Missing Dependencies
```bash
# Backend
cd /app/backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd /app/frontend
yarn install
```

### Database Issues
```bash
# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use valentine_memories database
use valentine_memories

# View collections
show collections

# View sections
db.sections.find().pretty()

# View settings
db.settings.find().pretty()

# Drop database (if you want to start fresh)
db.dropDatabase()
# Then restart backend to reseed
```

---

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Backend configuration
│   ├── uploads/           # Uploaded photos/music (created automatically)
│   └── venv/              # Virtual environment (after setup)
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages (PasswordGate, Experience, Admin)
│   │   ├── components/    # React components
│   │   ├── stores/        # Zustand state management
│   │   ├── utils/         # API utilities
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   ├── .env              # Frontend configuration
│   ├── package.json      # Node dependencies
│   └── node_modules/     # Installed packages (after yarn install)
├── LOCAL_SETUP.md        # This file
├── IMPLEMENTATION_COMPLETE.md
├── progress.md
└── test_result.md
```

---

## 🎨 Default Configuration

- **Database**: `valentine_memories` (MongoDB)
- **Password**: `143` (can be changed in Admin → Settings)
- **Backend Port**: `8001`
- **Frontend Port**: `3000`
- **Couple Names**: \"You & Your Love\" (change in Admin → Settings)
- **Relationship Date**: 2023-02-14 (change in Admin → Settings)

---

## 🚀 Next Steps After Setup

1. **Customize Content**:
   - Go to Admin panel
   - Update couple names in Settings
   - Set your relationship start date
   - Write your love letter
   - Change password to something personal

2. **Upload Photos**:
   - Edit each of the 8 memory sections
   - Upload background + 4 overlay photos per section
   - Add titles and captions

3. **Add Music**:
   - Upload a romantic song (MP3)
   - Test music player on public page

4. **Generate QR Code**:
   - Go to Admin → QR Code
   - Download the QR code image
   - Print it on a card/gift

5. **Test Complete Flow**:
   - Open public page in private/incognito browser
   - Enter password
   - Scroll through all sections
   - Test envelope reveal
   - Verify countdown timer

---

## 📞 Common Commands Reference

### Start Everything
```bash
# Terminal 1: MongoDB (if not running as service)
sudo systemctl start mongodb

# Terminal 2: Backend
cd /app/backend && source venv/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 3: Frontend
cd /app/frontend && yarn start
```

### Stop Everything
```bash
# In each terminal: Ctrl+C

# Or kill processes
sudo pkill -f uvicorn
sudo pkill -f \"node.*react-scripts\"
```

### View Logs
```bash
# MongoDB logs
sudo journalctl -u mongodb -f

# Backend logs: visible in terminal where uvicorn is running

# Frontend logs: visible in terminal where yarn start is running
```

---

## ✅ Success Checklist

- [ ] MongoDB is running (`sudo systemctl status mongodb`)
- [ ] Backend is running on port 8001 (`curl http://localhost:8001/api/sections`)
- [ ] Frontend is running on port 3000 (browser opens automatically)
- [ ] Password gate loads at `http://localhost:3000`
- [ ] Password `143` works and redirects to experience
- [ ] Admin panel accessible at `http://localhost:3000/admin`
- [ ] Photos can be uploaded successfully
- [ ] All 10 sections display correctly
- [ ] Animations are working
- [ ] Love letter reveals on envelope click

---

## 🎉 You're All Set!

Your Valentine's Day 3D memory page is now running locally!

Customize it, add your photos, and create a beautiful gift for your loved one. ❤️

**Note**: This application runs entirely on your local machine. To share it with someone:
1. Generate the QR code from the admin panel
2. Make sure they're on the same WiFi network
3. Use your local IP address instead of localhost (e.g., `http://192.168.1.x:3000`)
4. Or deploy to a hosting service (Vercel, Netlify, Railway, etc.)
"