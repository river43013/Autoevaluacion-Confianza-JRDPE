"use strict";

const SUPABASE_URL = "https://xsoedvpkxbutuzinqnpn.supabase.co";
const SUPABASE_KEY = "sb_publishable_tKzzxTK3QpPJTt4KXOUxVQ_e6C-d1v8";

const questions = [
  {
    text: "Le prometiste a una persona de tu equipo que revisarías su propuesta antes del viernes. El jueves aparece una urgencia importante y sabes que no llegarás a cumplir. ¿Qué haces?",
    options: [
      ["A", "Esperas hasta el viernes y, si no llegas, explicas que surgieron otras prioridades.", 3],
      ["B", "Le pides que te lo recuerde más adelante, porque ahora depende también de su seguimiento.", 2],
      ["C", "Le avisas antes del plazo, reconoces que no cumplirás y acuerdan una nueva fecha concreta.", 4],
      ["D", "Priorizas la urgencia y dejas que la persona entienda que no pudiste atenderlo.", 1]
    ]
  },
  {
    text: "Una persona valiosa de tu equipo te pide una excepción a una regla que ya aplicaste a otras personas. Su motivo es comprensible. ¿Qué haces?",
    options: [
      ["A", "Aceptas la excepción y luego explicas al equipo que era un caso especial.", 3],
      ["B", "Rechazas el pedido para evitar cualquier percepción de favoritismo.", 2],
      ["C", "Revisas el criterio, explicas tu decisión y, si corresponde, haces la excepción de manera transparente y replicable para casos equivalentes.", 4],
      ["D", "Aceptas la excepción en privado para no generar preguntas.", 1]
    ]
  },
  {
    text: "Una persona de tu equipo no está cumpliendo con lo esperado y el resto comienza a notarlo. ¿Qué haces?",
    options: [
      ["A", "Esperas un poco más para no presionarla y ves si mejora por sí sola.", 2],
      ["B", "Conversas con ella, aclaras la brecha, escuchas el contexto y acuerdan acciones y seguimiento concretos.", 4],
      ["C", "Redistribuyes parte de su trabajo sin explicarle directamente el motivo.", 1],
      ["D", "Le indicas con firmeza que debe mejorar y que habrá consecuencias si no lo hace.", 3]
    ]
  },
  {
    text: "Has dicho a tu equipo: ‘Quiero que cuestionen mis decisiones’. En una reunión, una persona te contradice públicamente con un punto válido, pero usando una forma poco apropiada. ¿Qué haces?",
    options: [
      ["A", "Marcas el límite frente al equipo para dejar claro que esa no es la forma de cuestionar.", 2],
      ["B", "No haces nada para demostrar que realmente aceptas cualquier cuestionamiento.", 1],
      ["C", "Reconoces el contenido válido en el momento y luego conversas en privado sobre la forma.", 4],
      ["D", "Conversas después con la persona y le pides que, en adelante, plantee primero los desacuerdos en privado.", 3]
    ]
  },
  {
    text: "Dos personas cometen el mismo error. Una es nueva y venía desempeñándose bien; la otra tiene más experiencia y ya recibió feedback anteriormente. ¿Cómo respondes?",
    options: [
      ["A", "Aplicas exactamente la misma consecuencia a ambas para ser justo.", 2],
      ["B", "Tomas en cuenta las circunstancias y antecedentes, pero aplicas el mismo criterio y explicas la diferencia de respuesta.", 4],
      ["C", "Eres más exigente con la persona antigua porque debería saberlo mejor.", 3],
      ["D", "Consideras principalmente el desempeño general de cada una antes de decidir.", 1]
    ]
  },
  {
    text: "Prometiste al equipo que, si cumplían una meta exigente, no tendrían que quedarse fuera de horario. Cumplieron, pero surge una necesidad crítica del negocio. ¿Qué haces?",
    options: [
      ["A", "Mantienes la promesa, aunque la situación se complique.", 3],
      ["B", "Les pides que se queden porque la necesidad del negocio está primero.", 2],
      ["C", "Explicas el cambio, reconoces explícitamente el compromiso cumplido y construyes con el equipo una alternativa o compensación concreta.", 4],
      ["D", "Preguntas quiénes pueden quedarse voluntariamente y trabajas solo con ellos.", 1]
    ]
  },
  {
    text: "Una persona de mucha confianza y buen desempeño comete una falta que, en otra persona, normalmente corregirías de inmediato. ¿Qué haces?",
    options: [
      ["A", "Le das mayor margen por su historial y conversas con ella de manera informal.", 2],
      ["B", "Abordas la falta con el mismo estándar, escuchas el contexto y acuerdas la corrección correspondiente.", 4],
      ["C", "Le adviertes en privado que esta vez lo dejarás pasar, pero que no vuelva a ocurrir.", 3],
      ["D", "Evitas intervenir porque una conversación formal podría afectar la relación de confianza.", 1]
    ]
  }
];

