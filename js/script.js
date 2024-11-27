document.getElementById("generate").addEventListener("click", generateOffspring);

function generateOffspring() {
  const furA = document.getElementById("traitA").value;
  const furB = document.getElementById("traitB").value;
  const earA = document.getElementById("earA").value;
  const earB = document.getElementById("earB").value;
  const sizeA = document.getElementById("sizeA").value;
  const sizeB = document.getElementById("sizeB").value;
  const mutationChance = parseInt(document.getElementById("mutationChance").value, 10);

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const description = document.getElementById("description");

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.classList.remove("mutation");

  // Determine offspring traits
  const fur = determineTrait(furA, furB);
  const ear = determineTrait(earA, earB);
  const size = determineTrait(sizeA, sizeB);

  let mutation = false;
  let albinoType = null;

  // Check for mutation
  if (Math.random() * 100 < mutationChance) {
    mutation = true;
    albinoType = getAlbinoType();
    canvas.classList.add("mutation");
  }

  // Draw parent mice
  drawMouse(ctx, 100, 150, furA, earA, sizeA, false, null);
  drawMouse(ctx, 400, 150, furB, earB, sizeB, false, null);

  // Draw offspring mouse
  drawMouse(ctx, 250, 300, fur, ear, size, mutation, albinoType);

  // Add labels
  ctx.font = "16px Arial";
  ctx.fillText("Parent 1", 70, 130);
  ctx.fillText("Parent 2", 370, 130);
  ctx.fillText("Offspring", 230, 370);

  // Display mutation description
  if (mutation) {
    description.innerHTML = getMutationDescription(albinoType);
  } else {
    description.innerHTML = "No mutation detected in this offspring.";
  }
}

function determineTrait(traitA, traitB) {
  return traitA === traitB ? traitA : Math.random() > 0.5 ? traitA : traitB;
}

function getAlbinoType() {
  const types = ["ocular", "oculocutaneous", "partial"];
  return types[Math.floor(Math.random() * types.length)];
}

function getMutationDescription(type) {
  switch (type) {
    case "ocular":
      return `
        <strong>Albinismo Ocular:</strong> 
        Afeta apenas os olhos, que podem apresentar ausência total ou parcial de pigmentação. 
        Pode causar fotofobia, estrabismo e movimento irregular dos olhos.
      `;
    case "oculocutaneous":
      return `
        <strong>Albinismo Oculocutâneo:</strong> 
        Afeta a pele, cabelos e olhos. Existem diferentes subtipos, que variam na intensidade da pigmentação.
      `;
    case "partial":
      return `
        <strong>Albinismo Parcial:</strong> 
        Afeta apenas algumas partes do corpo, apresentando ausência de melanina em regiões específicas.
      `;
    default:
      return "Unknown mutation type.";
  }
}

function drawMouse(ctx, x, y, fur, ear, size, mutation, albinoType) {
  const scale = size === "large" ? 1.5 : 1;

  // Determine colors based on mutation and traits
  let furColor = fur === "black" ? "black" : "white";
  if (mutation) {
    if (albinoType === "ocular") {
      furColor = fur === "black" ? "gray" : "lightgray"; // Foco nos olhos
    } else if (albinoType === "oculocutaneous") {
      furColor = "pink"; // Albinismo completo
    } else if (albinoType === "partial") {
      furColor = fur === "black" ? "black" : "white"; // Mantém cor base, mas com áreas claras
    }
  }

  // Draw head
  ctx.beginPath();
  ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
  ctx.fillStyle = furColor;
  ctx.fill();
  ctx.stroke();

  // Draw ears
  ctx.beginPath();
  const earSize = ear === "large" ? 15 * scale : 10 * scale;
  ctx.arc(x - 30 * scale, y - 20 * scale, earSize, 0, Math.PI * 2); // Left ear
  ctx.arc(x + 30 * scale, y - 20 * scale, earSize, 0, Math.PI * 2); // Right ear
  ctx.fillStyle = mutation && albinoType === "oculocutaneous" ? "pink" : furColor;
  ctx.fill();
  ctx.stroke();

  // Draw eyes (with possible albinism effects)
  ctx.beginPath();
  const eyeColor = mutation && albinoType === "ocular" ? "red" : "black";
  ctx.arc(x - 10 * scale, y - 5 * scale, 5 * scale, 0, Math.PI * 2); // Left eye
  ctx.arc(x + 10 * scale, y - 5 * scale, 5 * scale, 0, Math.PI * 2); // Right eye
  ctx.fillStyle = eyeColor;
  ctx.fill();
}
