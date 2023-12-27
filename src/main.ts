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

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
};

const player = new Sprite({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 10 } });

player.draw();

const enemy = new Sprite({ position: { x: 400, y: 100 }, velocity: { x: 0, y: 0 } });

enemy.draw();

console.log(`🦚%cmain.ts:19 - player`, 'font-weight:bold; background:#56a900;color:#fff;');
console.log(player);

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
}

animate();

window.addEventListener("keydown", (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowRight":
    case "l":
      player.velocity.x = 1;

      break;
  }
  console.log(`🎼 %cmain.ts:64 - event`, 'font-weight:bold; background:#a65900;color:#fff;');
  console.log(event);
  console.log(`🍟%cmain.ts:66 - event.key`, 'font-weight:bold; background:#a85700;color:#fff;');
  console.log(event.key);

})

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowRight":
    case "l":
      player.velocity.x = 0;

      break;
  }
  console.log(`🎼 %cmain.ts:64 - event`, 'font-weight:bold; background:#a65900;color:#fff;');
  console.log(event);
  console.log(`🍟%cmain.ts:66 - event.key`, 'font-weight:bold; background:#a85700;color:#fff;');
  console.log(event.key);

})
