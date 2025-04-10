document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const gameCanvasWrapper = document.querySelector(".game__canvas-container");

    gameCanvasWrapper.style.setProperty('--game-bg', 'url(../../public/images/game_play.jpg)');

    // Состояние игры
    let gameStarted = false;
    let gameOver = false;
    let fading = false;
    let alpha = 0;

    // Переменные динозавра и анимации
    let dinoX = 50;
    let direction = 1;
    let currentFrame = 0;
    let stepCounter = 0;
    let isFiring = false;

    // Снаряды и метеоры
    let meteors = [];
    let fireballs = [];
    let missed = 0;

    // Размеры кадров динозавра
    const dinoSizes = {
        "../public/images/dino-step-one.png": { width: 300, height: 270 },
        "../public/images/dino-step-second.png": { width: 300, height: 270 },
        "../public/images/dino-step-one-fire.png": { width: 300, height: 320 },
        "../public/images/dino-step-second-fire.png": { width: 300, height: 320 },
    };

    // Изображения
    const dinoFrames = ["../public/images/dino-step-one.png", "../public/images/dino-step-second.png"];
    const dinoFireFrames = ["../public/images/dino-step-one-fire.png", "../public/images/dino-step-second-fire.png"];
    const dinoImages = {};
    [...dinoFrames, ...dinoFireFrames].forEach(src => {
        const img = new Image();
        img.src = src;
        dinoImages[src] = img;
    });

    const meteor = new Image();
    meteor.src = "../public/images/meteor.png";

    const fireball = new Image();
    fireball.src = "../public/images/fireball.png";

    const gameOverImage = new Image();
    gameOverImage.src = "../public/images/game_over.jpg";

    // Подгоняем canvas под размер контейнера
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Основной цикл игры
    function updateGame() {
        if (gameOver && !fading) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            updateDino();
            updateMeteors();
            drawMeteors();
            updateFireballs();
            drawFireballs();
        }

        if (fading) {
            ctx.fillStyle = `rgba(173, 0, 0, ${alpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            alpha += 0.011;
            if (alpha >= 1) {
                fading = false;
                showGameOverBanner();
                return;
            }
        }

        requestAnimationFrame(updateGame);
    }

    // Анимация и движение динозавра
    function updateDino() {
        const frame = isFiring ? dinoFireFrames[currentFrame] : dinoFrames[currentFrame];
        const base = dinoSizes[frame];
        const baseWidth = base.width;
        const baseHeight = base.height;
    
        // Масштаб только если ширина меньше 1600
        let scale = canvas.width < 1000 ? canvas.width / 1000 : 1;
    
        const width = baseWidth * scale;
        const height = baseHeight * scale;
        const halfWidth = width / 2;
    
        // Движение: шаг остаётся фиксированным
        dinoX += direction * (8 * scale);
    
        if (dinoX - halfWidth <= 0) {
            dinoX = halfWidth;
            direction = 1;
        } else if (dinoX + halfWidth >= canvas.width) {
            dinoX = canvas.width - halfWidth;
            direction = -1;
        }
    
        stepCounter++;
        if (stepCounter >= 10) {
            stepCounter = 0;
            currentFrame = (currentFrame + 1) % dinoFrames.length;
        }
    
        ctx.save();
        if (direction === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(dinoImages[frame], -dinoX - halfWidth, canvas.height - height - 20, width, height);
        } else {
            ctx.drawImage(dinoImages[frame], dinoX - halfWidth, canvas.height - height - 20, width, height);
        }
        ctx.restore();
    }

    // Обновление положения метеоров
    function updateMeteors() {
        meteors = meteors.filter(m => {
            m.x += m.vx;
            m.y += m.vy;
            if (m.y > canvas.height) {
                missed++;
                if (missed >= 5) triggerGameOver();
                return false;
            }
            return true;
        });
    }

    // Отрисовка метеоров
    function drawMeteors() {
        meteors.forEach(m => {
            ctx.save();
            if (m.flip) {
                ctx.scale(-1, 1);
                ctx.drawImage(meteor, -m.x - m.size, m.y, m.size, m.size);
            } else {
                ctx.drawImage(meteor, m.x, m.y, m.size, m.size);
            }
            ctx.restore();
        });
    }

    // Обновление и проверка столкновений огненных шаров
    function updateFireballs() {
        fireballs = fireballs.filter(f => {
            f.x += f.vx;
            f.y += f.vy;
            if (f.y < 0 || f.x < 0 || f.x > canvas.width) return false;

            meteors = meteors.filter(m => {
                const dx = (f.x + f.size / 2) - (m.x + m.size / 2);
                const dy = (f.y + f.size / 2) - (m.y + m.size / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance >= (f.size + m.size) / 2;
            });

            return true;
        });
    }

    // Отрисовка огненных шаров
    function drawFireballs() {
        fireballs.forEach(f => {
            ctx.save();
            if (f.flip) {
                ctx.scale(-1, 1);
                ctx.drawImage(fireball, -f.x - f.size, f.y, f.size, f.size);
            } else {
                ctx.drawImage(fireball, f.x, f.y, f.size, f.size);
            }
            ctx.restore();
        });
    }

    // Завершение игры
    function triggerGameOver() {
        gameOver = true;
        fading = true;
        alpha = 0;
        updateGame();
    }

    // Показ баннера окончания игры
    function showGameOverBanner() {
        gameCanvasWrapper.style.setProperty('--game-bg', 'url(../../public/images/game_over.jpg)');
        canvas.style.display = 'none';
        const button = document.getElementById("shootButton");
        button.textContent = "Играть";
        button.onclick = restartGame;
    }

    // Перезапуск игры
    function restartGame() {
        missed = 0;
        meteors = [];
        fireballs = [];
        dinoX = 50;
        direction = 1;
        gameOver = false;
        fading = false;
        alpha = 0;

        gameCanvasWrapper.style.setProperty('--game-bg', 'url(../../public/images/background_game_cover.jpg)');
        canvas.style.display = 'block';

        const button = document.getElementById("shootButton");
        button.textContent = "ОГОНЬ";
        button.onclick = null;

        updateGame();
    }

    // Генерация метеоров
    setInterval(() => {
        if (!gameStarted || gameOver) return;
    
        const scale = canvas.width < 1000 ? canvas.width / 1000 : 1;
        const speed = 3 * scale;
        const baseSize = 200;
        const size = baseSize * scale;
    
        const startX = Math.random() * (canvas.width - size);
    
        meteors.push({
            x: startX,
            y: 0,
            vx: direction === 1 ? -speed : speed,
            vy: speed,
            size,
            flip: direction !== 1
        });
    }, 1000);

    // Обработка выстрела

    const shootButton = document.getElementById("shootButton");

    // Отключение зума по двойному тапу на кнопке
    let lastTouchTime = 0;
    shootButton.addEventListener("touchstart", (e) => {
        const now = Date.now();
        if (now - lastTouchTime < 300) {
            e.preventDefault(); // отменяем масштабирование
        }
        lastTouchTime = now;
    });
    
    // Универсальный выстрел по pointer-событию (и мышь, и палец)
    shootButton.addEventListener("pointerdown", () => {
        if (gameOver) return;
        isFiring = true;
    
        const scale = canvas.width < 1000 ? canvas.width / 1000 : 1;
        const baseSize = 100;
        const size = baseSize * scale;
    
        fireballs.push({
            x: dinoX + (direction === 1 ? size : -size),
            y: canvas.height - (size * 4),
            vx: direction === 1 ? 15 * scale : -15 * scale,
            vy: -5 * scale,
            size,
            flip: direction !== 1
        });
    
    });
    
    shootButton.addEventListener("pointerup", () => {
        isFiring = false;
        shootButton.blur();
    });

    // Начало игры
    function setStartGame() {
        shootButton.textContent = "ИГРАТЬ";
        shootButton.onclick = () => {
            shootButton.textContent = "ОГОНЬ";
            shootButton.onclick = null;
            gameStarted = true;
            gameCanvasWrapper.style.setProperty('--game-bg', 'url(../../public/images/background_game_cover.jpg)');
            canvas.style.display = 'block';
            updateGame();
        };
    }

    setStartGame();
});