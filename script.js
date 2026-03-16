const crane = document.getElementById('crane');
const stack = document.getElementById('stack-container');
const actionBtn = document.getElementById('action-btn');
const multiText = document.getElementById('multi-text');
const floorText = document.getElementById('floor-count');
const highScoreText = document.getElementById('high-score');

let score = 0, isDropping = false, currentWidth = 80;
let craneX = 0, craneDir = 1, speed = 4;

// بارکردنی بەرزترین نمرە لە مۆبایلەکە
let savedBest = localStorage.getItem('pixelBest') || 0;
highScoreText.innerText = savedBest;

function moveCrane() {
    if (!isDropping) {
        craneX += speed * craneDir;
        if (craneX > window.innerWidth - currentWidth || craneX < 0) craneDir *= -1;
        crane.style.left = craneX + 'px';
    }
    requestAnimationFrame(moveCrane);
}
moveCrane();

actionBtn.onclick = () => {
    if (!isDropping) dropBlock();
};

function dropBlock() {
    isDropping = true;
    const rect = document.getElementById('active-block').getBoundingClientRect();
    const block = document.createElement('div');
    block.className = 'p-block';
    block.style.cssText = `position:fixed; left:${rect.left}px; top:${rect.top}px; width:${currentWidth}px;`;
    document.body.appendChild(block);

    let y = rect.top, vel = 0;
    const fall = setInterval(() => {
        vel += 0.8; y += vel;
        block.style.top = y + 'px';
        const lastB = stack.lastElementChild.getBoundingClientRect();
        if (y + 40 >= lastB.top) { 
            clearInterval(fall); 
            handleLanding(block, rect.left, lastB.left); 
        }
    }, 16);
}

function handleLanding(block, x, targetX) {
    const diff = x - targetX;
    if (Math.abs(diff) >= currentWidth) { 
        if(score > savedBest) localStorage.setItem('pixelBest', score);
        showGameOver(); 
        return; 
    }
    
    createParticles(x + currentWidth/2, block.getBoundingClientRect().top);
    currentWidth -= Math.abs(diff);
    block.remove();
    
    const landed = document.createElement('div');
    landed.className = 'p-block';
    landed.style.width = currentWidth + 'px';
    landed.style.marginLeft = (diff/2) + 'px';
    stack.appendChild(landed);

    score++; speed += 0.25;
    floorText.innerText = score;
    multiText.innerText = (1 + score * 0.4).toFixed(1) + "x";
    
    if (score > 2) stack.style.transform = `translateY(${score * 40}px)`;
    document.getElementById('active-block').style.width = currentWidth + 'px';
    isDropping = false;
}

function createParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = x + 'px'; p.style.top = y + 'px';
        document.body.appendChild(p);
        const dx = (Math.random() - 0.5) * 80, dy = (Math.random() - 0.5) * 80;
        p.animate([{opacity: 1, transform: 'translate(0,0)'}, {opacity: 0, transform: `translate(${dx}px,${dy}px)`}], {duration: 400, easing: 'steps(4)'});
        setTimeout(() => p.remove(), 400);
    }
}

function showGameOver() {
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-floor').innerText = score;
    crane.style.display = 'none';
}
