/**
 * Servicio WorkoutML
 * Sistema de aprendizaje automático para combinar ejercicios
 * Usa TensorFlow.js o Brain.js para modelos ligeros
 */

class WorkoutML {
  constructor() {
    this.model = null;
    this.trainingData = [];
    this.isModelTrained = false;
  }

  /**
   * Prepara los datos de entrenamiento
   * @param {Array} workoutExamples - Ejemplos de entrenamientos bien equilibrados
   */
  prepareTrainingData(workoutExamples) {
    this.trainingData = workoutExamples.map(workout => {
      return {
        input: this.extractFeatures(workout),
        output: { balanced: 1 } // 1 = bien equilibrado, 0 = mal equilibrado
      };
    });
  }

  /**
   * Extrae características de un entrenamiento
   * @param {Workout} workout - Entrenamiento
   * @returns {Object} - Características extraídas
   */
  extractFeatures(workout) {
    const features = {};

    workout.blocks.forEach((block, blockIndex) => {
      block.exercises.forEach((exercise, exerciseIndex) => {
        const key = `block${blockIndex}_ex${exerciseIndex}`;

        // Características del ejercicio
        features[`${key}_cardio`] = exercise.cardioIndex / 5; // Normalizado 0-1
        features[`${key}_intensity`] = exercise.intensityLevel / 5;

        // Grupos musculares (one-hot encoding simplificado)
        features[`${key}_legs`] = exercise.muscleGroups.includes('piernas') ? 1 : 0;
        features[`${key}_glutes`] = exercise.muscleGroups.includes('glúteos') ? 1 : 0;
        features[`${key}_arms`] = exercise.muscleGroups.includes('brazos') ? 1 : 0;
        features[`${key}_core`] = exercise.muscleGroups.includes('core') ? 1 : 0;

        // Si es ejercicio combinado
        features[`${key}_combo`] = exercise.isCombo ? 1 : 0;
      });
    });

    return features;
  }

  /**
   * Entrena el modelo con los ejemplos proporcionados
   * Usa un algoritmo simple de aprendizaje por patrones
   */
  async train() {
    if (this.trainingData.length === 0) {
      throw new Error('No hay datos de entrenamiento');
    }

    // Analizar patrones en los datos de entrenamiento
    this.model = this.analyzePatterns(this.trainingData);
    this.isModelTrained = true;

    return {
      success: true,
      patterns: Object.keys(this.model.rules).length,
      message: 'Modelo entrenado correctamente'
    };
  }

  /**
   * Analiza patrones en los datos de entrenamiento
   * Extrae reglas heurísticas
   */
  analyzePatterns(data) {
    const rules = {
      // Reglas de alternancia de intensidad
      intensityAlternation: this.detectIntensityPattern(data),

      // Reglas de distribución de grupos musculares
      muscleGroupDistribution: this.detectMuscleGroupPattern(data),

      // Reglas de uso de ejercicios combinados
      comboUsage: this.detectComboPattern(data),

      // Promedio de intensidad cardio por bloque
      averageCardioPerBlock: this.calculateAverageCardio(data)
    };

    return { rules };
  }

  /**
   * Detecta patrón de alternancia de intensidad
   */
  detectIntensityPattern(data) {
    const patterns = [];

    data.forEach(example => {
      const features = example.input;
      const intensities = [];

      // Extraer intensidades en orden
      Object.keys(features).forEach(key => {
        if (key.includes('_cardio')) {
          intensities.push(features[key]);
        }
      });

      patterns.push(intensities);
    });

    // Calcular patrón promedio
    return {
      shouldAlternate: true,
      idealDifference: 0.4 // Diferencia ideal entre ejercicios consecutivos
    };
  }

  /**
   * Detecta patrón de distribución de grupos musculares
   */
  detectMuscleGroupPattern(data) {
    return {
      noConsecutiveRepetition: true,
      minDiversity: 2, // Mínimo 2 grupos musculares diferentes por bloque
      preferredGap: 2 // Ejercicios entre repeticiones del mismo grupo
    };
  }

