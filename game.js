document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const menu = document.getElementById('menu');
    const levelSelectMenu = document.getElementById('levelSelectMenu');
    const settingsMenu = document.getElementById('settingsMenu');
    const gameSpeedInput = document.getElementById('gameSpeed');
    let gameRunning = false;

    let settings = {
        jumpStrength: -7,
        playerSpeed: 3,
        gameSpeed: 1
    };

    const levels = [
        {
            platforms: [{ x: 50, y: 550, width: 700, height: 20 }],
            goal: { x: 750, y: 500, width: 50, height: 50 }
        },
        {
            platforms: [{ x: 50, y: 500, width: 150, height: 20 }, { x: 300, y: 400, width: 150, height: 20 }, { x: 550, y: 300, width: 150, height: 20 }],
            goal: { x: 750, y: 250, width: 50, height: 50 }
        }
    ];

    let currentLevel = 0;
    let player = { x: 75, y: 50, width: 20, height: 20, velX: 0, velY: 0 };

    function showMenu() {
        gameRunning = false;
        canvas.style.display = 'none';
        menu.style.display = 'block';
        levelSelectMenu.style.display = 'none';
        settingsMenu.style.display = 'none';
    }

    function startLevel(levelIndex) {
        currentLevel = levelIndex;
        player = { ...player, x: 75, y: 50, velX: 0, velY: 0 };
        gameRunning = true;
        canvas.style.display = 'block';
        menu.style.display = 'none';
        requestAnimationFrame(gameLoop);
    }

    function gameLoop() {
        if (!gameRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateGame();
        requestAnimationFrame(gameLoop);
    }

    function updateGame() {
        player.velY += 0.3; 
        player.y += player.velY;
        player.x += player.velX;

        let onGround = false;
        levels[currentLevel].platforms.forEach(platform => {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            if (player.x < platform.x + platform.width && player.x + player.width > platform.x && 
                player.y < platform.y && player.y + player.height >= platform.y) {
                player.y = platform.y - player.height; 
                player.velY = 0;
                onGround = true;
            }
        });

        if (onGround) {
            player.jumping = false;
        } else {
            player.jumping = true;
        }

        const goal = levels[currentLevel].goal;
        ctx.fillStyle = 'gold';
        ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
        if (player.x < goal.x + goal.width && player.x + player.width > goal.x && 
            player.y < goal.y && player.y + player.height >= goal.y) {
            alert('Level Complete!');
            showMenu();
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    document.getElementById('levelSelectButton').addEventListener('click', () => {
        menu.style.display = 'none';
        levelSelectMenu.style.display = 'block';
    });

    document.getElementById('settingsButton').addEventListener('click', () => {
        menu.style.display = 'none';
        settingsMenu.style.display = 'block';
    });

    document.querySelectorAll('.levelButton').forEach(button => {
        button.addEventListener('click', function() {
            const levelIndex = parseInt(this.getAttribute('data-level'));
            startLevel(levelIndex);
        });
    });

    document.querySelectorAll('.backToMenu').forEach(button => {
        button.addEventListener('click', showMenu);
    });

    document.getElementById('saveSettings').addEventListener('click', () => {
        settings.jumpStrength = parseFloat(document.getElementById('jumpStrength').value);
        settings.playerSpeed = parseFloat(document.getElementById('playerSpeed').value);
        settings.gameSpeed = parseFloat(gameSpeedInput.value);
        showMenu();
    });

    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' && !player.velY) {
            player.velY = settings.jumpStrength; 
        }
        if (e.key === 'ArrowLeft') {
            player.velX = -settings.playerSpeed; 
        }
        if (e.key === 'ArrowRight') {
            player.velX = settings.playerSpeed; 
        }
    });

    window.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            player.velX = 0; 
        }
    });

    showMenu(); 
});
