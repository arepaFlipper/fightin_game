import "./style.css";
import { Sprite, Fighter, Background } from "@/js/classes";
import { canvas, c, gravity } from "@/js/canvas";
import { rectangular_collision, determine_winner, decrease_timer, timer_id } from "@/js/utils";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let last_key: string = "";

const background = new Background({
  position: { x: 0, y: 0 },
  image_src: "./img/background.png",
  width: canvas.width,
  height: canvas.height,
  scale: 5.875,
});

const shop = new Sprite({
  position: { x: canvas.width*(30/50), y: canvas.height*(22.5/50) },
  image_src: "./img/shop.png",
  width: canvas.width * (.31),
  height: canvas.height,
  scale: 2.5,
  frames_max: 6
});

const player = new Fighter({
  position: { x: canvas.width / 5  , y: 0 },
  velocity: { x: 0, y: 10 },
  color: "green",
  offset: { x: 0, y: 0 },
});

player.draw();

const enemy = new Fighter({
  position: { x: canvas.width *(4/5) , y: 0 },
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


decrease_timer({player, enemy });

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
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
      enemy.velocity.y = -14;
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
      player.velocity.y = -14;
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
