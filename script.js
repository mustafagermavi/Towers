const MY_WALLET = "UQB2qKRpNI3Qqxpi7uVR0mQTeE1aPPSExZXthOXCHkmLBd8t";
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: window.location.origin + '/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-btn'
});

const crane = document.getElementById('crane');
const stack = document.getElementById('stack-container');
const actionBtn = document.getElementById('action-btn');
const multiText = document.getElementById('multi-text');
const winAmt = document.getElementById('win-amt');
const floorText = document.getElementById('floor-count');

let score = 0, isDropping = false, isPaid = false, currentWidth = 80;
let craneX = 0, craneDir = 1, speed = 3;

function moveCrane() {
    if (!isDropping) {
        craneX += speed * craneDir;
        if (craneX > window.innerWidth - currentWidth || craneX < 0) craneDir *= -1;
        crane.style.left = craneX + 'px';
    }
    requestAnimationFrame(moveCrane);
}
moveCrane();

actionBtn.onclick = async () => {
    if (!tonConnectUI.connected) { await tonConnectUI.connectWallet(); return; }
    if (!isPaid) {
        try {
            const tx = { validUntil: Math.floor(Date.now()/1000)+60, messages: [{address: MY_WALLET, amount: "100000000"}] };
            await tonConnectUI.sendTransaction(tx);
            isPaid = true; actionBtn.innerText = "DROP!";
        } catch(e) { alert("Payment Failed"); }
    } else { if(!isDropping) dropBlock(); }
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
        if (y + 40 >= lastB.top) { clearInterval(fall); handleLanding(block, rect.left, lastB.left); }
    }, 16);
}

function handleLanding(block, x, targetX) {
    const diff = x - targetX;
    if (Math.abs(diff) >= currentWidth) { showGameOver(); return; }
    
    createParticles(x + currentWidth/2, block.getBoundingClientRect().top);
    currentWidth -= Math.abs(diff);
    block.remove();
    
    const landed = document.createElement('div');
    landed.className = 'p-block';
    landed.style.width = currentWidth + 'px';
    landed.style.marginLeft = (diff/2) + 'px';
    stack.appendChild(landed);

    score++; speed += 0.2;
    floorText.innerText = score;
    const multi = (1 + score * 0.4).toFixed(1);
    multiText.innerText = multi + "x";
    winAmt.innerText = (0.1 * multi).toFixed(2);
    
    if (score > 2) stack.style.transform = `translateY(${score * 40}px)`;
    document.getElementById('active-block').style.width = currentWidth + 'px';
    isDropping = false;
}

function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = x + 'px'; p.style.top = y + 'px';
        document.body.appendChild(p);
        const dx = (Math.random() - 0.5) * 100, dy = (Math.random() - 0.5) * 100;
        p.animate([{opacity: 1, transform: 'translate(0,0)'}, {opacity: 0, transform: `translate(${dx}px,${dy}px)`}], {duration: 500, easing: 'steps(5)'});
        setTimeout(() => p.remove(), 500);
    }
}

function showGameOver() {
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-floor').innerText = score;
    document.getElementById('final-win').innerText = winAmt.innerText;
    crane.style.display = 'none';
}
