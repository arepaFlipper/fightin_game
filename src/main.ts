import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas') as HTMLCanvasElement;
const c = canvas?.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {

  position = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };
  height: number = 150;
  width: number = 50;
  last_key: string = "";
  attack_box = { position: { x: 0, y: 0 }, offset: { x: 0, y: 0 }, width: 100, height: 50 };
  color: string = "";
  is_attacking: boolean = false;

  constructor({ position, velocity, color, offset }: { position: { x: number, y: number }, offset: { x: number, y: number }, velocity: { x: number, y: number }, color: string }) {
    this.position = position;
    this.velocity = velocity;
    this.height;
    this.width;
    this.last_key;
    this.attack_box = { position: { x: 0, y: 0 }, offset, width: 100, height: 50 };
    this.color = color;
  };

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, 150);

    if (this.is_attacking) {
      c.fillStyle = 'green';
      c.fillRect(this.attack_box.position.x, this.attack_box.position.y, this.attack_box.width, this.attack_box.height);
    }
  };

  update() {
    this.draw();
    this.attack_box.position.x = this.position.x + this.attack_box.offset.x;
    this.attack_box.position.y = this.position.y + this.attack_box.offset.y;

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

  attack() {
    this.is_attacking = true;
    setTimeout(() => {
      this.is_attacking = false;
    }, 100);
  }
}

const player = new Sprite({ position: { x: 400, y: 0 }, velocity: { x: 0, y: 10 }, color: 'red', offset: { x: 0, y: 0 } });

player.draw();

const enemy = new Sprite({ position: { x: canvas.width - 100, y: 100 }, velocity: { x: 0, y: 0 }, color: 'blue', offset: { x: -50, y: 0 } });

enemy.draw();

const keys = {
  player: {
    right: { motion: false },
    left: { motion: false },
  },
  enemy: {
    right: { motion: false },
    left: { motion: false },
  }
};

let last_key: string = '';

const rectangular_collision = ({ attacker, target }: { attacker: Sprite, target: Sprite }) => {
  const attackerCollidesTargetX = attacker.attack_box.position.x + attacker.attack_box.width >= target.position.x;
  const targetCollidesAttackerX = attacker.attack_box.position.x <= target.position.x + target.width;
  const attackerCollidesTargetY = attacker.attack_box.position.y + attacker.attack_box.height >= target.position.y;
  const targetCollidesAttackerY = attacker.attack_box.position.y <= target.position.y + target.height;

  return (
    attackerCollidesTargetX &&
    targetCollidesAttackerX &&
    attackerCollidesTargetY &&
    targetCollidesAttackerY &&
    attacker.is_attacking
  );
};


const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  if (keys.player.right.motion) {
    player.velocity.x += 1;
  } else if (keys.player.left.motion) {
    player.velocity.x -= 1;
  } else if (keys.enemy.right.motion) {
    enemy.velocity.x += 1;
  } else if (keys.enemy.left.motion) {
    enemy.velocity.x -= 1;
  } else {
    player.velocity.x = 0;
    enemy.velocity.x = 0;
  }


  if (rectangular_collision({ attacker: player, target: enemy })) {
    player.is_attacking = false;
    (document.querySelector('#enemy_health') as HTMLDivElement).style.width = `20%`;
  }

  if (rectangular_collision({ attacker: enemy, target: player })) {
    enemy.is_attacking = false;
  }
};

animate();

window.addEventListener('keydown', (event: KeyboardEvent) => {
  switch (event.key) {
    case 'l':
      keys.player.right.motion = true;
      last_key = 'l';
      break;

    case 'h':
      last_key = 'h';
      keys.player.left.motion = true;
      break;

    case 'k':
      player.velocity.y = -20;
      break;

    case ' ':
      player.attack();
      break;

    case 'ArrowRight':
      keys.enemy.right.motion = true;
      last_key = 'l';
      break;

    case 'ArrowLeft':
      last_key = 'h';
      keys.enemy.left.motion = true;
      break;

    case 'ArrowUp':
      enemy.velocity.y = -20;
      break;

    case 'AltGraph':
      enemy.attack();
      break;
  }
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowRight':
    case 'l':
      keys.player.right.motion = false;
      keys.enemy.right.motion = false;
      break;

    case 'ArrowLeft':
    case 'h':
      keys.player.left.motion = false;
      keys.enemy.left.motion = false;
      break;
  }
  console.log(`🍟%cmain.ts:66 - event.key`, 'font-weight:bold; background:#a85700;color:#fff;');
  console.log(event.key);
});

