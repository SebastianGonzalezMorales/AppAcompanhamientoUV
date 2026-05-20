const emotionLabels = {
  HAPPY: "alegría",
  CALM: "tranquilidad",
  SAD: "tristeza",
  ANGRY: "enojo o tensión",
  FEAR: "preocupación o temor",
  CONFUSED: "confusión",
  DISGUSTED: "incomodidad",
  SURPRISED: "sorpresa",
  UNKNOWN: "una expresión no identificada con claridad",
};

const getEmotionLabel = (dominantEmotion) => {
  return (
    emotionLabels[dominantEmotion] ||
    "una expresión no identificada con claridad"
  );
};

const compareMoodWithEmotion = (mood, dominantEmotion) => {
  const positiveMoods = ["Bien", "Excelente"];
  const supportMoods = ["Mal", "Regular"];

  const positiveEmotions = ["HAPPY", "CALM"];
  const supportEmotions = ["SAD", "ANGRY", "FEAR", "CONFUSED", "DISGUSTED"];
  const neutralEmotions = ["SURPRISED", "UNKNOWN"];
  const emotionLabel = getEmotionLabel(dominantEmotion);

  if (!dominantEmotion) {
    return {
      comparisonResult: "sin_analisis",
      supportMessage:
        "Tu estado de ánimo fue registrado correctamente. No se obtuvo un análisis complementario de imagen.",
    };
  }

  if (
    positiveMoods.includes(mood) &&
    positiveEmotions.includes(dominantEmotion)
  ) {
    return {
      comparisonResult: "coincidencia_positiva",
      supportMessage: `La imagen mostró una expresión asociada a ${emotionLabel}. Esto coincide con tu registro. Sigue así; reconocer estos momentos también ayuda a cuidar tu bienestar.`,
    };
  }

  if (
    supportMoods.includes(mood) &&
    supportEmotions.includes(dominantEmotion)
  ) {
    return {
      comparisonResult: "coincidencia_de_apoyo",
      supportMessage: `La imagen mostró una expresión asociada a ${emotionLabel}. Esto coincide con tu registro. Si sientes que necesitas apoyo, puedes revisar las opciones de contacto disponibles en la aplicación.`,
    };
  }

  if (
    positiveMoods.includes(mood) &&
    supportEmotions.includes(dominantEmotion)
  ) {
    return {
      comparisonResult: "posible_diferencia",
      supportMessage: `Registraste un estado positivo, aunque la imagen mostró una expresión asociada a ${emotionLabel}. Puede ser útil tomarlo como una señal para reflexionar, no como una conclusión.`,
    };
  }

  if (
    supportMoods.includes(mood) &&
    positiveEmotions.includes(dominantEmotion)
  ) {
    return {
      comparisonResult: "diferencia_referencial",
      supportMessage: `Registraste un estado de ánimo bajo, aunque la imagen mostró una expresión asociada a ${emotionLabel}. Tu registro manual sigue siendo el dato principal.`,
    };
  }

  if (neutralEmotions.includes(dominantEmotion)) {
    return {
      comparisonResult: "resultado_referencial",
      supportMessage: `La imagen mostró una expresión asociada a ${emotionLabel}. Este dato queda como información complementaria para tu registro.`,
    };
  }

  return {
    comparisonResult: "resultado_referencial",
    supportMessage:
      "El análisis de imagen fue registrado como información complementaria.",
  };
};

module.exports = {
  compareMoodWithEmotion,
};
