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

const curve = [1.25, 1.60, 2.10, 2.85, 3.80, 5.10, 6.90, 9.50, 13.0, 18.0, 25.0, 35.0, 50.0, 75.0, 110.0, 160.0, 240.0, 380.0, 600.0, 1000.0];

function spawnEnemyCar(laneY) {
    const car = document.createElement('div');
    car.className = 'car-icon';
    car.style.bottom = (laneY + 25) + 'px';
    
    const fromLeft = Math.random() > 0.5;
    car.style.left = fromLeft ? '-100px' : (window.innerWidth + 100) + 'px';
    stage.appendChild(car);

    const speed = 4 + (Math.random() * 6);
    const direction = fromLeft ? 1 : -1;

    const driveLoop = setInterval(() => {
        if (!isActive) { clearInterval(driveLoop); return; }
        
        let x = parseInt(car.style.left);
        x += speed * direction;
        car.style.left = x + 'px';

        const pRect = player.getBoundingClientRect();
        const cRect = car.getBoundingClientRect();

        if (pRect.left < cRect.right && pRect.right > cRect.left &&
            pRect.top < cRect.bottom && pRect.bottom > cRect.top) {
            systemBust();
            clearInterval(driveLoop);
        }

        if (x > window.innerWidth + 200 || x < -200) {
            clearInterval(driveLoop);
            car.remove();
        }
    }, 20);
}

stepBtn.onclick = () => {
    if (!isActive) return;

    if (Math.random() < 0.12) { // 12% Risk
        systemBust();
        return;
    }

    laneProgress++;
    currentMulti = curve[laneProgress - 1];
    
    updateDisplay();
    player.style.bottom = (24 + (laneProgress * 80)) + "px";
    
    // دروستکردنی سەیارە لەگەڵ هەر هەنگاوێک
    spawnEnemyCar(laneProgress * 80);

    if (laneProgress > 2) {
        stage.style.transform = `translateY(${(laneProgress - 2) * 80}px)`;
    }

    cashBtn.disabled = false;
};

cashBtn.onclick = () => {
    if (cashBtn.disabled || !isActive) return;
    showEndScreen("WIN SECURED", "var(--cyan)");
};

function updateDisplay() {
    multiVal.innerText = currentMulti.toFixed(2) + "x";
    nextVal.innerText = curve[laneProgress].toFixed(2) + "x";
    laneVal.innerText = laneProgress;
}

function systemBust() {
    isActive = false;
    player.style.backgroundColor = "red";
    setTimeout(() => showEndScreen("SYSTEM BUSTED", "var(--pink)"), 300);
}

function showEndScreen(title, color) {
    document.getElementById('overlay').classList.remove('hidden');
    const status = document.getElementById('modal-status');
    status.innerText = title;
    status.style.color = color;
    document.getElementById('res-multi').innerText = currentMulti.toFixed(2) + "x";
    document.getElementById('res-lane').innerText = laneProgress;
}
