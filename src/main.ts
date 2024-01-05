import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>(
  "#canvas",
) as HTMLCanvasElement;
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
  attack_box = {
    position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    width: 100,
    height: 50,
  };
  color: string = "";
  is_attacking: boolean = false;
  health: number =100;

  constructor({ position, velocity, color, offset, }: {
    position: { x: number; y: number }; offset: { x: number; y: number }; velocity: { x: number; y: number }; color: string;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height;
    this.width;
    this.last_key;
    this.attack_box = {
      position: { x: 0, y: 0 },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.health;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, 150);

    if (this.is_attacking) {
      c.fillStyle = "green";
      c.fillRect( this.attack_box.position.x, this.attack_box.position.y, this.attack_box.width, this.attack_box.height);
    }
  }

  update() {
    this.draw();
    this.attack_box.position.x = this.position.x + this.attack_box.offset.x;
    this.attack_box.position.y = this.position.y + this.attack_box.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      // touch the ground
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }

    if (
      this.position.x + this.velocity.x <= 0 ||
      this.position.x + this.velocity.x >= canvas.width - 50
    ) {
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

const player = new Sprite({
  position: { x: 400, y: 0 },
  velocity: { x: 0, y: 10 },
  color: "green",
  offset: { x: 0, y: 0 },
});

player.draw();

const enemy = new Sprite({
  position: { x: canvas.width - 100, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
});

enemy.draw();

const keys = {
  player: {
    right: { motion: false },
    left: { motion: false },
  },
  enemy: {
    right: { motion: false },
    left: { motion: false },
  },
};

let last_key: string = "";

const rectangular_collision = ({ attacker, target, }: { attacker: Sprite; target: Sprite; }) => {
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

let timer = 60;
let timer_id: number;

const determine_winner = ({player, enemy, timer_id}: {player: Sprite; enemy: Sprite; timer_id: number})=> {
  clearTimeout(timer_id);
  if(player.health === enemy.health){
    document.querySelector<HTMLDivElement>("#sign")!.innerHTML = "Tie";
  } else if (player.health > enemy.health){
    document.querySelector<HTMLDivElement>("#sign")!.innerHTML = "Enemy wins";
  } else if (player.health < enemy.health){
    document.querySelector<HTMLDivElement>("#sign")!.innerHTML = "Player wins";
  }

  document.querySelector<HTMLDivElement>("#sign")!.style.display = "flex";
}

const decrease_timer = () => {
  if(timer > 0){
    timer_id = setTimeout(decrease_timer, 1000);
    timer--;
    document.querySelector<HTMLDivElement>("#timer")!.innerHTML = timer.toString();
  }

  if(timer === 0) {
    document.querySelector<HTMLDivElement>("#sign")!.style.display = "flex";
    determine_winner({player, enemy, timer_id});
  }
  
}

decrease_timer();

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
  }

  if (rectangular_collision({ attacker: player, target: enemy })) {
    player.is_attacking = false;
    enemy.health -= 20;
    (document.querySelector("#enemy_health") as HTMLDivElement).style.width = `${enemy.health}%`;

    if(enemy.health <= 0 ){
      determine_winner({player, enemy, timer_id});
    }
  }

  if (rectangular_collision({ attacker: enemy, target: player })) {
    enemy.is_attacking = false;
    player.health -= 20;
    (document.querySelector("#player_health") as HTMLDivElement).style.width = `${player.health}%`;

    if(player.health <=0){
      determine_winner({player, enemy, timer_id});
    }
  }
};

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

    case " ":
      player.attack();
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

    case "AltGraph":
      enemy.attack();
      break;
  }
});

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
});
