import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#app')!;
const c = canvas?.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {

  position = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };

  constructor({ position, velocity }: { position: { x: number, y: number }, velocity: { x: number, y: number } }) {
    this.position = position;
    this.velocity = velocity;
  };

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, 150);
  };

  update() {
    this.draw();
    this.position.y += 10;
  }
};

const player = new Sprite({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } });

player.draw();

const enemy = new Sprite({ position: { x: 400, y: 100 }, velocity: { x: 0, y: 0 } });

enemy.draw();

console.log(`🦚%cmain.ts:19 - player`, 'font-weight:bold; background:#56a900;color:#fff;');
console.log(player);

const animate = () => {
  window.requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
}

animate();
