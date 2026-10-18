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

interface SupplyRecord {
  label: string;
  value: number;
  color: string;
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
  const supplyRecords: [SupplyRecord, SupplyRecord] = [{
    label: "Production",
    value: supplies.production,
    color: "#27766b",
  }, {
    label: "Consumption",
    value: supplies.consumption,
    color: "#a44d23",
  }];

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

  for (let j = 0; j < supplyRecords.length; j++) {
    ctx.fillText(
      `${supplyRecords[j].label}: ${supplyRecords[j].value}`,
      18,
      102 + (j * 52),
    );
    ctx.fillStyle = supplyRecords[j].color;
    ctx.fillRect(18, 110 + (j * 52), supplyRecords[j].value * 14, 20);
    ctx.fillStyle = "#233e43";
  }
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
