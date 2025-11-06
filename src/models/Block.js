/**
 * Modelo de Bloque Tabata
 * Representa un bloque de entrenamiento con varios ejercicios
 */

export const TabataRatio = {
  CLASSIC: { work: 40, rest: 20 }, // 2:1
  BEGINNER: { work: 30, rest: 30 }, // 1:1
  ADVANCED: { work: 50, rest: 10 } // 5:1
};

/**
 * Clase Block - Bloque de entrenamiento Tabata
 */
export class TabataBlock {
  constructor({
    id,
    name,
    exercises = [], // Array de Exercise
    ratio = TabataRatio.CLASSIC,
    rounds = 1 // Cuántas veces se repite el bloque
  }) {
    this.id = id;
    this.name = name;
    this.exercises = exercises;
    this.ratio = ratio;
    this.rounds = rounds;
  }

  /**
   * Calcula la duración total del bloque en segundos
   */
  getTotalDuration() {
    const exerciseDuration = this.ratio.work + this.ratio.rest;
    const blockDuration = exerciseDuration * this.exercises.length;
    return blockDuration * this.rounds;
  }

  /**
   * Calcula la duración total en minutos
   */
  getTotalDurationMinutes() {
    return Math.ceil(this.getTotalDuration() / 60);
  }

  /**
   * Verifica si el bloque está equilibrado
   * (no repite grupos musculares consecutivos)
   */
  isBalanced() {
    for (let i = 1; i < this.exercises.length; i++) {
      const prev = this.exercises[i - 1];
      const curr = this.exercises[i];

      // Verificar si hay grupos musculares repetidos consecutivamente
      const overlap = prev.muscleGroups.some(mg =>
        curr.muscleGroups.includes(mg)
      );

      if (overlap) return false;
    }
    return true;
  }

  /**
   * Obtiene el promedio de intensidad cardio del bloque
   */
  getAverageCardioIndex() {
    const sum = this.exercises.reduce((acc, ex) => acc + ex.cardioIndex, 0);
    return sum / this.exercises.length;
  }
}

/**
 * Clase Workout - Sesión completa de entrenamiento
 */
export class Workout {
  constructor({
    id,
    name,
    blocks = [], // Array de TabataBlock
    date = new Date()
  }) {
    this.id = id;
    this.name = name;
    this.blocks = blocks;
    this.date = date;
  }

  /**
   * Calcula la duración total del entrenamiento
   */
  getTotalDuration() {
    return this.blocks.reduce((acc, block) => acc + block.getTotalDuration(), 0);
  }

  /**
   * Calcula la duración total en minutos
   */
  getTotalDurationMinutes() {
    return Math.ceil(this.getTotalDuration() / 60);
  }

  /**
   * Cuenta el total de ejercicios únicos
   */
  getTotalExercises() {
    const uniqueExercises = new Set();
    this.blocks.forEach(block => {
      block.exercises.forEach(ex => uniqueExercises.add(ex.id));
    });
    return uniqueExercises.size;
  }
}
