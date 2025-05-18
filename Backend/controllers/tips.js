// controllers/tips.js

const Tips = require("../models/tips");

// Controlador para obtener un tip aleatorio según el estado de ánimo y las actividades
const getTips = async (req, res) => {
  try {
    const { moodState, activities } = req.query; // Obtener el estado de ánimo y actividades desde los parámetros de la consulta

    // Verificar si se ha proporcionado el estado
    if (!moodState) {
      return res.status(400).json({ error: "Falta el parámetro estado" });
    }

    // Verificar que el estado es válido
    if (!["Mal", "Regular", "Bien", "Excelente"].includes(moodState)) {
      return res.status(400).json({
        error:
          "Estado inválido. Los estados válidos son: Mal, Regular, Bien, Excelente.",
      });
    }

    // Convertir actividades en un array (en caso de que se pase como string)
    let actividadesArray = [];
    if (activities) {
      actividadesArray = activities.split(",").map((act) => act.trim());
    }

    // Buscar el documento que coincide con el estado proporcionado
    const tip = await Tips.findOne({ moodState });

    // Si no se encuentra el estado, devolver un error
    if (!tip) {
      return res.status(404).json({
        mensaje: "No se encontraron consejos para el estado proporcionado.",
      });
    }

    let consejoElegido;

    if (actividadesArray.length > 0) {
      // Filtrar los consejos que coinciden con las actividades seleccionadas
      const consejosRelevantes = tip.activityTips.filter((ca) =>
        ca.activities.some((act) => actividadesArray.includes(act))
      );

      if (consejosRelevantes.length > 0) {
        // Seleccionar un tip relevante aleatorio
        consejoElegido =
          consejosRelevantes[
            Math.floor(Math.random() * consejosRelevantes.length)
          ].tip;
      } else if (tip.generalTips.length > 0) {
        // Si no hay consejos relevantes, elegir un tip general
        consejoElegido =
          tip.generalTips[Math.floor(Math.random() * tip.generalTips.length)];
      } else {
        return res.status(404).json({
          mensaje:
            "No se encontraron consejos para las actividades proporcionadas.",
        });
      }
    } else if (tip.generalTips.length > 0) {
      // Si no se proporcionaron actividades, elegir un tip general
      consejoElegido =
        tip.generalTips[Math.floor(Math.random() * tip.generalTips.length)];
    } else {
      return res.status(404).json({
        mensaje: "No se encontraron consejos generales para este estado.",
      });
    }

    // Devolver el tip elegido
    res.json({ tip: consejoElegido });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tip" });
  }
};

const postTips = async (req, res) => {
  try {
    const consejos = req.body; // Suponemos que req.body es un array de objetos

    // Validar que se haya enviado un array de consejos
    if (!Array.isArray(consejos)) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un array de consejos." });
    }

    let nuevosConsejosGuardados = 0;
    let consejosDuplicados = 0;

    // Iterar sobre cada tip para guardarlo
    for (const tip of consejos) {
      const { moodState, activityTips, generalTips } = tip;

      // Validar que estado y activityTips existen
      if (!moodState || !activityTips) {
        console.error("Error: Falta moodState o activityTips en el tip:", tip);
        return res.status(400).json({
          error: "Cada tip debe tener un moodState y activityTips.",
        });
      }

      // Verificar que el estado sea válido
      if (!["Mal", "Regular", "Bien", "Excelente"].includes(moodState)) {
        console.error(`Estado inválido: ${moodState}`);
        return res.status(400).json({
          error: `Estado inválido: ${moodState}. Los estados válidos son: Mal, Regular, Bien, Excelente.`,
        });
      }

      try {
        // Verificar si ya existe un documento para ese estado
        const existe = await Tips.findOne({ moodState });

        if (existe) {
          console.log(
            `Ya existe un registro para el estado: "${moodState}". Actualizando datos...`
          );

          // Actualizar activityTips y generalTips
          existe.activityTips = activityTips;
          existe.generalTips = generalTips || [];

          await existe.save();
          consejosDuplicados++;
        } else {
          const nuevoConsejo = new Tips({
            moodState,
            activityTips,
            generalTips: generalTips || [],
          });
          await nuevoConsejo.save();
          nuevosConsejosGuardados++;
          console.log(`Consejo guardado: Estado = "${moodState}"`);
        }
      } catch (dbError) {
        console.error(
          `Error al consultar o guardar el tip para el estado "${moodState}":`,
          dbError
        );
      }
    }

    // Definir la respuesta basada en los resultados
    if (nuevosConsejosGuardados > 0 && consejosDuplicados === 0) {
      res
        .status(201)
        .json({ mensaje: "Todos los consejos fueron guardados exitosamente." });
    } else if (nuevosConsejosGuardados > 0 && consejosDuplicados > 0) {
      res.status(201).json({
        mensaje:
          "Algunos consejos fueron guardados o actualizados exitosamente.",
        nuevosConsejos: nuevosConsejosGuardados,
        actualizados: consejosDuplicados,
      });
    } else if (nuevosConsejosGuardados === 0 && consejosDuplicados > 0) {
      res.status(200).json({
        mensaje: "Todos los consejos fueron actualizados exitosamente.",
      });
    } else {
      res
        .status(500)
        .json({ mensaje: "Error inesperado al procesar los consejos." });
    }
  } catch (error) {
    console.error("Error inesperado al guardar los consejos:", error);
    res.status(500).json({
      error: "Error al guardar los consejos.",
      detalle: error.message,
    });
  }
};

// Controlador para obtener todos los consejos disponibles en la base de datos
const getAllTips = async (req, res) => {
  try {
    // Obtener todos los consejos
    const tips = await Tips.find();

    // Verificar si se encontraron consejos
    if (tips.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron consejos en la base de datos." });
    }

    // Enviar todos los consejos como respuesta
    res.status(200).json(tips);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los consejos." });
  }
};

module.exports = {
  getTips,
  postTips,
  getAllTips,
};
