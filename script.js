let scene, camera, renderer, activeBlock;
let blocks = [];
let score = 0;
let isPlaying = false;
let isMuted = false;
const boxHeight = 1;

// --- سیستەمی دەنگی Pop ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playPop(pitch) {
    if (isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220 + (pitch * 40), audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);
    scene.fog = new THREE.Fog(0x0a0a12, 10, 35);

    const aspect = window.innerWidth / window.innerHeight;
    const d = 8;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // ڕووناکی داینامیکی
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(5, 15, 7);
    sun.castShadow = true;
    scene.add(sun);

    createBase();
    animate();
}

function createBase() {
    const geo = new THREE.BoxGeometry(4, boxHeight, 4);
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    scene.add(mesh);
    blocks.push({ mesh, width: 4, depth: 4 });
}

function spawnBlock() {
    const last = blocks[blocks.length - 1];
    const color = new THREE.Color(`hsl(${(score * 20) % 360}, 70%, 55%)`);
    const geo = new THREE.BoxGeometry(last.width, boxHeight, last.depth);
    const mat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.2, roughness: 0.4 });
    activeBlock = new THREE.Mesh(geo, mat);
    activeBlock.castShadow = true;
    activeBlock.receiveShadow = true;
    activeBlock.position.set(-8, blocks.length * boxHeight, last.mesh.position.z);
    scene.add(activeBlock);

    gsap.to(activeBlock.position, {
        x: 8,
        duration: Math.max(0.6, 2 - (score * 0.05)),
        repeat: -1, yoyo: true, ease: "sine.inOut"
    });
}

function handleAction() {
    if (!isPlaying) return;
    
    const last = blocks[blocks.length - 1];
    gsap.killTweensOf(activeBlock.position);
    const diff = activeBlock.position.x - last.mesh.position.x;

    if (Math.abs(diff) < last.width) {
        let newWidth = last.width - Math.abs(diff);
        let finalX = activeBlock.position.x + (diff / 2);

        if (Math.abs(diff) < 0.2) { // Perfect!
            newWidth = last.width;
            finalX = last.mesh.position.x;
            showPerfect();
            playPop(score % 12 + 5);
        }

        const color = activeBlock.material.color;
        scene.remove(activeBlock);
        
        const geo = new THREE.BoxGeometry(newWidth, boxHeight, last.depth);
        const mat = new THREE.MeshStandardMaterial({ color: color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(finalX, blocks.length * boxHeight, last.mesh.position.z);
        mesh.castShadow = true; mesh.receiveShadow = true;
        scene.add(mesh);
        
        blocks.push({ mesh, width: newWidth, depth: last.depth });
        score++;
        updateUI();
        playPop(score % 12);

        gsap.to(camera.position, { y: blocks.length + 10, duration: 1 });
        spawnBlock();
    } else {
        gameOver();
    }
}

function showPerfect() {
    const msg = document.getElementById('message');
    gsap.fromTo(msg, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
    gsap.to(camera.position, { x: 10.3, duration: 0.05, repeat: 3, yoyo: true });
}

function updateUI() {
    document.getElementById('bg-score').innerText = score;
    document.getElementById('current-score').innerText = score;
}

function gameOver() {
    isPlaying = false;
    gsap.to(camera.position, { x: 20, z: 20, duration: 2 });
    setTimeout(() => location.reload(), 2000);
}

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// --- ڕووداوەکان ---
document.getElementById('startBtn').onclick = () => {
    audioCtx.resume();
    isPlaying = true;
    gsap.to(document.getElementById('start-screen'), { opacity: 0, onComplete: () => {
        document.getElementById('start-screen').style.display = 'none';
        spawnBlock();
    }});
};

window.addEventListener('mousedown', handleAction);
window.addEventListener('touchstart', (e) => { e.preventDefault(); handleAction(); });
document.getElementById('sound-btn').onclick = (e) => {
    e.stopPropagation();
    isMuted = !isMuted;
    document.getElementById('sound-btn').innerText = isMuted ? '🔇' : '🔊';
};

init();
