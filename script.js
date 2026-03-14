body { 
    margin: 0; background: #000; overflow: hidden; 
    font-family: 'Poppins', sans-serif; 
    user-select: none; -webkit-tap-highlight-color: transparent;
}

#game-ui {
    position: absolute; top: 15%; width: 100%; text-align: center;
    color: white; pointer-events: none; z-index: 10;
}

#score-label { font-size: 100px; font-weight: 900; opacity: 0.9; }

#perfect-notif {
    color: #00ffcc; font-size: 24px; letter-spacing: 5px;
    opacity: 0; transform: scale(0.8);
}

#mobile-menu {
    position: absolute; inset: 0; background: radial-gradient(circle at center, #1e1e2f 0%, #000 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 100; padding-bottom: env(safe-area-inset-bottom);
}

.logo { font-size: 50px; color: white; margin: 0; letter-spacing: 2px; }
.logo span { color: #ff3e00; }

.instructions { color: #888; margin-top: 10px; font-size: 14px; }

#start-btn {
    margin-top: 50px; width: 80%; max-width: 300px; height: 70px;
    background: white; border: none; border-radius: 20px;
    font-size: 20px; font-weight: 900; color: black; cursor: pointer;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
