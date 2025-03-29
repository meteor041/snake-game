// 获取画布和上下文
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gridSize = 20; // 网格大小
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;
let speed = 150; // 蛇移动的速度（毫秒）

// 游戏状态
let snake = []; // 蛇的身体部分
let direction = ''; // 当前移动方向
let nextDirection = ''; // 下一个移动方向
let food = {}; // 食物位置
let gameRunning = false;
let gameLoop = null;
let score = 0;

// DOM元素
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');

// 初始化游戏
function initGame() {
    // 初始化蛇
    snake = [
        { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }
    ];
    
    // 初始方向设为向右，这样游戏一开始蛇就会移动
    direction = 'right';
    nextDirection = '';
    
    // 生成食物
    generateFood();
    
    // 重置分数
    score = 0;
    scoreElement.textContent = score;
    
    // 更新按钮文本
    startButton.textContent = '重新开始';
    
    // 开始游戏循环
    if (gameLoop) clearInterval(gameLoop);
    gameRunning = true;
    gameLoop = setInterval(gameStep, speed);
}

// 生成食物
function generateFood() {
    // 确保食物不会出现在蛇身上
    let validPosition = false;
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        validPosition = true;
        // 检查是否与蛇身重叠
        for (let part of snake) {
            if (part.x === food.x && part.y === food.y) {
                validPosition = false;
                break;
            }
        }
    }
}

// 游戏步骤
function gameStep() {
    if (!gameRunning) return;
    
    // 更新方向
    if (nextDirection) {
        direction = nextDirection;
        nextDirection = '';
    }
    
    // 如果没有方向，不移动
    if (!direction) return;
    
    // 获取蛇头
    const head = { ...snake[0] };
    
    // 根据方向移动蛇头
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 检查碰撞
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // 将新头部添加到蛇身
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score += 10;
        scoreElement.textContent = score;
        
        // 生成新食物
        generateFood();
        
        // 每得100分增加速度
        if (score % 100 === 0) {
            speed = Math.max(50, speed - 10);
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, speed);
        }
    } else {
        // 如果没吃到食物，移除尾部
        snake.pop();
    }
    
    // 绘制游戏
    drawGame();
}

// 检查碰撞
function checkCollision(head) {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }
    
    // 检查自身碰撞
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    
    return false;
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // 绘制游戏结束信息
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '20px Arial';
    ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('按"开始游戏"重新开始', canvas.width / 2, canvas.height / 2 + 50);
}

// 绘制游戏
function drawGame() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < snake.length; i++) {
        // 蛇头颜色不同
        if (i === 0) {
            ctx.fillStyle = '#388E3C';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        
        ctx.fillRect(
            snake[i].x * gridSize,
            snake[i].y * gridSize,
            gridSize - 1,
            gridSize - 1
        );
    }
    
    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 1,
        gridSize - 1
    );
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// 开始/重新开始按钮
startButton.addEventListener('click', () => {
    initGame();
});

// 初始绘制
drawGame();