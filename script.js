const player = document.getElementById('player');
const stage = document.getElementById('road-stage');
const stepBtn = document.getElementById('step-btn');
const cashBtn = document.getElementById('cash-btn');
const multiVal = document.getElementById('multi-text');
const nextVal = document.getElementById('next-win');
const laneVal = document.getElementById('lane-count');

let laneProgress = 0;
let currentMulti = 1.00;
let isActive = true;

// Pro Risk Curve: Multipliers grow faster at higher lanes
const curve = [
    1.25, 1.60, 2.10, 2.80, 3.75, 5.00, 6.80, 9.20, 12.50, 17.00,
    23.50, 32.00, 45.00, 62.00, 85.00, 120.0, 175.0, 250.0, 400.0, 1000.0
];

stepBtn.onclick = () => {
    if (!isActive) return;

    // RISK ALGORITHM: Increases with Lane
    // Starts at 12% bust chance, adds 2% every lane
    let bustRisk = 0.12 + (laneProgress * 0.02);
    
    if (Math.random() < bustRisk) {
        systemBust();
        return;
    }

    // SUCCESS
    laneProgress++;
    currentMulti = curve[laneProgress - 1];
    
    // Smooth Transitions
    updateDisplay();
    player.style.bottom = (24 + (laneProgress * 80)) + "px";
    
    if (laneProgress > 2) {
        stage.style.transform = `translateY(${(laneProgress - 2) * 80}px)`;
    }

    cashBtn.disabled = false;
    
    // Visual Feedback
    document.body.style.backgroundColor = "#111122";
    setTimeout(() => document.body.style.backgroundColor = "#050508", 50);
};

cashBtn.onclick = () => {
    if (cashBtn.disabled || !isActive) return;
    showEndScreen("MISSION SUCCESS", "var(--cyan)");
};

function updateDisplay() {
    multiVal.innerText = currentMulti.toFixed(2) + "x";
    nextVal.innerText = curve[laneProgress].toFixed(2) + "x";
    laneVal.innerText = laneProgress;
}

function systemBust() {
    isActive = false;
    player.style.backgroundColor = "var(--pink)";
    player.style.boxShadow = "0 0 30px var(--pink)";
    setTimeout(() => showEndScreen("SYSTEM BUSTED", "var(--pink)"), 400);
}

function showEndScreen(title, color) {
    isActive = false;
    document.getElementById('overlay').classList.remove('hidden');
    const status = document.getElementById('modal-status');
    status.innerText = title;
    status.style.color = color;
    document.getElementById('res-multi').innerText = currentMulti.toFixed(2) + "x";
    document.getElementById('res-lane').innerText = laneProgress;
}
