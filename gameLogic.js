    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const nextCharElem = document.getElementById('next-char');
    const statusElem = document.getElementById('status-text');
        
    const TILE = 20;
    const PHRASE = "Vuoi essere il mio giocatore 2?";
        
    let snake, food, dx, dy, loop, currentIndex;
    let changingDirection = false;

    function startGame() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('final-ui').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        
        snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
        dx = 1; dy = 0;
        currentIndex = 0;
        statusElem.innerText = "RECUPERANDO MEMORIA...";
        
        spawnFood();
        if(loop) clearInterval(loop);
        loop = setInterval(update, 100);
        window.addEventListener('keydown', handleInput);
    }

    function spawnFood() {
        let char = PHRASE[currentIndex];
        let displayChar = char === " " ? "·" : char;
        nextCharElem.innerText = displayChar;

        let valid = false;
        while(!valid) {
            food = {
                x: Math.floor(Math.random() * (canvas.width/TILE)),
                y: Math.floor(Math.random() * (canvas.height/TILE)),
                char: displayChar
            };
            valid = !snake.some(s => s.x === food.x && s.y === food.y);
        }
    }

    function update() {
        changingDirection = false;
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};

        // Bordo infinito
        if (head.x < 0) head.x = (canvas.width/TILE) - 1;
        if (head.x >= canvas.width/TILE) head.x = 0;
        if (head.y < 0) head.y = (canvas.height/TILE) - 1;
        if (head.y >= canvas.height/TILE) head.y = 0;

        // Collisione corpo - Logica pulita
        for(let i = 0; i < snake.length; i++) {
            if(snake[i].x === head.x && snake[i].y === head.y) {
                return gameOver();
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            currentIndex++;
            if (currentIndex >= PHRASE.length) {
                return win();
            }
            spawnFood();
        } else {
            snake.pop();
        }
        draw();
    }

    function draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff00";
        snake.forEach((s, i) => {
            ctx.fillRect(s.x*TILE, s.y*TILE, TILE-2, TILE-2);
        });

        ctx.fillStyle = "#ff00ff";
        ctx.font = "16px 'Press Start 2P'";
        ctx.fillText(food.char, food.x*TILE + 2, food.y*TILE + 16);
    }

    function handleInput(e) {
        if(changingDirection) return;
        changingDirection = true;
        if(e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
        if(e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
        if(e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
        if(e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    }

    function gameOver() {
        clearInterval(loop);
        statusElem.innerText = "ERRORE FATALE";
        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('overlay').innerHTML = `<p>MEMORIA PERSA PER SEMPRE...CHI SEI TU?</p><button onclick="startGame()">RIPROVA</button>`;
    }

    function win() {
        clearInterval(loop);
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('score-display').style.display = 'none';
        document.getElementById('final-ui').style.display = 'flex';
    }

    function celebrate(type) {
        const emoji = type === 'si' ? '❤️' : ':(';
        const msg = type === 'si' ? "Per me tu sarai sempre la mia unica giocatore 2" : "ERRORE 404: Cuore non trovato...";
        
        document.getElementById('final-msg').innerText = msg;
        document.getElementById('btn-group').style.display = 'none';

        // Cascata
        setInterval(() => {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.innerText = emoji;
            p.style.left = Math.random() * 100 + "vw";
            p.style.top = "-50px";
            p.style.animationDuration = (Math.random() * 2 + 2) + "s";
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 4000);
        }, 100);
    }