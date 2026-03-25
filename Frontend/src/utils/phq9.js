
// src/utils/phq9.js

/**
 * Dado un puntaje total del PHQ-9 (0–27),
 * devuelve la categoría de severidad.
 */


export function getSeverity(totalScore) {
  if (totalScore >= 20) return "Grave";
  if (totalScore >= 15) return "Moderadamente grave";
  if (totalScore >= 10) return "Moderado";
  if (totalScore >= 5)  return "Leve";
                        return "Normal";
}
