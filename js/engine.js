var Engine = (function (global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        lastTime;
    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);
    var level, scores, life, isPaused, isLevelUp, isGameOver, isGameStart;

    function main () {
        var now = Date.now(),
        dt = (now - lastTime) / 1000.0;
        update(dt);
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    }

    function init () {
        reset();
        lastTime = Date.now();
        main();
    }

    function update (dt) {
        updateEntities(dt);
        checkCollisions();
        updateLevel();
    }

    function updateEntities (dt) {
        if (!isPaused) {
            allEnemies.forEach(function (enemy) {
                enemy.update(dt);
            });
        }
    }

    checkCollisions = function () {
        if (!isPaused) {
            //CHECK IF PLAYER REACHED WATER
            if (player.y <= 72){
                player.reset();
                scores += 10;
                checkScores();
            }

            //CHECK FOR COLLISIONS ENEMY-PLAYER
            allEnemies.forEach(function (enemy) {
                var deltaEPX = Math.floor(Math.abs(enemy.x - player.x));
                var deltaEPY = Math.floor(Math.abs(enemy.y - player.y));
                if (deltaEPY < 50 && deltaEPX < 40) {
                    player.reset();
                    if(life > 0)
                        life--;
                    else{
                        isPaused = true;
                        isGameOver = true;
                    }
                }
                //CHECK FOR COLLISIONS ENEMY-GEMS & PLAYER-GEMS
                gems.forEach(function (gem) {
                    var deltaGPX = Math.floor(Math.abs(gem.x - player.x));
                    var deltaGPY = Math.floor(Math.abs(gem.y - player.y));
                    var deltaGEX = Math.floor(Math.abs(gem.x - enemy.x));
                    var deltaGEY = Math.floor(Math.abs(gem.y - enemy.y));

                    if (deltaGPY < 30 && deltaGPX < 40) {
                        gem.destroy();
                        scores += gem.val;
                        checkScores();
                    }

                    if (deltaGEY < 50 && deltaGEX < 80) {
                        gem.destroy();
                    }
                });
            });
        }
    }

    //UPDATES ENTITIES WHEN LEVEL IS UP
    function levelUp () {
        var c = level+1;
        allEnemies.forEach(function(enemy) {
           enemy.updateSpeed(c);
        });
        isPaused = true;
        player.reset();
        star.x = player.x;
        star.y = player.y;
    };

    //UPDATES STAR ANIMATION WHEN LEVEL IS UP
    function updateLevel () {
            if (isLevelUp) {
                if (star.x < 501 && star.y > 30) {
                    star.y = (star.y - 4.5);
                    star.x = (star.x + 1.5);
                } else {
                    level++;
                    isPaused = false;
                    isLevelUp = false;
                    star.x = undefined;
                    star.y = undefined;
                }
            }
    }

    function checkScores () {
        //CHECK LEVELUP RULES
        if (scores > 60 && level === 1) {
            isLevelUp = true;
            isPaused = true;
            levelUp();
        }

        if (scores > 100 && level === 2) {
            isLevelUp = true;
            isPaused = true;
            levelUp();
        }

        if (scores > 150 && level === 3) {
            isLevelUp = true;
            isPaused = true;
            levelUp();
        }

        if (scores > 200 && level === 4) {
            isLevelUp = true;
            isPaused = true;
            levelUp();
        }

        if (scores > 250 && level === 5) {
            isLevelUp = true;
            isPaused = true;
            levelUp();
        }
        //ADD GEMS TO GAME
        if (scores % 10 === 0) {
            gems[0].update(303, 145);
        }

        if (scores % 65 === 0) {
            gems[1].update(202, 55);
        }

        if (scores % 105 === 0) {
            gems[2].update(202, 230);
        }
    };

    //RENDER STAGE
    function render () {
        var rowImages = [
                "images/water-block.png",   // Top row is water
                "images/stone-block.png",   // Row 1 of 3 of stone
                "images/stone-block.png",   // Row 2 of 3 of stone
                "images/stone-block.png",   // Row 3 of 3 of stone
                "images/grass-block.png",   // Row 1 of 2 of grass
                "images/grass-block.png"    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();

        //RENDER LEVEL INFO
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "24px impact";
        ctx.fillText("Level: " + level, 420, 110);
        ctx.strokeText("Level: " + level, 420, 110);

        //RENDER SCORES INFO
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "24px impact";
        ctx.fillText("Scores: " + scores, 430, 80);
        ctx.strokeText("Scores: " + scores, 430, 80);

        //RENDER LIFE INFO
        ctx.strokeStyle = "black";
        ctx.fillStyle = "red";
        ctx.textAlign = "left";
        ctx.font = "36px impact";
        var heart = "💜";
        if (life === 3)
            ctx.fillText(heart + " " + heart + " " + heart, 20, 100);
        if (life === 2)
            ctx.fillText(heart + " " + heart, 20, 100);
        if(life === 1)
            ctx.fillText(heart + " ", 20, 100);

        //RENDER GAME STATE INFO
        if (isPaused){
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "100px impact";
            if (canvas.width > 0 && canvas.height > 0 && !isLevelUp && !isGameStart && !isGameOver) {
                ctx.fillText("PAUSE", canvas.width/2+10, canvas.height/2+40);
                ctx.strokeText("PAUSE", canvas.width/2+10, canvas.height/2+40);
                ctx.font = "32px impact";
                ctx.fillText("Press'SPACE' to resume game", canvas.width/2, canvas.height/2+90);
                ctx.strokeText("Press'SPACE' to resume game", canvas.width/2, canvas.height/2+90);
            } else if (canvas.width > 0 && canvas.height > 0 && !isLevelUp && isGameStart && !isGameOver) {
                ctx.fillText("START GAME", canvas.width/2, canvas.height/2+40);
                ctx.strokeText("START GAME", canvas.width/2, canvas.height/2+40);
                ctx.font = "32px impact";
                ctx.fillText("Press'SPACE' to start game", canvas.width/2, canvas.height/2+90);
                ctx.strokeText("Press'SPACE' to start game", canvas.width/2, canvas.height/2+90);
            } else if( canvas.width > 0 && canvas.height > 0 && isLevelUp && !isGameStart && !isGameOver) {
                ctx.fillText("LEVEL UP!", canvas.width/2, canvas.height/2+40);
                ctx.strokeText("LEVEL UP!", canvas.width/2, canvas.height/2+40);
            } else if (canvas.width > 0 && canvas.height > 0 && !isLevelUp && !isGameStart && isGameOver) {
                ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2+40);
                ctx.strokeText("GAME OVER", canvas.width/2, canvas.height/2+40);
                ctx.font = "32px impact";
                ctx.fillText("Press'SPACE' to restart", canvas.width/2, canvas.height/2+90);
                ctx.strokeText("Press'SPACE' to restart", canvas.width/2, canvas.height/2+90);
            }
        }
    }

    //RENDER ENTITIES
    function renderEntities () {
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        gems.forEach(function (gem) {
            gem.render();
        });

        player.render();
        star.render();
    };

    //KEY PRESSED EVENT LISTENER
    document.addEventListener("keyup", function (e) {
        var allowedKeys = {
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            32: "space"
        };

        handleInput(allowedKeys[e.keyCode]);
        if (!isPaused)
            player.handleInput(allowedKeys[e.keyCode]);
    });

    //HANDLE KEYBOARD EVENTS RELATED TO GAME STATUS
    handleInput = function (key) {
        if (key === "space") {
            isPaused = !isPaused;
            if (isLevelUp)
                isLevelUp = false;
            if (isGameStart)
                isGameStart = false;
            if (isGameOver)
                location.reload();
        }
    };

    //RESET VARIABLES TO DEFAULT STATE
    function reset () {
        isPaused = true;
        isLevelUp = false;
        isGameOver = false;
        isGameStart = true;
        scores = 0;
        life = 3;
        level = 1;
    }

    Resources.load([
        "images/stone-block.png",
        "images/water-block.png",
        "images/grass-block.png",
        "images/enemy-bug.png",
        "images/Gem Blue.png",
        "images/Gem Orange.png",
        "images/Gem Green.png",
        "images/char-horn-girl.png",
        "images/Star.png"
    ]);

    Resources.onReady(init);
    global.ctx = ctx;
})(this);
