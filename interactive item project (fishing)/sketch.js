//fishing rod positions
let fishingRodX;
let fishingLineY;
//store fish object
let fish;
//number of fish caught
let fishCaught = 0;
//gameinfo
let catchThreshold;
let clicks = 0;
let gameState = "pause";
let stopTime = 0; // Time when the fish meets the line

function setup() {
  createCanvas(400, 400);
  fishingRodX = width / 2;
  fishingLineY = height / 2;
  fish = new Fish();
  catchThreshold = random(1, 5); // Set a new catch threshold between 1 and 5
}

function draw() {
  //create bg
  background(135, 205, 250);
  fill(0, 0, 139);
  rect(0, height / 2, width, height / 2);

  //create rod
  stroke(0);
  strokeWeight(4);
  line(fishingRodX, 0, fishingRodX, height / 2);
  line(fishingRodX, height / 2, fishingRodX, fishingLineY);

  //create diagonal rod line
  stroke(0); // Black color
  strokeWeight(4);
  line(fishingRodX, 0, fishingRodX - 50, height / 2); // Diagonal line
  fill("red");
  circle(fishingRodX - 50, 160, 20); // Circle;

  if (gameState === "fishing") {
    fishingLineY = constrain(mouseY, height / 2, height);
  }
  fish.display();
  fish.move();

  // Check if the fishing line meets the fish
  if (
    gameState === "fishing" &&
    dist(fishingRodX, fishingLineY, fish.x, fish.y) < 20
  ) {
    fill(255);
    textSize(20);
    text(`Click: ${catchThreshold} times!`, width / 2 - 100, height / 2 - 20);

    // Stop the fish for 2 seconds
    if (stopTime === 0) {
      stopTime = millis();
      fish.stop();
    } else if (millis() - stopTime >= 1) {
      fish.resume();
      stopTime = 0;
    }
  }

  //game info
  fill(255);
  textSize(20);
  text(`Fish Caught: ${fishCaught}`, 20, 30);

  //instructions @ pause
  if (gameState === "pause") {
    text("Move cursor to cast!", width / 2 - 100, height / 2 - 20);
    text(
      "Click many times to reel in when a fish bites!",
      width / 2 - 200,
      height / 2 + 20
    );
  } else if (gameState === "caught") {
    text("Caught!", width / 2 - 80, height / 2 - 20);
  }
}

function mousePressed() {
  if (gameState === "pause") {
    gameState = "fishing";
    fishingLineY = height / 2;
    // Reset clicks when starting to fish
    clicks = 0;
    // Set a new catch threshold between 1 and 5
    catchThreshold = int(random(1, 5));
  } else if (gameState === "fishing") {
    clicks++;
    if (
      dist(fishingRodX, fishingLineY, fish.x, fish.y) < 20 &&
      clicks >= catchThreshold
    ) {
      gameState = "caught";
      fishCaught++;
      fish.reset();
      clicks = 0; // Reset clicks after catching a fish
    }
  } else if (gameState === "caught") {
    gameState = "pause";
  }
}
//indicate fish movement
class Fish {
  constructor() {
    this.reset();
    this.isStopped = false;
  }
//fish resets when caught
  reset() {
    this.x = random(width,width*1.5);
    this.y = random(height / 2 + 50, height - 50);
    this.size = random(20, 40);
    this.speed = random(1, 3);
    this.isStopped = false;
  }
//fish display
  display() {
    fill(255, 165, 0); 
    ellipse(this.x, this.y, this.size, this.size / 2);
    triangle(
      this.x + this.size / 2,
      this.y,
      this.x + this.size / 2 + 10,
      this.y - 10,
      this.x + this.size / 2 + 10,
      this.y + 10
    );
  }

  move() {
    if (!this.isStopped) {
      this.x -= this.speed; // Move fish to the left
      if (this.x < -this.size) {
        this.reset(); // Reset fish to the right
      }
    }
  }

  stop() {
    this.isStopped = true;
  }

  resume() {
    this.isStopped = false;
  }
}
