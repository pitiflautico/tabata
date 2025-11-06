/**
 * Modelo de progresión del usuario
 */

export class UserProgress {
  constructor({
    id,
    userId,
    level = 1,
    experiencePoints = 0,
    workoutsCompleted = 0,
    totalMinutes = 0,
    totalCalories = 0,
    currentStreak = 0,
    longestStreak = 0,
    preferences = {},
    performanceHistory = []
  }) {
    this.id = id;
    this.userId = userId;
    this.level = level;
    this.experiencePoints = experiencePoints;
    this.workoutsCompleted = workoutsCompleted;
    this.totalMinutes = totalMinutes;
    this.totalCalories = totalCalories;
    this.currentStreak = currentStreak;
    this.longestStreak = longestStreak;
    this.preferences = preferences; // Equipamiento, grupos musculares favoritos, etc.
    this.performanceHistory = performanceHistory; // Array de WorkoutPerformance
  }

  /**
   * Calcula la experiencia necesaria para el siguiente nivel
   */
  getExperienceForNextLevel() {
    return this.level * 100; // Fórmula simple: nivel * 100
  }

  /**
   * Calcula el progreso hacia el siguiente nivel (0-1)
   */
  getLevelProgress() {
    const experienceNeeded = this.getExperienceForNextLevel();
    const experienceInCurrentLevel = this.experiencePoints % experienceNeeded;
    return experienceInCurrentLevel / experienceNeeded;
  }

  /**
   * Añade experiencia y sube de nivel si es necesario
   */
  addExperience(points) {
    this.experiencePoints += points;

    const experienceNeeded = this.getExperienceForNextLevel();
    if (this.experiencePoints >= experienceNeeded * this.level) {
      this.level++;
      return { leveledUp: true, newLevel: this.level };
    }

    return { leveledUp: false };
  }

  /**
   * Registra un entrenamiento completado
   */
  completeWorkout(workout, perceivedEffort) {
    this.workoutsCompleted++;
    this.totalMinutes += workout.getTotalDurationMinutes();

    // Calcular calorías aproximadas (10 cal/min en promedio)
    const calories = workout.getTotalDurationMinutes() * 10;
    this.totalCalories += calories;

    // Añadir experiencia basada en duración e intensidad
    const experienceGained = Math.floor(workout.getTotalDurationMinutes() * 2);
    const levelUp = this.addExperience(experienceGained);

    // Actualizar racha
    this.updateStreak();

    // Registrar performance
    const performance = new WorkoutPerformance({
      id: `perf-${Date.now()}`,
      workoutId: workout.id,
      date: new Date(),
      duration: workout.getTotalDurationMinutes(),
      caloriesBurned: calories,
      perceivedEffort: perceivedEffort,
      experienceGained: experienceGained
    });

    this.performanceHistory.push(performance);

    return {
      levelUp: levelUp,
      experienceGained: experienceGained,
      caloriesBurned: calories
    };
  }

  /**
   * Actualiza la racha de entrenamientos
   */
  updateStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.performanceHistory.length === 0) {
      this.currentStreak = 1;
      return;
    }

    const lastWorkout = this.performanceHistory[this.performanceHistory.length - 1];
    const lastWorkoutDate = new Date(lastWorkout.date);
    lastWorkoutDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Mismo día, mantener racha
      return;
    } else if (diffDays === 1) {
      // Día consecutivo
      this.currentStreak++;
      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }
    } else {
      // Racha rota
      this.currentStreak = 1;
    }
  }

  /**
   * Obtiene estadísticas de la última semana
   */
  getWeeklyStats() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyWorkouts = this.performanceHistory.filter(
      perf => new Date(perf.date) >= oneWeekAgo
    );

    const totalMinutes = weeklyWorkouts.reduce((sum, perf) => sum + perf.duration, 0);
    const totalCalories = weeklyWorkouts.reduce((sum, perf) => sum + perf.caloriesBurned, 0);
    const avgEffort = weeklyWorkouts.length > 0
      ? weeklyWorkouts.reduce((sum, perf) => sum + perf.perceivedEffort, 0) / weeklyWorkouts.length
      : 0;

    return {
      workouts: weeklyWorkouts.length,
      minutes: totalMinutes,
      calories: Math.round(totalCalories),
      averageEffort: avgEffort.toFixed(1)
    };
  }

  /**
   * Obtiene recomendación de dificultad basada en el rendimiento
   */
  getDifficultyRecommendation() {
    if (this.performanceHistory.length < 3) {
      return 'CLASSIC'; // Default para principiantes
    }

    // Analizar últimas 5 sesiones
    const recentWorkouts = this.performanceHistory.slice(-5);
    const avgEffort = recentWorkouts.reduce((sum, perf) => sum + perf.perceivedEffort, 0) / recentWorkouts.length;

    // Si el esfuerzo percibido es bajo consistentemente, aumentar dificultad
    if (avgEffort < 3) {
      return 'ADVANCED';
    } else if (avgEffort > 4) {
      return 'BEGINNER';
    } else {
      return 'CLASSIC';
    }
  }

  /**
   * Sugiere grupos musculares a trabajar basándose en el historial
   */
  suggestMuscleGroupsToWork() {
    if (this.performanceHistory.length === 0) {
      return ['piernas', 'glúteos']; // Default
    }

    // Analizar qué grupos musculares se han trabajado recientemente
    const recentWorkouts = this.performanceHistory.slice(-3);
    const workedMuscleGroups = new Set();

    // Aquí se necesitaría acceso a los workouts completos
    // Por simplicidad, devolvemos grupos diversos
    return ['piernas', 'brazos', 'core'];
  }
}

/**
 * Clase WorkoutPerformance
 * Representa el rendimiento en un entrenamiento específico
 */
export class WorkoutPerformance {
  constructor({
    id,
    workoutId,
    date,
    duration,
    caloriesBurned,
    perceivedEffort, // 1-5 (muy fácil a muy difícil)
    experienceGained,
    notes = ''
  }) {
    this.id = id;
    this.workoutId = workoutId;
    this.date = date;
    this.duration = duration;
    this.caloriesBurned = caloriesBurned;
    this.perceivedEffort = perceivedEffort;
    this.experienceGained = experienceGained;
    this.notes = notes;
  }
}
