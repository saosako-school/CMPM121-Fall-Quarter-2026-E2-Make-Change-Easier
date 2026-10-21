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
  eventTarget: EventTarget;
}

interface ShieldSnapshot {
  currentChargeSnapshot: number;
  capacitySnapshot: number;
  missingChargeSnapshot: number;
}

const shieldStatus: ShieldStatus = {
  currentCharge: 0,
  capacity: 10,
  missingCharge: 10,
  eventTarget: new EventTarget(),
};

shieldStatus.eventTarget.addEventListener(
  "shieldChange",
  (event) => {
    const customEvent: CustomEvent<ShieldSnapshot> = event as CustomEvent;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < customEvent.detail.capacitySnapshot; ++i) {
      ctx.fillStyle = i < customEvent.detail.currentChargeSnapshot
        ? "#27766b"
        : "#c9d2c9";
      ctx.fillRect(12 + i * 28, 24, 24, 48);
    }
    ctx.fillStyle = "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(
      `${customEvent.detail.currentChargeSnapshot} / ${customEvent.detail.capacitySnapshot} shield`,
      12,
      100,
    );
    readout.textContent =
      `Shield charge: ${customEvent.detail.currentChargeSnapshot} / ${customEvent.detail.capacitySnapshot}`;
  },
);

let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

function getSnapshot(shield: ShieldStatus): ShieldSnapshot {
  return {
    currentChargeSnapshot: shield.currentCharge,
    capacitySnapshot: shield.capacity,
    missingChargeSnapshot: shield.missingCharge,
  };
}

function updatePanel(event: Event) {
  const customEvent: CustomEvent<ShieldSnapshot> = event as CustomEvent;
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(customEvent.detail);
}

function updateCharge(shield: ShieldStatus, newCharge: number) {
  shield.currentCharge = newCharge;
  shield.missingCharge = shield.capacity -
    shield.currentCharge;
}

function renderStats(shieldSnapshot: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shieldSnapshot.currentChargeSnapshot} · Missing charge: ${shieldSnapshot.missingChargeSnapshot}`;
}

function setCount(shield: ShieldStatus, change: number) {
  if (change !== 0) {
    change = shield.currentCharge + change;
  }
  const bounded = Math.max(0, Math.min(shield.capacity, change));
  if (bounded === shield.currentCharge) return;
  updateCharge(shield, bounded);
  shield.eventTarget.dispatchEvent(
    new CustomEvent<ShieldSnapshot>("shieldChange", {
      detail: getSnapshot(shield),
    }),
  );
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
  renderStats(getSnapshot(shieldStatus));
  shieldStatus.eventTarget.addEventListener("shieldChange", updatePanel);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  shieldStatus.eventTarget.removeEventListener("shieldChange", updatePanel);
  panel.remove();
  panel = null;
};

shieldStatus.eventTarget.dispatchEvent(
  new CustomEvent<ShieldSnapshot>("shieldChange", {
    detail: getSnapshot(shieldStatus),
  }),
);
