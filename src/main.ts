import './style.css'

const canvas = document.querySelector<HTMLDivElement>('#app')
const c = canvas?.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor(position) {
    this.position = position;
  };

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, 150);
  };
};

const player = new Sprite({ x: 0, y: 0 });

player.draw();

console.log(`🦚%cmain.ts:19 - player`, 'font-weight:bold; background:#56a900;color:#fff;');
console.log(player);

