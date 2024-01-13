import "./style.css";
import { Sprite, Fighter } from "@/js/classes";
import { canvas, c, gravity } from "@/js/canvas";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Sprite({
  position: { x: 0, y: 0 },
  image_src: "./img/background.png"
});

const player = new Fighter({
  position: { x: canvas.width / 5  , y: 0 },
  velocity: { x: 0, y: 10 },
  color: "green",
  offset: { x: 0, y: 0 },
});

player.draw();

const enemy = new Fighter({
  position: { x: canvas.width *(4/5) , y: 100 },
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

const rectangular_collision = ({ attacker, target, }: { attacker: Fighter; target: Fighter; }) => {
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

const determine_winner = ({player, enemy, timer_id}: {player: Fighter; enemy: Fighter; timer_id: number})=> {
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

  background.update();
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
      keys.enemy.right.motion = true;
      last_key = "l";
      break;

    case "h":
      last_key = "h";
      keys.enemy.left.motion = true;
      break;

    case "k":
      enemy.velocity.y = -15;
      break;

    case "AltGraph":
      enemy.attack();
      break;

    case "g":
    case "ArrowRight":
      keys.player.right.motion = true;
      last_key = "g";
      break;

    case "s":
    case "ArrowLeft":
      last_key = "a";
      keys.player.left.motion = true;
      break;

    case "d":
    case "ArrowUp":
      player.velocity.y = -15;
      break;

    case " ":
      player.attack();
      break;
  }
});

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.key) {
    case "g":
    case "ArrowRight":
    case "l":
      keys.player.right.motion = false;
      keys.enemy.right.motion = false;
      break;

    case "s":
    case "ArrowLeft":
    case "h":
      keys.player.left.motion = false;
      keys.enemy.left.motion = false;
      break;
  }
});
