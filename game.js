    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx = 3;
    var dy = -3;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    var rightPressed = false;
    var leftPressed = false;
    // space pressed - change 2
    var spacePressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;
    // level - change 3
    var level = 0;
    var highScore = 0;
    var totalScore = 0;
    

    var bricks = [];

    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            // add color field to each brick - change 1
            bricks[c][r] = { x: 0, y: 0, status: 1, color: generateBrickColor() };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    // function to generate random brick color -- change 1
    function generateBrickColor() {
        colorSet = ["#EEEE18", "#F12E0B ", "##EE8E1A", "#31F10B", "##12EEF9", "#F912F9", "##F9122E", "##F9C112", "#F97B12", "#12F9EB"]
        pickedIndex = Math.floor(Math.random() * 10);
        return colorSet[pickedIndex];
    }

    function keyDownHandler(e) {
        if(e.code  == "ArrowRight") {
            rightPressed = true;
        }
        else if(e.code == 'ArrowLeft') {
            leftPressed = true;
        }
        // add space pressed for pause or start - change 2
        else if(e.code == 'Space' && spacePressed == false){
            spacePressed = true;
        }
        else if(e.code == 'Space' && spacePressed == true){
            spacePressed = false;
        }
    }

    function keyUpHandler(e) {
        if(e.code == 'ArrowRight') {
            rightPressed = false;
        }
        else if(e.code == 'ArrowLeft') {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
    }

    function collisionDetection() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        totalScore++;
                        highScore = Math.max(score, highScore);
                        
                        
                        // when scores add by 15, level add by one - change 3
                        if(score % (brickRowCount*brickColumnCount) == 0) {
                            level++;
                            alert("LEVELED UP, CONGRATS!");
                            // increase speed, decrease paddle width - change 5 & 6
                            dx = 1.2*dx;
                            dy = 1.2*dy;
                            if (paddleWidth >= 2 * ballRadius + 5) {
                                paddleWidth = paddleWidth - 5;
                            }
                        }
                        // when you finish hitting all the bricks, re-draw all the bricks.
                        if(totalScore % (brickRowCount*brickColumnCount) == 0) {
                            for(var c=0; c<brickColumnCount; c++) {
                                for(var r=0; r<brickRowCount; r++) {
                                    bricks[c][r].status = 1;
                                }
                            }
                            drawBricks();
                        }

                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    // draw bricks in different color - change 1
                    ctx.fillStyle = bricks[c][r].color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: "+lives, canvas.width-65, 20);
    }

    // draw level - change 3
    function drawLevel() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Level: "+level, 135, 20);
    }

    // draw high score - change 4
    function drawHighScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#ED1A0C";
        ctx.fillText("High Score: "+highScore, 250, 20);
    }

    function draw() {
        // detecting spacebar press to pause and continue game - change 2
        if (spacePressed == false){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawScore();
            drawLives();
            drawLevel();
            drawHighScore();
            collisionDetection();

            if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if(y + dy < ballRadius) {
                dy = -dy;
            }
            else if(y + dy > canvas.height-ballRadius) {
                if(x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                }
                else {
                    lives--;
                    if(!lives) {
                        alert("GAME OVER");
                        document.location.reload();
                    }
                    else {
                        // if you lose a life, level, score will be reset to 0; and paddleWidth will be reset to 75.
                        level = 0;
                        score = 0;
                        x = canvas.width/2;
                        y = canvas.height-30;
                        dx = 3;
                        dy = -3;
                        paddleWidth = 75;
                        paddleX = (canvas.width-paddleWidth)/2;
                    }
                }
            }
        
            if(rightPressed && paddleX < canvas.width-paddleWidth) {
                paddleX += 7;
            }
            else if(leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            x += dx;
            y += dy;
            
        }
        requestAnimationFrame(draw);
    }
    
    draw();


