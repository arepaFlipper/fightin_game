import { canvas, c, gravity } from "./canvas";

type TSprite = {
  position: { x: number; y: number; };
  image_src: string;
  width: number;
  height: number;
  scale: number;
  frames_max: number;
};

type TBackground = {
  position: { x: number; y: number; };
  image_src: string;
  width: number;
  height: number;
  scale: number;
};

export class Sprite {
  position = { x: 0, y: 0 };
  width: number = 0;
  height: number = 0;
  image_src: string = "";
  image: HTMLImageElement = new Image();
  scale: number = 1;
  frames_max: number = 0;

  constructor({ position, image_src, width, height, scale = 1, frames_max }: TSprite) {
    this.position = position;
    this.width;
    this.height;
    this.image;
    this.image.src = image_src;
    this.scale = scale;
    this.image.width = width;
    this.image.height = height;
    this.frames_max = frames_max; 
  }

  draw() {
    //drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number)
    const s_w = 1/25;
    const d_w = 1/8;
    const [sx, sy] = [0,0];
    const [dx, dy] = [this.position.x,this.position.y]
    const [sw, sh] = [(this.image.width *(383*6/(canvas.width*this.frames_max)) ) ,this.image.height]
    const [dw, dh] = [(this.image.width*6/(this.frames_max)),this.image.height*(this.scale)]
    c.drawImage(
      this.image,
      sx,sy,sw, sh,
      dx, dy,
      dw,dh
    );
  }

  update() {
    this.draw();
  }

}

export class Background {
  position = { x: 0, y: 0 };
  width: number = 0;
  height: number = 0;
  image_src: string = "";
  image: HTMLImageElement = new Image();
  scale: number = 1;
  frames_max?: number = 1;

  constructor({ position, image_src, width, height, scale }: TBackground) {
    this.position = position;
    this.width;
    this.height;
    this.image;
    this.image.src = image_src;
    this.scale = scale || 1;
    this.image.width = width;
    this.image.height = height;
  };

  draw() {
    c.drawImage(
      this.image,
      // 0,0,this.image.width,this.image.height,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height 
    );
  };

  update() {
    this.draw();
  };

}


export class Fighter {
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

    if (this.position.y + this.height + this.velocity.y >= canvas.height * (.835) ) {
      // touch the ground
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }

    if ( this.position.x + this.velocity.x <= 0 || this.position.x + this.velocity.x >= canvas.width - 50) {
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


