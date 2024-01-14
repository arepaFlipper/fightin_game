import { Fighter } from "@/js/classes";

export const rectangular_collision = ({ attacker, target, }: { attacker: Fighter; target: Fighter; }) => {
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


export const determine_winner = ({player, enemy, timer_id}: {player: Fighter; enemy: Fighter; timer_id: number})=> {
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

let timer: number = 60;
export let timer_id:number;

export let last_key: string = "";

export const decrease_timer = ({player, enemy }: {player: Fighter; enemy: Fighter; }) => {
  if(timer > 0){
    
    timer_id = setTimeout(() => decrease_timer({player, enemy }), 1000);
    timer--;
    document.querySelector<HTMLDivElement>("#timer")!.innerHTML = timer.toString();
  }

  if(timer === 0) {
    document.querySelector<HTMLDivElement>("#sign")!.style.display = "flex";
    determine_winner({player, enemy, timer_id});
  }
  
}
