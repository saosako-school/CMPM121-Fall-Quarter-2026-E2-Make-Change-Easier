export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
interface ShieldStatus {
  currentCharge: number;
  capacity: number;
  missingCharge: number;
}

const shieldStatus: ShieldStatus = {
  currentCharge: 0,
  capacity: 10,
  missingCharge: 10,
};

let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

function updateCharge(shield: ShieldStatus, newCharge: number) {
  shield.currentCharge = newCharge;
  shield.missingCharge = shield.capacity - shield.currentCharge;
}

function drawMeter(shield: ShieldStatus) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; ++i) {
    ctx.fillStyle = i < shield.currentCharge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.currentCharge} / ${shield.capacity} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${shield.currentCharge} / ${shield.capacity}`;
}

function updateStats(shield: ShieldStatus) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(shield);
}

function renderStats(shield: ShieldStatus) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shield.currentCharge} · Missing charge: ${shield.missingCharge}`;
}

function setCount(shield: ShieldStatus, change: number) {
  if (change !== 0) {
    change = shield.currentCharge + change;
  }
  const bounded = Math.max(0, Math.min(shield.capacity, change));
  if (bounded === shield.currentCharge) return;
  updateCharge(shield, bounded);
  drawMeter(shield);
  if (panel) updateStats(shield);
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(shieldStatus, -1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(shieldStatus, 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(shieldStatus, 0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(shieldStatus);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(shieldStatus);
