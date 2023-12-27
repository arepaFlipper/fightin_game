import './style.css'

const canvas = document.querySelector<HTMLDivElement>('#app')
const c = canvas?.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);
