const {
  RekognitionClient,
  DetectFacesCommand,
} = require("@aws-sdk/client-rekognition");

let rekognitionClient;

const getRekognitionClient = () => {
  if (!process.env.AWS_REGION) {
    throw new Error("La variable de entorno AWS_REGION no esta configurada.");
  }

  if (!rekognitionClient) {
    rekognitionClient = new RekognitionClient({
      region: process.env.AWS_REGION,
    });
  }

  return rekognitionClient;
};

const analyzeFaceEmotions = async (imageBuffer) => {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new Error("No se recibio un buffer de imagen valido.");
  }

  const command = new DetectFacesCommand({
    Image: {
      Bytes: imageBuffer,
    },
    Attributes: ["ALL"],
  });

  const rekognitionClient = getRekognitionClient();
  const response = await rekognitionClient.send(command);

  if (!response.FaceDetails || response.FaceDetails.length === 0) {
    return {
      faceDetected: false,
      dominantEmotion: null,
      confidence: null,
      emotions: [],
      message: "No se detectó un rostro en la imagen.",
    };
  }

  const face = response.FaceDetails[0];
  const emotions = face.Emotions || [];

  if (emotions.length === 0) {
    return {
      faceDetected: true,
      dominantEmotion: null,
      confidence: null,
      emotions: [],
      message: "Se detectó un rostro, pero no se identificaron emociones.",
    };
  }

  const dominantEmotion = emotions.reduce((max, emotion) => {
    return emotion.Confidence > max.Confidence ? emotion : max;
  }, emotions[0]);

  return {
    faceDetected: true,
    dominantEmotion: dominantEmotion.Type,
    confidence: dominantEmotion.Confidence,
    emotions: emotions.map((emotion) => ({
      type: emotion.Type,
      confidence: emotion.Confidence,
    })),
    message: "Análisis de imagen realizado correctamente.",
  };
};

module.exports = {
  analyzeFaceEmotions,
};
