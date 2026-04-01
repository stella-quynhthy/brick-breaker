/* STEP 1: Get elements from the page */
/* Get the canvas element by id */
/* Get the 2D drawing context from the canvas using .getContext('2d') */
/* Get the score, lives, and level display elements by id */
/* Get the message paragraph by id */
/* Get the restart button by id */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const levelDispay = document.getElementById("level");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");



/* STEP 2: CLASS — Ball */
// 
/* Create a class called Ball */
/* Constructor should set: */
/*   - this.radius (e.g. 8) */
/*   - Call this.reset() to set starting position and speed */
class ball {
    constructor() {
        this.radius = 8;
        this.reset();
    };
    reset() {
        this.x = canvas.width/2
        this.y = canvas.height-60
        this.dx = 3;
        this.dy = -3;
        this.launched = false;
    };
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.shadowColor = "#ccf5fc";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
    };
    update(paddle) {
        if (!this.launched) {
            this.x = paddle.x+paddle.width/2;
        };
        this.x+=this.dx;
        this.y+=this.dy;
        /*left wall*/
        if (this.x+this.radius < 0) {
            this.x = this.radius;
            this.dx*=-1;
        };
        /*right wall*/
        if (this.x+this.radius > canvas.width) {
            this.x = canvas.width-this.radius;
            this.dx*=-1;
        };
        /*top wall*/
        if (this.y-this.radius < 0){
            this.y = this.radius;
            this.dy*=-1;
        };
    };
    launch(){
        if (!this.launch) {
            this.launch = true;
            this.dy = -Math.abs(this.y);
        };
    };
};

/* reset() method: */
/*   - Set this.x to the center of the canvas */
/*   - Set this.y near the bottom of the canvas */
/*   - Set this.dx (horizontal speed, e.g. 3) */
/*   - Set this.dy (vertical speed, e.g. -3) */
/*   - Set this.launched = false */

/* draw() method: */
/*   - Use ctx.beginPath() */
/*   - Use ctx.arc() to draw a circle at this.x, this.y with this.radius */
/*   - Set a fill color */
/*   - Optional: add ctx.shadowBlur and ctx.shadowColor for glow */
/*   - Call ctx.fill() and ctx.closePath() */

/* update(paddle) method: */
/*   - If not launched, keep ball centered on paddle and return early */
/*   - Move ball: this.x += this.dx, this.y += this.dy */
/*   - If ball hits left wall: reverse dx, push ball back inside */
/*   - If ball hits right wall: reverse dx, push ball back inside */
/*   - If ball hits top wall: reverse dy, push ball back inside */

/* launch() method: */
/*   - If not already launched, set this.launched = true */
/*   - Make sure dy is negative (ball goes upward) */



/* STEP 3: CLASS — Paddle */

/* Create a class called Paddle */
/* Constructor should set: */
/*   - this.width (e.g. 90) and this.height (e.g. 12) */
/*   - this.x centered horizontally on the canvas */
/*   - this.y near the bottom of the canvas (e.g. canvas.height - 24) */
/*   - this.speed (e.g. 7) */
/*   - this.leftPressed and this.rightPressed (both false) */

/* draw() method: */
/*   - Use ctx.beginPath() */
/*   - Use ctx.roundRect() or ctx.rect() to draw the paddle */
/*   - Set a fill color */
/*   - Call ctx.fill() and ctx.closePath() */

/* update() method: */
/*   - If rightPressed and paddle won't go off canvas: this.x += this.speed */
/*   - If leftPressed and paddle won't go off canvas: this.x -= this.speed */

/* reset() method: */
/*   - Re-center the paddle horizontally */

class paddle {
    constructor() {
        this.width = 90;
        this.height = 12;
        this.x = (canvas.width-this.width)/2;
        this.y = canvas.height-24;
        this.speed = 7;
        this.leftPressed = false;
        this.rightPressed = false;
    };
    draw() {
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 10);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    };
    update() {
        if (this.rightPressed && this.x+this.width < canvas.width) {
            this.x += this.speed;
        };
        if (this.leftPressed && this.x > 0) {
            this.x -= this.speed;
        };
    }
    reset() {
        this.x = (canvas.width-this.width)/2;
    }
}



/* STEP 4: CLASS — Brick */

/* Create a class called Brick */
/* Constructor takes: x, y, color, points */
/* Set: */
/*   - this.x, this.y */
/*   - this.width (e.g. 64) and this.height (e.g. 18) */
/*   - this.color */
/*   - this.points */
/*   - this.alive = true */

/* draw() method: */
/*   - Only draw if this.alive is true */
/*   - Draw a filled rectangle at this.x, this.y with this.width, this.height */
/*   - Use this.color as the fill */
/*   - Optional: draw a highlight line near the top of the brick */

class brick {
    constructor(x, y, color, points) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 18;
        this.color = color;
        this.points = points;
        this.alive = true;
    };
    draw() {
        if (!this.alive) {
            return;
        }
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 10);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
};


