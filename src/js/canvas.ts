export const canvas = document.querySelector<HTMLCanvasElement>(
  "#canvas",
) as HTMLCanvasElement;
export const c = canvas?.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);
export const gravity = 0.2;
