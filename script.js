const MY_WALLET = "UQB2qKRpNI3Qqxpi7uVR0mQTeE1aPPSExZXthOXCHkmLBd8t";

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: window.location.origin + '/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-btn'
});

const crane = document.getElementById('crane');
const world = document.getElementById('world');
const stack = document.getElementById('stack');
const mainBtn = document.getElementById('main-btn');
const multiText = document.getElementById('multi-text');
const winAmt = document.getElementById('win-amt');

let score = 0, isDropping = false, isPaid = false, currentWidth = 80;
let angle = 0, speed = 0.05;

function animate() {
    if (!isDropping) {
        angle += speed;
        crane.style.transform = `translateX(calc(-50% + ${Math.sin(angle) * 130}px))`;
    }
    requestAnimationFrame(animate);
}
animate();

tonConnectUI.onStatusChange(wallet => {
    mainBtn.innerText = wallet ? "START GAME (0.1 TON)" : "CONNECT WALLET";
});

mainBtn.onclick = async () => {
    if (!tonConnectUI.connected) { await tonConnectUI.connectWallet(); return; }
    if (!isPaid) {
        try {
            const tx = { validUntil: Math.floor(Date.now()/1000)+60, messages: [{address: MY_WALLET, amount: "100000000"}] };
            await tonConnectUI.sendTransaction(tx);
            isPaid = true; mainBtn.innerText = "BUILD!";
        } catch(e) { alert("Transaction Failed!"); }
    } else { if(!isDropping) dropBlock(); }
};

function dropBlock() {
    isDropping = true;
    const rect = document.getElementById('crane-block').getBoundingClientRect();
    const block = document.createElement('div');
    block.className = 'block';
    block.style.cssText = `position:fixed; left:${rect.left}px; top:${rect.top}px; width:${currentWidth}px;`;
    document.body.appendChild(block);

    let y = rect.top, vel = 0;
    const fall = setInterval(() => {
        vel += 0.8; y += vel;
        block.style.top = y + 'px';
        const lastRect = stack.lastElementChild.getBoundingClientRect();
        if (y + 45 >= lastRect.top) { clearInterval(fall); handleLanding(block, rect.left, lastRect.left); }
    }, 16);
}

function handleLanding(block, x, targetX) {
    const diff = x - targetX;
    if (Math.abs(diff) >= currentWidth) { alert("Game Over! Win: " + winAmt.innerText); location.reload(); return; }
    
    currentWidth -= Math.abs(diff);
    block.remove();
    const landed = document.createElement('div');
    landed.className = 'block';
    landed.style.width = currentWidth + 'px';
    landed.style.marginLeft = (diff/2) + 'px';
    stack.appendChild(landed);

    score++; speed += 0.005;
    const multi = 1 + (score * 0.5);
    multiText.innerText = multi.toFixed(1) + "x";
    winAmt.innerText = (0.1 * multi).toFixed(2);
    if (score > 2) world.style.transform = `translateY(${score * 45}px)`;
    document.getElementById('crane-block').style.width = currentWidth + 'px';
    isDropping = false;
}