/* STEP 5: CLASS — BrickGrid */

/* Create a class called BrickGrid */
/* Constructor takes: level (number) */
/* Set: */
/*   - this.bricks = [] */
/*   - this.cols (e.g. 6) */
/*   - this.rows = 4 + level (more rows as level increases) */
/*   - this.padding (gap between bricks, e.g. 8) */
/*   - this.offsetTop and this.offsetLeft (margins from canvas edge) */
/*   - An array of colors for each row */
/*   - An array of point values for each row */
/*   - Call this.build() */

/* build() method: */
/*   - Loop through rows and columns */
/*   - For each brick, calculate its x and y position */
/*     x = offsetLeft + col * (brickWidth + padding) */
/*     y = offsetTop + row * (brickHeight + padding) */
/*   - Pick a color and point value based on the row index */
/*   - Create a new Brick and push it to this.bricks */

/* draw() method: */
/*   - Loop through this.bricks and call draw() on each */

/* allCleared() method: */
/*   - Return true if every brick has alive === false */
/*   - Hint: use .every() */

class brickGrid {
    constructor(number) {
        this.bricks = [];
        this.cols = 6;
        this.rows = 4 + level;
        this.padding = 8;
        this.offsetTop = 40;
        this.offsetLeft = 20;
        this.color = ["red", "blue", "green", "yellow", "purple", "orange"];
        this.points = [120, 100, 80, 60, 40, 20];
        this.build();
    };
    build() {
        const brickWidth = 64;
        const brickHeight = 18;
        for (let r = 0; r < this.rows; r++) {
            for (let c=0; c < this.cols; c++) {
                const x = offsetLeft + c * (brickWidth + padding);
                const y = offsetTop + r * (brickHeight + padding);
                const colorIndex = r%this.color.length;
                this.bricks.push(new brick(x, y, this.color[colorIndex], this.points[colorIndex]));
            };
        };
    };
    draw() {
        this.bricks.forEach(b => b.draw());
    };
    allCleared() {
        return this.bricks.every(b => !b.alive);
    };
};


/* STEP 6: COLLISION DETECTION — Ball vs Paddle */

/* Create a function: checkBallPaddleCollision(ball, paddle) */
/* Check if ball overlaps with the paddle rectangle: */
/*   - ball.y + ball.radius >= paddle.y */
/*   - ball.y - ball.radius <= paddle.y + paddle.height */
/*   - ball.x >= paddle.x */
/*   - ball.x <= paddle.x + paddle.width */
/* If all conditions are true: */
/*   - Calculate where on the paddle the ball hit (0 = left edge, 1 = right edge) */
/*     hitPos = (ball.x - paddle.x) / paddle.width */
/*   - Use hitPos to angle the ball's dx */
/*   - Make sure dy is negative (ball bounces up) */
/*   - Push ball above the paddle so it doesn't get stuck */
function checkBallPaddleCollision(ball, paddle) {
    if (ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height && ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
        const hitPos = (ball.x - paddle.x)/paddle.width;
        const angle = (hitPos - 0.5)*2;
        const speed = Math.sqrt(ball.dx*ball.dx+ball.dy*ball.dy)
        ball.dx = speed*angle*1.2;
        ball.dy-Math.abs(ball.dy);
        ball.y = paddle.y - ball.radius;
    };
};


/* STEP 7: COLLISION DETECTION — Ball vs Bricks */
/* Create a function: checkBallBrickCollisions(ball, brickGrid) */
/* Loop through brickGrid.bricks */
/* Skip bricks where alive is false */
/* For each alive brick, use circle-rectangle collision: */
/*   - Find the closest point on the brick to the ball center: */
/*       closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width)) */
/*       closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height)) */
/*   - Calculate distance from ball center to that closest point */
/*   - If distance < ball.radius: collision! */
/*       - Set brick.alive = false */
/*       - Add brick.points to a local pointsEarned variable */
/*       - Determine bounce direction: */
/*           if Math.abs(distX) > Math.abs(distY): reverse ball.dx */
/*           else: reverse ball.dy */
/*       - Break out of the loop (only one brick per frame) */
/* Return pointsEarned */
function checkBallBrickCollisions(ball, brickGrid) {
    for (const brick of brickGrid.bricks) {
        if (brick.alive === false) {
            continue;
        };
        const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
        const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
        const distX = ball.x - closestX;
        const distY = ball.y - closestY;
        const distance = Math.sqrt(distX*distX+distY*distY);
        if (distance < ball.radius) {
            brick.alive = false;
            pointsEarned+=brick.points;
            if (Math.abs(distX) > Math.abs(distY)) {
                ball.dx*-1;
            } else {
                ball.dy*-1;
            };
            break;
        };
    };
    return pointsEarned;
};


/* STEP 8: CLASS — Game */

/* Create a class called Game */

