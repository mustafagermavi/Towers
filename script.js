const crane = document.getElementById('crane');
const tower = document.getElementById('tower-container');
const buildBtn = document.getElementById('build-btn');
const multiDisplay = document.getElementById('multi');

let score = 0;
let isDropping = false;
let angle = 0;
let craneX = 0;

function swing() {
    if (!isDropping) {
        angle += 0.05;
        craneX = Math.sin(angle) * 120;
        crane.style.left = `calc(50% + ${craneX}px)`;
    }
    requestAnimationFrame(swing);
}
swing();

buildBtn.addEventListener('click', () => {
    if (isDropping) return;
    isDropping = true;

    const block = document.createElement('div');
    block.className = 'block';
    block.style.position = 'absolute';
    block.style.left = crane.offsetLeft + 'px';
    block.style.top = '100px';
    document.querySelector('.game-area').appendChild(block);

    let currentY = 100;
    const targetY = document.querySelector('.game-area').offsetHeight - (score * 40) - 100;

    const fall = setInterval(() => {
        currentY += 10;
        block.style.top = currentY + 'px';

        if (currentY >= targetY) {
            clearInterval(fall);
            if (Math.abs(craneX) < 50) { // Success
                block.remove();
                const newB = document.createElement('div');
                newB.className = 'block';
                tower.appendChild(newB);
                score++;
                multiDisplay.innerText = `x${(1 + score * 0.5).toFixed(2)}`;
                if(score > 3) tower.style.transform = `translateY(${(score-3)*40}px)`;
                isDropping = false;
            } else {
                alert("GAME OVER! Final Multiplier: " + multiDisplay.innerText);
                location.reload();
            }
        }
    }, 10);
});
