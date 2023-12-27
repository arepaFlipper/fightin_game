import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#app')!;
const c = canvas?.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {

  position = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };
  height = 0;

  constructor({ position, velocity }: { position: { x: number, y: number }, velocity: { x: number, y: number } }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  };

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, 150);
  };

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) { // touch the ground
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }

    if (this.position.x + this.velocity.x <= 0 || this.position.x + this.velocity.x >= canvas.width - 50) {
      this.velocity.x = 0;
      if (this.position.x >= canvas.width - 50) {
        this.position.x = canvas.width - 50;
      } else if (this.position.x <= 0) {
        this.position.x = 0;
      }
    }
  }
};

const player = new Sprite({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 10 } });

player.draw();

const enemy = new Sprite({ position: { x: 400, y: 100 }, velocity: { x: 0, y: 0 } });

enemy.draw();

console.log(`🦚%cmain.ts:19 - player`, 'font-weight:bold; background:#56a900;color:#fff;');
console.log(player);

const keys = {
  right: { motion: false },
  left: { motion: false },
}

let last_key: string = "";

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  if (keys.right.motion) {
    player.velocity.x += 1;
    if (last_key === "l") {
      player.velocity.x += 1;
    }
  } else if (keys.left.motion) {
    player.velocity.x = -1;
  } else {
    player.velocity.x = 0;
  };
}

animate();

window.addEventListener("keydown", (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowRight":
    case "l":
      keys.right.motion = true;
      last_key = "l";
      break;

    case "ArrowLeft":
    case "h":
      last_key = "h";
      keys.left.motion = true;
      break;

    case "ArrowUp":
    case "k":
      player.velocity.y = -10;
  }

})

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowRight":
    case "l":
      keys.right.motion = false;
      break;

    case "ArrowLeft":
    case "h":
      keys.left.motion = false;
      break;
  }
  console.log(`🎼 %cmain.ts:64 - event`, 'font-weight:bold; background:#a65900;color:#fff;');
  console.log(event);
  console.log(`🍟%cmain.ts:66 - event.key`, 'font-weight:bold; background:#a85700;color:#fff;');
  console.log(event.key);

})