/* Constructor: */
/*   - Create this.ball = new Ball() */
/*   - Create this.paddle = new Paddle() */
/*   - Set this.score = 0, this.lives = 3, this.level = 1 */
/*   - Create this.brickGrid = new BrickGrid(this.level) */
/*   - Set this.running = false */
/*   - Set this.animFrameId = null */
/*   - Call this.setupInput() */
/*   - Call this.setupRestart() */
class game {
    constructor() {
        this.ball = new ball();
        this.paddle = new paddle();
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.brickGrid = new brickGrid(this.level);
        this.running = false;
        this.animFrameId = null;
        this.setupInput();
        this.setupRestart();
    };

    setupInput() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                this.paddle.rightPressed = true;
            }
            if (e.key === "ArrowLeft") {
                this.paddle.leftPressed = true;
            }
            if (e.key === " " || e.key === "ArrowUp") {
                e.preventDefault();
                this.ball.launch;
            };
        });
         document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                this.paddle.rightPressed = false;
            };
            if (e.key === "ArrowLeft") {
                this.paddle.leftPressed = false;
            };
         });
         canvas.addEventListener("click", () => {
            this.ball.launch;
         });
         canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX-rect.left;
            this.paddle.x = mouseX-this.paddle.width;
            this.paddle.x = Math.max(0, Math.min(canvas.width-this.paddle.width, this.paddle.x));
         });
    };

    setupRestart() {
        restartBtn.addEventListener("click", () => {
            this.restart(
            );
        });
    };

    restart() {
        cancelAnimationFrame(this.animFrameId);
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.brickGrid = new brickGrid(this.level);
        this.paddle.reset;
        this.ball.reset;
        this.running = true;
        message.textContent = "Press SPACE or click to start";
        this.updateUI();
        this.loop();
    };
/*skipping nextLevel()*/

    loseLife() {
        this.lives--;
        this.updateUI();
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.paddle.reset;
            this.ball.reset;
        };
    };

    gameOver() {
        this.running = false;
        message.textContent = `GAME OVER! Score: ${this.score}`;
    };

    updateUI() {
        scoreDisplay.textContent = this.score;
        livesDisplay.textContent = this.lives;
        levelDispay.textContent = this.level;
    }

}
/* setupInput() method: */
/*   - Listen for 'keydown' events */
/*       - ArrowRight: set paddle.rightPressed = true */
/*       - ArrowLeft: set paddle.leftPressed = true */
/*       - Space or ArrowUp: call ball.launch(), prevent default scroll */
/*   - Listen for 'keyup' events */
/*       - Reset rightPressed and leftPressed to false */
/*   - Listen for 'click' on the canvas: call ball.launch() */
/*   - Listen for 'mousemove' on canvas: */
/*       - Get mouse x relative to canvas using getBoundingClientRect() */
/*       - Set paddle.x to mouseX - paddle.width / 2 */
/*       - Clamp paddle.x so it stays within canvas bounds */

/* setupRestart() method: */
/*   - Add a click event listener to restartBtn */
/*   - Call this.restart() when clicked */

/* restart() method: */
/*   - Cancel any running animation frame */
/*   - Reset score, lives, level to starting values */
/*   - Create a new BrickGrid */
/*   - Reset paddle and ball */
/*   - Set running = true */
/*   - Update the message */
/*   - Call updateUI() */
/*   - Call this.loop() */

/* nextLevel() method: */
/*   - Increment this.level */
/*   - Create a new BrickGrid with the new level */
/*   - Reset paddle and ball */
/*   - Slightly increase ball speed based on level */
/*   - Update message and call updateUI() */

/* loseLife() method: */
/*   - Decrement this.lives */
/*   - Call updateUI() */
/*   - If lives <= 0: call this.gameOver() */
/*   - Otherwise: reset paddle and ball, update message */

/* gameOver() method: */
/*   - Set this.running = false */
/*   - Show game over message with final score */

/* updateUI() method: */
/*   - Update scoreEl, livesEl, levelEl text content */

/* loop() method — the GAME LOOP: */
/*   - If not running, return early */
/*   - Clear the canvas: ctx.clearRect(0, 0, canvas.width, canvas.height) */
/*   - Call paddle.update() */
/*   - Call ball.update(paddle) */
/*   - Call checkBallPaddleCollision(ball, paddle) */
/*   - Call checkBallBrickCollisions(ball, brickGrid) and store returned points */
/*   - If points > 0: add to score, call updateUI(), flash message briefly */
/*   - If ball.y - ball.radius > canvas.height: call loseLife() */
/*   - If brickGrid.allCleared(): add bonus points, call nextLevel() */
/*   - Call brickGrid.draw() */
/*   - Call paddle.draw() */
/*   - Call ball.draw() */
/*   - Use requestAnimationFrame to call this.loop() again */

/* start() method: */
/*   - Set this.running = true */
/*   - Set initial message */
/*   - Call updateUI() */
/*   - Call this.loop() */



/* STEP 9: INITIALIZE */

/* Create a new instance of Game */
/* Call .start() on it */