(() => {
  // set up some constants here
  const theCanvas = document.querySelector('canvas'),
        ctx = theCanvas.getContext('2d'),
        player = { x : 275, y : 550, width : 50, height : 50, lives : 3, speed : 7 },
        mouseTracker = { x : theCanvas.width / 2 },
        //bullets = [],

        enemy1 = document.querySelector('.enemyOne'),
        enemy2 = document.querySelector('.enemyTwo'),
        enemy3 = document.querySelector('.enemyThree'),

        playerLives = [1, 2, 3],

        // boxes = [
        //   { x : 30, y : 30, x1 : 30, y1 : 30, image : enemy1, xspeed : 3, yspeed : 6, points : 10 },
        //   { x : 90, y : 90, x1 : 40, y1 : 40, image : enemy2, xspeed : 8, yspeed : 4, points : 5 },
        //   { x : 150, y : 150, x1 : 30, y1 : 30, image : enemy3, xspeed : 7, yspeed : 7, points : 10 }
        // ],

        playerImg = document.querySelector('.ship'),
        pauseButton = document.querySelector('.pause'),
        playButton = document.querySelector('.play'),
        resetButton = document.querySelector('.reset'),
        resetScreen = document.querySelector('.level-up');

    var playState = true,
        score = 0,
        boxes = [
          { x : randomX(), y : 30, x1 : 30, y1 : 30, image : enemy1, xspeed : 3, yspeed : 6, points : 10 },
          { x : randomX(), y : 90, x1 : 40, y1 : 40, image : enemy2, xspeed : 8, yspeed : 4, points : 5 },
          { x : randomX(), y : 150, x1 : 30, y1 : 30, image : enemy3, xspeed : 7, yspeed : 7, points : 10 }
        ],
        bullets = [],
        mousePos = theCanvas.width / 2;

  function draw() {
    ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);

    // draw in the current score
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Score: ${score}`, 500, 20);

    // draw player lives in the top left corner
    playerLives.forEach((player, index) => {
      ctx.drawImage(playerImg, 10 + (index * 26), 10, 20, 20);
    });

    // draw the mouse tracker
    ctx.beginPath();
    ctx.moveTo(mouseTracker.x, theCanvas.height - 10);
    ctx.lineTo(mouseTracker.x - 5, theCanvas.height);
    ctx.lineTo(mouseTracker.x + 5, theCanvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();

    // draw the main player ship
    dx = mousePos - player.x;
    player.x += (dx / 10);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // animate all the bullets
    bullets.forEach((bullet, index) => {
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.fillRect(bullet.x, bullet.y, bullet.x2, bullet.y2);

      bullet.y -= bullet.speed;

      bulletIndex = index;

      // check for the bullets hitting any of the boxes
      boxes.forEach((box, index) => {
        if (bullet.y <= (box.y + box.y1) && bullet.y > box.y && bullet.x > box.x && bullet.x < (box.x + box.x1)) {
          // delete square
          //delete boxes[index];
          //delete bullets[bulletIndex];
          //
          bullets.splice(bulletIndex, 1);
          boxes.splice(index, 1);

          score += box.points;

          console.log(`score is now: ${score}`);

          // create and play an explosion sound here
          let boomsound = document.createElement('audio');
          boomsound.src = "audio/explosion.mp3";

          document.body.appendChild(boomsound);

          boomsound.addEventListener('ended', () => {
            document.body.removeChild(boomsound);
          });

          boomsound.play();

          if (boxes.length == 0 ) {
            // we cleared the screen! reset and make it harder
            console.log('level up!');
            // call the level up function
            levelUp();
          }
        }
      });

      if (bullet.y < 0) {
        bullets.splice(index, 1);
      }
    });

    // draw the boxes
    boxes.forEach(box => {
      ctx.fillStyle = box.color;
      ctx.drawImage(box.image, box.x, box.y, box.x1, box.y1);

      if (box.x + box.x1 > theCanvas.width) {
        box.xspeed *= -1;
      } else if (box.x < 0) {
        box.xspeed *= -1;
      }

      if (box.y + box.y1 > theCanvas.height - 100) {
        box.yspeed *= -1;
      } else if (box.y < 0) {
        box.yspeed *= -1;
      }

      box.x += box.xspeed;
      box.y += box.yspeed;
    });

    if (playState == false) { return }

    window.requestAnimationFrame(draw);
  }

  // function movePlayer(e) {
  //   switch(e.keyCode) {
  //     // if we pushed the left arrow on the keyboard, move the ship left
  //     case 37 :
  //     if (player.x > 0) {
  //       player.x -= player.speed;
  //     }
  //     break;
  //
  //     // move the ship to the right, just to the edge of the screen
  //     case 39 :
  //     if (player.x + player.width < theCanvas.width) {
  //       player.x += player.speed;
  //     }
  //     break;
  //
  //     default:
  //     // do nothing
  //   }
  // }

  // use the mouse to move the player
  function moveShip(e) {
    //player.x = e.clientX - theCanvas.offsetLeft;
    mousePos = (e.clientX - theCanvas.offsetLeft) - player.width / 2;

    mouseTracker.x = e.clientX - theCanvas.offsetLeft;
  }

  function createBullet() {
    let newBullet = {
      x : (player.x + player.width/2 - 2.5),
      y : (theCanvas.height - player.height -10),
      x2 : 5,
      y2 : 10,
      speed : 8
    }

    let laser = document.createElement('audio');
    laser.src = "audio/laser.mp3";
    document.body.appendChild(laser);

    laser.addEventListener('ended', () => {
      document.body.removeChild(laser);
    });

    laser.play();

    bullets.push(newBullet);
  }

  function pauseGame() {
    playState = false;
  }

  function playGame() {
    playState = true;
    window.requestAnimationFrame(draw);
  }

  function levelUp() {
    //debugger;

    playState = false;
    // make the reset screen show up
    resetScreen.classList.add('show-level-up');
    // make the game a little harder onrestart
  }

  function resetGame() {
    boxes = [
      { x : randomX(), y : 30, x1 : 30, y1 : 30, image : enemy1, xspeed : 3, yspeed : 6, points : 10 },
      { x : randomX(), y : 90, x1 : 40, y1 : 40, image : enemy2, xspeed : 8, yspeed : 4, points : 5 },
      { x : randomX(), y : 150, x1 : 30, y1 : 30, image : enemy3, xspeed : 7, yspeed : 7, points : 10 },
      { x : randomX(), y : 30, x1 : 30, y1 : 30, image : enemy1, xspeed : 5, yspeed : 8, points : 10 },
      { x : randomX(), y : 90, x1 : 40, y1 : 40, image : enemy2, xspeed : 4, yspeed : 6, points : 5 },
      { x : randomX(), y : 150, x1 : 30, y1 : 30, image : enemy3, xspeed : 9, yspeed : 9, points : 10 }
    ];

    bullets = [];

    player.x = theCanvas.width / 2;
    playState = true;

    resetScreen.classList.remove('show-level-up');

    window.requestAnimationFrame(draw);
  }

  function randomX() {
    return Math.floor(Math.random() * (theCanvas.width - 100));
  }

  //window.addEventListener('keydown', movePlayer);
  window.requestAnimationFrame(draw);

  theCanvas.addEventListener('click', createBullet);
  theCanvas.addEventListener('mousemove', moveShip);

  pauseButton.addEventListener('click', pauseGame);
  playButton.addEventListener('click', playGame);

  resetButton.addEventListener('click', resetGame);

})();