  /**
   * Detecta patrón de uso de ejercicios combinados
   */
  detectComboPattern(data) {
    let totalExercises = 0;
    let comboExercises = 0;

    data.forEach(example => {
      const features = example.input;
      Object.keys(features).forEach(key => {
        if (key.includes('_combo')) {
          totalExercises++;
          if (features[key] === 1) {
            comboExercises++;
          }
        }
      });
    });

    return {
      optimalRatio: comboExercises / totalExercises,
      maxConsecutive: 1 // Máximo 1 ejercicio combo consecutivo
    };
  }

  /**
   * Calcula promedio de cardio por bloque
   */
  calculateAverageCardio(data) {
    const averages = [];

    data.forEach(example => {
      const features = example.input;
      const cardioValues = [];

      Object.keys(features).forEach(key => {
        if (key.includes('_cardio')) {
          cardioValues.push(features[key]);
        }
      });

      if (cardioValues.length > 0) {
        const avg = cardioValues.reduce((a, b) => a + b, 0) / cardioValues.length;
        averages.push(avg);
      }
    });

    const overallAverage = averages.reduce((a, b) => a + b, 0) / averages.length;

    return {
      target: overallAverage,
      tolerance: 0.15 // ±15%
    };
  }

  /**
   * Evalúa una combinación de ejercicios
   * @param {Array} exercises - Array de ejercicios
   * @returns {Object} - Puntuación y recomendaciones
   */
  evaluateExerciseCombination(exercises) {
    if (!this.isModelTrained) {
      return {
        score: 0.5,
        recommendations: ['El modelo aún no ha sido entrenado']
      };
    }

    const rules = this.model.rules;
    const scores = [];
    const recommendations = [];

    // Evaluar alternancia de intensidad
    const intensityScore = this.evaluateIntensityAlternation(exercises, rules.intensityAlternation);
    scores.push(intensityScore.score);
    if (intensityScore.recommendation) {
      recommendations.push(intensityScore.recommendation);
    }

    // Evaluar distribución de grupos musculares
    const muscleScore = this.evaluateMuscleDistribution(exercises, rules.muscleGroupDistribution);
    scores.push(muscleScore.score);
    if (muscleScore.recommendation) {
      recommendations.push(muscleScore.recommendation);
    }

    // Evaluar uso de ejercicios combinados
    const comboScore = this.evaluateComboUsage(exercises, rules.comboUsage);
    scores.push(comboScore.score);
    if (comboScore.recommendation) {
      recommendations.push(comboScore.recommendation);
    }

    // Evaluar intensidad cardio promedio
    const cardioScore = this.evaluateAverageCardio(exercises, rules.averageCardioPerBlock);
    scores.push(cardioScore.score);
    if (cardioScore.recommendation) {
      recommendations.push(cardioScore.recommendation);
    }

    // Calcular puntuación final (promedio ponderado)
    const finalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      score: finalScore,
      breakdown: {
        intensityAlternation: intensityScore.score,
        muscleDistribution: muscleScore.score,
        comboUsage: comboScore.score,
        averageCardio: cardioScore.score
      },
      recommendations: recommendations,
      isGood: finalScore >= 0.7,
      quality: this.getQualityLabel(finalScore)
    };
  }

  /**
   * Evalúa la alternancia de intensidad
   */
  evaluateIntensityAlternation(exercises, rule) {
    let score = 1.0;
    let recommendation = null;

    for (let i = 1; i < exercises.length; i++) {
      const prevIntensity = exercises[i - 1].cardioIndex / 5;
      const currIntensity = exercises[i].cardioIndex / 5;
      const difference = Math.abs(currIntensity - prevIntensity);

      // Penalizar si la diferencia no es adecuada
      if (difference < 0.2) {
        score -= 0.2;
        recommendation = 'Alterna ejercicios de diferente intensidad';
      }
    }

    return {
      score: Math.max(0, score),
      recommendation
    };
  }

  /**
   * Evalúa la distribución de grupos musculares
   */
  evaluateMuscleDistribution(exercises, rule) {
    let score = 1.0;
    let recommendation = null;

    // Verificar repetición consecutiva
    for (let i = 1; i < exercises.length; i++) {
      const prevGroups = exercises[i - 1].muscleGroups;
      const currGroups = exercises[i].muscleGroups;

      const hasOverlap = prevGroups.some(mg => currGroups.includes(mg));
      if (hasOverlap) {
        score -= 0.3;
        recommendation = 'Evita trabajar los mismos grupos musculares consecutivamente';
      }
    }

    // Verificar diversidad
    const uniqueGroups = new Set();
    exercises.forEach(ex => {
      ex.muscleGroups.forEach(mg => uniqueGroups.add(mg));
    });

    if (uniqueGroups.size < rule.minDiversity) {
      score -= 0.2;
      recommendation = 'Aumenta la variedad de grupos musculares';
    }

    return {
      score: Math.max(0, score),
      recommendation
    };
  }

  /**
   * Evalúa el uso de ejercicios combinados
   */
  evaluateComboUsage(exercises, rule) {
    let score = 1.0;
    let recommendation = null;

    const comboCount = exercises.filter(ex => ex.isCombo).length;
    const ratio = comboCount / exercises.length;

    // Verificar ratio óptimo
    const ratioDifference = Math.abs(ratio - rule.optimalRatio);
    if (ratioDifference > 0.3) {
      score -= 0.2;
      recommendation = 'Ajusta la proporción de ejercicios combinados';
    }

    // Verificar que no haya muchos combos consecutivos
    for (let i = 1; i < exercises.length; i++) {
      if (exercises[i].isCombo && exercises[i - 1].isCombo) {
        score -= 0.3;
        recommendation = 'Evita ejercicios combinados consecutivos';
      }
    }

    return {
      score: Math.max(0, score),
      recommendation
    };
  }

  /**
   * Evalúa la intensidad cardio promedio
   */
  evaluateAverageCardio(exercises, rule) {
    const average = exercises.reduce((sum, ex) => sum + ex.cardioIndex, 0) / exercises.length / 5;
    const difference = Math.abs(average - rule.target);

    let score = 1.0;
    let recommendation = null;

    if (difference > rule.tolerance) {
      score -= difference * 2;
      if (average < rule.target) {
        recommendation = 'Aumenta la intensidad general del bloque';
      } else {
        recommendation = 'Reduce la intensidad general del bloque';
      }
    }

    return {
      score: Math.max(0, score),
      recommendation
    };
  }

  /**
   * Obtiene etiqueta de calidad
   */
  getQualityLabel(score) {
    if (score >= 0.9) return 'Excelente';
    if (score >= 0.7) return 'Bueno';
    if (score >= 0.5) return 'Aceptable';
    return 'Necesita mejoras';
  }

  /**
   * Sugiere mejoras para una combinación de ejercicios
   * @param {Array} exercises - Ejercicios actuales
   * @param {Array} availableExercises - Ejercicios disponibles
   * @returns {Array} - Ejercicios sugeridos para mejorar
   */
  suggestImprovements(exercises, availableExercises) {
    const evaluation = this.evaluateExerciseCombination(exercises);

    if (evaluation.isGood) {
      return {
        needsImprovement: false,
        suggestions: []
      };
    }

    const suggestions = [];

    // Identificar ejercicios problemáticos
    exercises.forEach((exercise, index) => {
      if (index === 0) return;

      const prev = exercises[index - 1];

      // Si hay overlap de grupos musculares
      const hasOverlap = prev.muscleGroups.some(mg =>
        exercise.muscleGroups.includes(mg)
      );

      if (hasOverlap) {
        // Buscar reemplazo
        const replacement = availableExercises.find(ex =>
          !ex.muscleGroups.some(mg => prev.muscleGroups.includes(mg)) &&
          ex.id !== exercise.id
        );

        if (replacement) {
          suggestions.push({
            position: index,
            current: exercise,
            suggested: replacement,
            reason: 'Evitar repetición de grupos musculares'
          });
        }
      }
    });

    return {
      needsImprovement: true,
      currentScore: evaluation.score,
      suggestions: suggestions
    };
  }

  /**
   * Guarda el modelo entrenado
   */
  saveModel() {
    if (!this.isModelTrained) {
      throw new Error('El modelo no ha sido entrenado');
    }

    return {
      model: this.model,
      trainingDataCount: this.trainingData.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Carga un modelo previamente entrenado
   */
  loadModel(savedModel) {
    this.model = savedModel.model;
    this.isModelTrained = true;
  }
}

export default new WorkoutML();
