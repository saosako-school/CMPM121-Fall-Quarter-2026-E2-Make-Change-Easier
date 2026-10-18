export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedProducer = 2;

interface ShiftSupplies {
  production: number;
  consumption: number;
  balance: number;
}

function determineShiftResources(
  numProducers: number,
  amountConsumed: number,
): ShiftSupplies {
  const suppliesMadePerProducer = 3;
  const resourcesProduced = numProducers * suppliesMadePerProducer;
  const resourceBalance = resourcesProduced - amountConsumed;
  return {
    production: resourcesProduced,
    consumption: amountConsumed,
    balance: resourceBalance,
  };
}

function displayShiftReportGraphics(
  supplies: ShiftSupplies,
  numProducers: number,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < numProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < numProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${numProducers} / 6`, 18, 76);

  ctx.fillText(`Production: ${supplies.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, supplies.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${supplies.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, supplies.consumption * 14, 20);
}

function displayShiftReportText(supplies: ShiftSupplies, numProducers: number) {
  readout.textContent =
    `Assigned: ${numProducers}/6 · Production: ${supplies.production} · Consumption: ${supplies.consumption} · Balance: ${
      supplies.balance > 0 ? "+" : ""
    }${supplies.balance}`;
}

function updateScreenA() {
  const crewSupplies = determineShiftResources(assignedProducer, 6);

  displayShiftReportGraphics(crewSupplies, assignedProducer);
  displayShiftReportText(crewSupplies, assignedProducer);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedProducer = Math.max(0, assignedProducer - 1);
  updateScreenA();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedProducer = Math.min(6, assignedProducer + 1);
  updateScreenA();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedProducer = 2;
    updateScreenA();
  };
updateScreenA();
