"#!/bin/bash

# ValentineMemories3D - tmux Session Manager
# This script creates a tmux session with backend and frontend running in split panes

SESSION_NAME=\"valentine\"

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo \"❌ tmux is not installed. Installing...\"
    sudo pacman -S tmux
fi

# Check if session already exists
tmux has-session -t $SESSION_NAME 2>/dev/null

if [ $? == 0 ]; then
    echo \"📌 Session '$SESSION_NAME' already exists. Attaching...\"
    tmux attach -t $SESSION_NAME
    exit 0
fi

echo \"🚀 Creating new tmux session: $SESSION_NAME\"

# Create new session with first window
tmux new-session -d -s $SESSION_NAME -n \"ValentineApp\"

# Split window horizontally
tmux split-window -h -t $SESSION_NAME

# Select left pane and run backend
tmux select-pane -t $SESSION_NAME:0.0
tmux send-keys -t $SESSION_NAME \"cd /app/backend\" C-m
tmux send-keys -t $SESSION_NAME \"source venv/bin/activate\" C-m
tmux send-keys -t $SESSION_NAME \"clear\" C-m
tmux send-keys -t $SESSION_NAME \"echo '🔴 Starting Backend Server...'\" C-m
tmux send-keys -t $SESSION_NAME \"uvicorn server:app --host 0.0.0.0 --port 8001 --reload\" C-m

# Select right pane and run frontend
tmux select-pane -t $SESSION_NAME:0.1
tmux send-keys -t $SESSION_NAME \"cd /app/frontend\" C-m
tmux send-keys -t $SESSION_NAME \"clear\" C-m
tmux send-keys -t $SESSION_NAME \"echo '⚛️  Starting Frontend Server...'\" C-m
tmux send-keys -t $SESSION_NAME \"sleep 3 && yarn start\" C-m

# Attach to session
echo \"\"
echo \"✅ Session created successfully!\"
echo \"\"
echo \"📖 tmux Quick Reference:\"
echo \"  • Switch panes: Ctrl+b then arrow keys\"
echo \"  • Detach session: Ctrl+b then d\"
echo \"  • Kill session: Ctrl+b then :kill-session\"
echo \"\"
echo \"🔗 Access URLs:\"
echo \"  Public: http://localhost:3000\"
echo \"  Admin:  http://localhost:3000/admin\"
echo \"\"
echo \"Attaching to session in 2 seconds...\"
sleep 2

tmux attach -t $SESSION_NAME
"