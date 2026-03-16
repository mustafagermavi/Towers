const crane = document.getElementById('crane');
const stack = document.getElementById('stack-container');
const actionBtn = document.getElementById('action-btn');
const floorText = document.getElementById('floor-count');
const multiText = document.getElementById('multi-text');
const stage = document.getElementById('stage');

let score = 0, isDropping = false, currentWidth = 80;
let craneX = 0, craneDir = 1, speed = 5;

// Pixel-perfect horizontal movement
function moveCrane() {
    if (!isDropping) {
        craneX += speed * craneDir;
        if (craneX > window.innerWidth - currentWidth - 20 || craneX < 0) craneDir *= -1;
        crane.style.left = Math.round(craneX) + 'px';
    }
    requestAnimationFrame(moveCrane);
}
moveCrane();

actionBtn.onclick = () => { if (!isDropping) dropBlock(); };

function dropBlock() {
    isDropping = true;
    const activeRect = document.getElementById('active-block').getBoundingClientRect();
    const block = document.createElement('div');
    block.className = 'p-block';
    block.style.cssText = `position:fixed; left:${activeRect.left}px; top:${activeRect.top}px; width:${currentWidth}px;`;
    document.body.appendChild(block);

    let y = activeRect.top, vel = 0;
    const fall = setInterval(() => {
        vel += 1.5; // Heavier gravity for arcade feel
        y += vel;
        block.style.top = Math.round(y) + 'px';
        
        const lastB = stack.lastElementChild.getBoundingClientRect();
        if (y + 40 >= lastB.top) { 
            clearInterval(fall); 
            handleLanding(block, activeRect.left, lastB.left); 
        }
    }, 16);
}

function handleLanding(block, x, targetX) {
    const diff = x - targetX;
    
    if (Math.abs(diff) >= currentWidth) { 
        triggerGameOver(); 
        return; 
    }

    // Impact Effect (Screen Shake)
    stage.classList.add('shake');
    setTimeout(() => stage.classList.remove('shake'), 100);

    currentWidth -= Math.abs(diff);
    block.remove();
    
    const landed = document.createElement('div');
    landed.className = 'p-block';
    landed.style.width = currentWidth + 'px';
    landed.style.marginLeft = (diff / 2) + 'px';
    stack.appendChild(landed);

    score++;
    speed += 0.4;
    floorText.innerText = score;
    multiText.innerText = (1 + score * 0.2).toFixed(1) + "x";
    
    // Camera scroll up
    if (score > 3) stack.style.transform = `translateY(${(score - 3) * 40}px)`;
    
    document.getElementById('active-block').style.width = currentWidth + 'px';
    isDropping = false;
}

function triggerGameOver() {
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-floor').innerText = score;
    stage.style.filter = "invert(1)";
}
