const compareMoodWithEmotion = (mood, dominantEmotion) => {
  const positiveMoods = ["Bien", "Excelente"];
  const supportMoods = ["Mal", "Regular"];

  const positiveEmotions = ["HAPPY", "CALM"];
  const supportEmotions = ["SAD", "ANGRY", "FEAR", "CONFUSED", "DISGUSTED"];

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
      supportMessage:
        "Tu registro coincide con una expresión positiva detectada de forma referencial.",
    };
  }

  if (
    supportMoods.includes(mood) &&
    supportEmotions.includes(dominantEmotion)
  ) {
    return {
      comparisonResult: "coincidencia_de_apoyo",
      supportMessage:
        "Tu registro y el análisis referencial sugieren que podrías necesitar un momento de apoyo. Recuerda que puedes revisar los recursos disponibles en la aplicación.",
    };
  }

  if (
    positiveMoods.includes(mood) &&
    supportEmotions.includes(dominantEmotion)
  ) {
    return {
      comparisonResult: "posible_diferencia",
      supportMessage:
        "Tu registro fue positivo, aunque el análisis referencial detectó una expresión distinta. Este resultado no representa un diagnóstico.",
    };
  }

  if (
    supportMoods.includes(mood) &&
    positiveEmotions.includes(dominantEmotion)
  ) {
    return {
      comparisonResult: "diferencia_referencial",
      supportMessage:
        "Tu registro fue guardado correctamente. La imagen mostró una expresión distinta de forma referencial, pero tu registro manual sigue siendo el dato principal.",
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