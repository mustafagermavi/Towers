const crane = document.getElementById('crane');
const world = document.getElementById('world');
const stack = document.getElementById('stack');
const trigger = document.getElementById('drop-trigger');
const multiText = document.getElementById('multi-text');

let score = 0;
let isDropping = false;
let angle = 0;
let speed = 0.05;
let currentWidth = 70; // پانی بلۆکەکە کە وردە وردە کەم دەکات

function loop() {
    if (!isDropping) {
        angle += speed;
        const x = Math.sin(angle) * 130;
        crane.style.transform = `translateX(calc(-50% + ${x}px))`;
    }
    requestAnimationFrame(loop);
}
loop();

trigger.onclick = () => {
    if (isDropping) return;
    dropBlock();
};

function dropBlock() {
    isDropping = true;
    const blockRect = document.getElementById('current-block').getBoundingClientRect();
    const dropX = blockRect.left;
    
    const fallingBlock = document.createElement('div');
    fallingBlock.className = 'block';
    fallingBlock.style.width = currentWidth + 'px';
    fallingBlock.style.position = 'fixed';
    fallingBlock.style.left = dropX + 'px';
    fallingBlock.style.top = blockRect.top + 'px';
    document.body.appendChild(fallingBlock);

    let y = blockRect.top;
    let vel = 0;

    const fall = setInterval(() => {
        vel += 0.9;
        y += vel;
        fallingBlock.style.top = y + 'px';

        const lastBlock = stack.lastElementChild.getBoundingClientRect();

        if (y + 45 >= lastBlock.top) {
            clearInterval(fall);
            handleLanding(fallingBlock, dropX, lastBlock.left, lastBlock.width);
        }
    }, 16);
}

function handleLanding(block, x, targetX, targetW) {
    const diff = x - targetX;
    
    if (Math.abs(diff) >= currentWidth) {
        alert("GAME OVER! Multiplier: " + multiText.innerText);
        location.reload();
        return;
    }

    // سیستەمی بڕینی بلۆک (Slicing)
    currentWidth -= Math.abs(diff);
    block.remove();

    const landed = document.createElement('div');
    landed.className = 'block';
    landed.style.width = currentWidth + 'px';
    landed.style.marginLeft = (diff > 0 ? diff/2 : 0) + 'px'; // ڕێکخستنی شوێن
    stack.appendChild(landed);

    score++;
    speed += 0.005;
    multiText.innerText = (1 + score * 0.5).toFixed(1) + "x";

    // بەرەو سەرەوە چوونی دوربین
    if (score > 2) {
        world.style.transform = `translateY(${score * 45}px)`;
    }

    isDropping = false;
    document.getElementById('current-block').style.width = currentWidth + 'px';
}
