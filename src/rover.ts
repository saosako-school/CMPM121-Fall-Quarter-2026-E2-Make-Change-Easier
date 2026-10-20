export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;

interface DirectionRecord {
  name: string;
  dx: number;
  dy: number;
}

const directions: DirectionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

function boundNumber(num: number) {
  if (num > 4) {
    num = 4;
  } else if (num < 0) {
    num = 0;
  }
  return num;
}

interface RoverCommand {
  name: string;
  command: () => void;
}

let commandQueue: RoverCommand[] = [];

const forward: RoverCommand = {
  name: "Forward",
  command: () => {
    x = x + directions[direction].dx;
    x = boundNumber(x);
    y = y + directions[direction].dy;
    y = boundNumber(y);
  },
};

const right: RoverCommand = {
  name: "Right",
  command: () => {
    direction = (direction + 1) % 4;
  },
};

function displayCommandQueue() {
  const queueStatus = document.getElementById("rover-queue-status");
  queueStatus!.textContent = "";
  if (commandQueue.length === 0) {
    queueStatus!.textContent = "Empty";
  } else {
    for (const commandObj of commandQueue) {
      const newCommand = document.createElement("div");
      newCommand.textContent = commandObj.name;
      queueStatus!.append(newCommand);
    }
  }
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  commandQueue.push(forward);
  displayCommandQueue();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  commandQueue.push(right);
  displayCommandQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  commandQueue = [];
  drawRover();
  displayCommandQueue();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  while (commandQueue.length > 0) {
    commandQueue.shift()!.command();
  }
  drawRover();
  displayCommandQueue();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  commandQueue = [];
  displayCommandQueue();
};
drawRover();