const resultBands = [
  {
    min: 24,
    title: "Construyes confianza de forma consistente",
    message: "Tus decisiones tienden a ser claras, transparentes y coherentes. Tu equipo probablemente puede anticipar tus criterios incluso cuando debes cambiar un acuerdo. El reto es sostener esa consistencia bajo presión."
  },
  {
    min: 17,
    title: "Estás en camino de fortalecer la confianza",
    message: "Muestras prácticas que construyen confianza, aunque algunas respuestas pueden variar según la presión, la urgencia o la persona involucrada. Enfócate en explicar criterios, renegociar compromisos a tiempo y sostener estándares equivalentes."
  },
  {
    min: 7,
    title: "Necesitas fortalecer la predictibilidad de tu liderazgo",
    message: "Algunas decisiones podrían resultar difíciles de anticipar para tu equipo. Esto no define tu liderazgo: señala una oportunidad concreta para comunicar antes, hacer visibles tus criterios y actuar con mayor consistencia."
  }
];

const form = document.getElementById("assessmentForm");
const questionsContainer = document.getElementById("questions");
const resultSection = document.getElementById("result");
const submitButton = document.getElementById("submitButton");
const formError = document.getElementById("formError");
const reflection = document.getElementById("reflection");
const sessionLabel = new URLSearchParams(window.location.search).get("sesion")?.trim().slice(0, 100) || null;

function renderQuestions() {
  questionsContainer.innerHTML = questions.map((question, index) => `
    <section class="question-card" id="question-${index + 1}">
      <p class="question-number">SITUACIÓN ${index + 1} DE ${questions.length}</p>
      <h2>${question.text}</h2>
      <div role="radiogroup" aria-label="Situación ${index + 1}">
        ${question.options.map(([letter, text, score]) => `
          <label class="option">
            <input type="radio" name="q${index + 1}" value="${letter}" data-score="${score}">
            <span class="option__text"><span class="option__letter">${letter}.</span> ${text}</span>
          </label>
        `).join("")}
      </div>
      <p class="question-error" hidden>Selecciona una alternativa para continuar.</p>
    </section>
  `).join("");
}

function validateAnswers() {
  let firstInvalid = null;
  questions.forEach((_, index) => {
    const card = document.getElementById(`question-${index + 1}`);
    const answered = form.querySelector(`input[name="q${index + 1}"]:checked`);
    card.classList.toggle("invalid", !answered);
    card.querySelector(".question-error").hidden = Boolean(answered);
    if (!answered && !firstInvalid) firstInvalid = card;
  });
  if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  return !firstInvalid;
}

function getPayload() {
  const payload = { session_label: sessionLabel, reflection: reflection.value.trim() || null };
  let total = 0;
  questions.forEach((_, index) => {
    const selected = form.querySelector(`input[name="q${index + 1}"]:checked`);
    payload[`q${index + 1}`] = selected.value;
    total += Number(selected.dataset.score);
  });
  return { payload, total };
}

async function saveResponse(payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/leadership_confidence_responses`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`No se pudo guardar la respuesta (${response.status}).`);
}

function showResult(total) {
  const band = resultBands.find(item => total >= item.min);
  document.getElementById("resultTitle").textContent = band.title;
  document.getElementById("scoreValue").textContent = total;
  document.getElementById("resultMessage").textContent = band.message;
  resultSection.hidden = false;
  requestAnimationFrame(() => {
    document.getElementById("meterFill").style.width = `${(total / 28) * 100}%`;
  });
  form.hidden = true;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("change", event => {
  if (!event.target.matches('input[type="radio"]')) return;
  const card = event.target.closest(".question-card");
  card.classList.remove("invalid");
  card.querySelector(".question-error").hidden = true;
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  formError.hidden = true;
  if (!validateAnswers()) return;

  const { payload, total } = getPayload();
  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Guardando respuesta…";
  try {
    await saveResponse(payload);
    showResult(total);
  } catch (error) {
    formError.textContent = "No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo nuevamente.";
    formError.hidden = false;
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Ver mi resultado";
  }
});

document.getElementById("restartButton").addEventListener("click", () => {
  form.reset();
  document.getElementById("charCount").textContent = "0";
  resultSection.hidden = true;
  form.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

reflection.addEventListener("input", () => {
  document.getElementById("charCount").textContent = reflection.value.length;
});

if (sessionLabel) {
  const badge = document.getElementById("sessionBadge");
  badge.textContent = `Sesión: ${sessionLabel}`;
  badge.hidden = false;
}

renderQuestions();
