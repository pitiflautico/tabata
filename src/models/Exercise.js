/**
 * Modelo de Ejercicio
 * Representa un ejercicio individual con todos sus atributos
 */

export const MuscleGroup = {
  LEGS: 'piernas',
  GLUTES: 'glúteos',
  CALVES: 'gemelos',
  HAMSTRINGS: 'femorales',
  ADDUCTORS: 'aductores',
  SHOULDERS: 'hombros',
  CHEST: 'pecho',
  BACK: 'espalda',
  ARMS: 'brazos',
  CORE: 'core',
  FULL_BODY: 'cuerpo completo'
};

export const ExerciseType = {
  BODYWEIGHT: 'peso corporal',
  KETTLEBELL: 'kettlebell',
  DUMBBELL: 'mancuernas',
  BENCH: 'banco',
  COMBINED: 'combinado'
};

export const IntensityLevel = {
  LOW: 1,
  MEDIUM_LOW: 2,
  MEDIUM: 3,
  MEDIUM_HIGH: 4,
  HIGH: 5
};

/**
 * Clase Exercise
 */
export class Exercise {
  constructor({
    id,
    name,
    description,
    muscleGroups = [],
    type = ExerciseType.BODYWEIGHT,
    cardioIndex = 2,
    intensityLevel = IntensityLevel.MEDIUM,
    equipment = [],
    variations = [],
    frames = [],
    isCombo = false
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.muscleGroups = muscleGroups; // Array de grupos musculares
    this.type = type;
    this.cardioIndex = cardioIndex; // 1-5
    this.intensityLevel = intensityLevel;
    this.equipment = equipment; // Array de equipamiento necesario
    this.variations = variations; // Array de variaciones del ejercicio
    this.frames = frames; // Array de frames visuales
    this.isCombo = isCombo; // Si es ejercicio combinado (tren superior + inferior)
  }

  /**
   * Verifica si el ejercicio trabaja un grupo muscular específico
   */
  worksMuscleGroup(muscleGroup) {
    return this.muscleGroups.includes(muscleGroup);
  }

  /**
   * Verifica si el ejercicio es de alta intensidad
   */
  isHighIntensity() {
    return this.cardioIndex >= 4;
  }

  /**
   * Verifica si el ejercicio es de baja intensidad
   */
  isLowIntensity() {
    return this.cardioIndex <= 2;
  }

  /**
   * Obtiene la duración estimada del ejercicio basada en frames
   */
  getEstimatedDuration() {
    return this.frames.length * 2; // Aproximadamente 2 segundos por frame
  }
}

/**
 * Clase Frame - Representa una etapa visual del ejercicio
 */
export class ExerciseFrame {
  constructor({
    id,
    exerciseId,
    order,
    title,
    description,
    imageUrl = null,
    duration = 2 // segundos
  }) {
    this.id = id;
    this.exerciseId = exerciseId;
    this.order = order; // 1, 2, 3, etc.
    this.title = title; // "Posición inicial", "Bajada", "Subida"
    this.description = description;
    this.imageUrl = imageUrl; // URL o referencia a imagen/avatar 3D
    this.duration = duration;
  }
}
