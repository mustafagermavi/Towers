<!DOCTYPE html>
<html lang="ku">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Pixel Aviator Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
        /* دیزاینی پیکسڵ و لوکس */
        :root {
            --bg: #0b0e11;
            --panel: #1c1d20;
            --red: #ff3e3e;
            --green: #2ebd85;
            --gold: #f3ba2f;
        }

        body { 
            background: var(--bg); color: white; font-family: 'Press Start 2P', cursive; 
            margin: 0; display: flex; flex-direction: column; align-items: center;
            image-rendering: pixelated; overflow: hidden; height: 100vh;
        }

        /* سەرەوە و مێژوو */
        .header { width: 100%; padding: 15px; display: flex; justify-content: space-between; font-size: 9px; background: #161a1e; border-bottom: 4px solid #222; box-sizing: border-box; }
        .history { width: 100%; height: 40px; background: #000; display: flex; align-items: center; gap: 10px; padding: 0 15px; overflow-x: auto; border-bottom: 2px solid #333; }
        .h-item { padding: 4px 10px; border-radius: 2px; font-size: 8px; color: white; }
        .low { background: #3498db; } .mid { background: #9b59b6; } .high { background: var(--gold); color: #000; }

        /* گۆڕەپانی پیکسڵ */
        .stage {
            width: 95%; max-width: 500px; height: 300px; background: #121214;
            margin-top: 10px; border: 6px solid #282a2f; position: relative; overflow: hidden;
        }
        .grid { position: absolute; width: 200%; height: 200%; background-image: linear-gradient(#222 2px, transparent 2px), linear-gradient(90deg, #222 2px, transparent 2px); background-size: 40px 40px; opacity: 0.5; animation: moveGrid 4s linear infinite; }
        @keyframes moveGrid { from { transform: translate(0, 0); } to { transform: translate(-40px, 40px); } }

        #multiplier { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; z-index: 10; text-shadow: 4px 4px #000; }

        /* فڕۆکەی پیکسڵی (CSS Art) */
        #plane-box { position: absolute; bottom: 20px; left: 20px; z-index: 5; display: none; }
        .pixel-plane {
            width: 32px; height: 16px; background: var(--red);
            box-shadow: 8px 0 0 var(--red), 0 8px 0 #900, 8px 8px 0 #900, -8px 8px 0 var(--red);
        }

        /* سیستەمی دوو دوگمە (Double Bet) */
        .bet-grid { width: 95%; max-width: 500px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
        .bet-card { background: var(--panel); padding: 15px; border: 4px solid #333; border-radius: 4px; display: flex; flex-direction: column; gap: 10px; }
        input { background: #000; border: 2px solid #444; color: var(--gold); font-family: 'Press Start 2P'; font-size: 12px; padding: 10px; text-align: center; outline: none; }
        
        .main-btn { width: 100%; padding: 20px 0; font-family: 'Press Start 2P'; font-size: 11px; border: none; cursor: pointer; color: white; border-bottom: 6px solid rgba(0,0,0,0.4); }
        .btn-ready { background: var(--green); }
        .btn-cash { background: var(--gold); color: #000; }
        .btn-wait { background: #444; opacity: 0.7; cursor: not-allowed; border-bottom: none; }

        @media (max-width: 500px) { .bet-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>

<div class="header">
    <span>PLAYER: MUSTAFA</span>
    <span id="balance-val" style="color:var(--gold)">1000.00 IQD</span>
</div>

<div class="history" id="h-box"></div>

<div class="stage" id="game-stage">
    <div class="grid"></div>
    <div id="multiplier">1.00x</div>
    <div id="plane-box">
        <div class="pixel-plane"></div>
    </div>
</div>

<div class="bet-grid">
    <div class="bet-card">
        <input type="number" id="amt1" value="100">
        <button id="btn1" class="main-btn btn-ready" onclick="handleBet(1)">BET</button>
    </div>
    <div class="bet-card">
        <input type="number" id="amt2" value="100">
        <button id="btn2" class="main-btn btn-ready" onclick="handleBet(2)">BET</button>
    </div>
</div>

<script>
    let bal = 1000.00;
    let mult = 1.00;
    let status = "LOBBY"; // LOBBY, FLYING, CRASHED
    let crashPoint = 0;
    let bets = { 1: { active: false, amt: 0, win: false }, 2: { active: false, amt: 0, win: false } };

    const multEl = document.getElementById('multiplier');
    const plane = document.getElementById('plane-box');

    // لۆژیکی ئەسڵی: چاوەڕوانی (Lobby)
    function startLobby() {
        status = "LOBBY";
        mult = 1.00;
        multEl.innerText = "NEXT ROUND...";
        multEl.style.color = "#888";
        plane.style.display = "none";
        setTimeout(launch, 6000); // 6 چرکە کاتی گرەوکردن
    }

    function launch() {
        status = "FLYING";
        // فۆرمۆڵەی ئەسڵی ئەڤیاتۆر بۆ تەقینەوە
        crashPoint = (0.99 / (1 - Math.random())).toFixed(2);
        if (crashPoint < 1.01) crashPoint = 1.01;
        
        plane.style.display = "block";
        multEl.style.color = "var(--green)";
        
        for(let i=1; i<=2; i++) {
            if(bets[i].active) {
                document.getElementById('btn'+i).innerText = "CASH OUT";
                document.getElementById('btn'+i).className = "main-btn btn-cash";
            }
        }
        engine();
    }

    function engine() {
        if(status !== "FLYING") return;
        mult += 0.001 * Math.pow(mult, 1.4);
        multEl.innerText = mult.toFixed(2) + "x";

        // جوڵەی فڕۆکەی پیکسڵی
        let x = Math.min((mult - 1) * 75, 300);
        let y = Math.min(Math.pow(mult - 1, 1.3) * 50, 200);
        plane.style.left = (20 + x) + "px";
        plane.style.bottom = (20 + y) + "px";

        if(mult >= crashPoint) {
            boom();
        } else {
            requestAnimationFrame(engine);
        }
    }

    function boom() {
        status = "CRASHED";
        multEl.innerText = "BOOM!";
        multEl.style.color = "var(--red)";
        plane.style.display = "none";
        
        saveH(mult);
        for(let i=1; i<=2; i++) {
            bets[i].active = false;
            document.getElementById('btn'+i).innerText = "BET";
            document.getElementById('btn'+i).className = "main-btn btn-ready";
        }
        setTimeout(startLobby, 3000);
    }

    function handleBet(id) {
        const amt = parseFloat(document.getElementById('amt'+id).value);
        const btn = document.getElementById('btn'+id);

        if(status === "LOBBY" && !bets[id].active) {
            if(amt > bal) return;
            bal -= amt;
            bets[id] = { active: true, amt: amt, win: false };
            btn.innerText = "WAITING";
            btn.className = "main-btn btn-wait";
            updateUI();
        } else if(status === "FLYING" && bets[id].active && !bets[id].win) {
            let winAmt = (bets[id].amt * mult).toFixed(2);
            bal += parseFloat(winAmt);
            bets[id].win = true;
            btn.innerText = "WIN: " + Math.floor(winAmt);
            btn.className = "main-btn btn-wait";
            updateUI();
        }
    }

    function saveH(v) {
        const box = document.getElementById('h-box');
        const d = document.createElement('div');
        let c = v < 2 ? 'low' : (v < 10 ? 'mid' : 'high');
        d.className = `h-item ${c}`;
        d.innerText = parseFloat(v).toFixed(2) + 'x';
        box.prepend(d);
    }

    function updateUI() { document.getElementById('balance-val').innerText = bal.toFixed(2) + " IQD"; }

    startLobby();
</script>

</body>
</html>
