export function setupCraterCalculator() {
  const button = document.getElementById("calcButton");
  button?.addEventListener("click", () => {
    const massInput = parseFloat(document.getElementById("massInput").value);
    if (isNaN(massInput) || massInput <= 0) {
      alert("Введите корректную массу метеорита.");
      return;
    }

    const massTonnes = massInput / 1000;
    const diameter = (massTonnes ** 0.33 * 10).toFixed(2);
    const depth = (diameter * 0.25).toFixed(2);

    document.getElementById("diameterOutput").textContent = `Диаметр кратера: ${diameter} м`;
    document.getElementById("depthOutput").textContent = `Глубина кратера: ${depth} м`;
  });
}