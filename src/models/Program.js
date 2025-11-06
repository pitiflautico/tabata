/**
 * Modelo de Programa de Entrenamiento Multi-Semana
 */

export class TrainingProgram {
  constructor({
    id,
    name,
    description,
    durationWeeks,
    level, // 'beginner', 'intermediate', 'advanced'
    weeks = [],
    currentWeek = 1,
    currentDay = 1,
    startDate = null,
    completedWorkouts = []
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.durationWeeks = durationWeeks;
    this.level = level;
    this.weeks = weeks; // Array de Week
    this.currentWeek = currentWeek;
    this.currentDay = currentDay;
    this.startDate = startDate;
    this.completedWorkouts = completedWorkouts;
  }

  /**
   * Obtiene la semana actual
   */
  getCurrentWeek() {
    return this.weeks[this.currentWeek - 1];
  }

  /**
   * Obtiene el día actual
   */
  getCurrentDay() {
    const week = this.getCurrentWeek();
    return week?.days[this.currentDay - 1];
  }

  /**
   * Marca un entrenamiento como completado
   */
  completeCurrentWorkout() {
    this.completedWorkouts.push({
      week: this.currentWeek,
      day: this.currentDay,
      date: new Date()
    });

    // Avanzar al siguiente día
    this.advanceToNextDay();
  }

  /**
   * Avanza al siguiente día del programa
   */
  advanceToNextDay() {
    const currentWeek = this.getCurrentWeek();

    if (this.currentDay < currentWeek.days.length) {
      this.currentDay++;
    } else if (this.currentWeek < this.weeks.length) {
      // Siguiente semana
      this.currentWeek++;
      this.currentDay = 1;
    } else {
      // Programa completado
      return { completed: true };
    }

    return { completed: false };
  }

  /**
   * Calcula el progreso del programa (0-100)
   */
  getProgress() {
    const totalDays = this.weeks.reduce((sum, week) => sum + week.days.length, 0);
    const completedDays = this.completedWorkouts.length;
    return (completedDays / totalDays) * 100;
  }

  /**
   * Verifica si el programa está completado
   */
  isCompleted() {
    return this.getProgress() >= 100;
  }

  /**
   * Obtiene los días de descanso de la semana actual
   */
  getCurrentWeekRestDays() {
    const week = this.getCurrentWeek();
    return week?.restDays || [];
  }
}

/**
 * Clase Week - Semana del programa
 */
export class ProgramWeek {
  constructor({
    number,
    focus,
    days = [],
    restDays = []
  }) {
    this.number = number;
    this.focus = focus; // "Adaptación", "Progresión", "Intensificación", etc.
    this.days = days; // Array de ProgramDay
    this.restDays = restDays; // Array de números [6, 7] para sábado y domingo
  }
}

/**
 * Clase ProgramDay - Día del programa
 */
export class ProgramDay {
  constructor({
    dayNumber,
    name,
    description,
    workoutConfig = {} // Configuración para generar el workout
  }) {
    this.dayNumber = dayNumber;
    this.name = name;
    this.description = description;
    this.workoutConfig = workoutConfig;
  }
}
