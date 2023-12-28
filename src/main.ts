import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#app') as HTMLCanvasElement;
const c = canvas?.getContext("2d")!;

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
  attack_box = { position: { x: 0, y: 0 }, width: 0, height: 0 };
  color = "";

  constructor({ position, velocity, color }: { position: { x: number, y: number }, velocity: { x: number, y: number }, color: string }) {
    this.position = position;
    this.velocity = velocity;
    this.height;
    this.width;
    this.last_key;
    this.attack_box = { position: this.position, width: 100, height: 50 };
    this.color = color;
  };

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, 150);

    // attack_box
    // c.fillStyle = "green";
    c.fillRect(this.attack_box.position.x, this.attack_box.position.y, this.attack_box.width, this.attack_box.height);

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

const player = new Sprite({ position: { x: 50, y: 0 }, velocity: { x: 0, y: 10 }, color: "red" });

player.draw();

const enemy = new Sprite({ position: { x: canvas.width - 100, y: 100 }, velocity: { x: 0, y: 0 }, color: "blue" });

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
}

let last_key: string = "";

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
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
  };
  //
  // detect for collisions
  const player_collides_enemy = player.attack_box.position.x + player.attack_box.width >= enemy.position.x
  const enemy_collides_player = player.attack_box.position.x <= enemy.position.x + enemy.width
  const player_jump_collides_enemy = player.attack_box.position.y + player.attack_box.height >= enemy.position.y
  const enemy_jump_collides_player = player.attack_box.position.y <= enemy.position.y + enemy.height

  if (player_collides_enemy && enemy_collides_player && player_jump_collides_enemy && enemy_jump_collides_player && (player.is_attacking || enemy.is_attacking)) {
    player.is_attacking = false; // stop attack but does not work
    console.log(`🥈%cmain.ts:41 - Collision Detected!!`, 'font-weight:bold; background:#897600;color:#fff;');
  }
}

animate();

window.addEventListener("keydown", (event: KeyboardEvent) => {
  switch (event.key) {
    case "l":
      keys.player.right.motion = true;
      last_key = "l";
      break;

    case "h":
      last_key = "h";
      keys.player.left.motion = true;
      break;

    case "k":
      player.velocity.y = -20;
      break;

    case "ArrowRight":
      keys.enemy.right.motion = true;
      last_key = "l";
      break;

    case "ArrowLeft":
      last_key = "h";
      keys.enemy.left.motion = true;
      break;

    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
  }

})

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowRight":
    case "l":
      keys.player.right.motion = false;
      keys.enemy.right.motion = false;
      break;

    case "ArrowLeft":
    case "h":
      keys.player.left.motion = false;
      keys.enemy.left.motion = false;
      break;
  }
  console.log(`🍟%cmain.ts:66 - event.key`, 'font-weight:bold; background:#a85700;color:#fff;');
  console.log(event.key);

})
