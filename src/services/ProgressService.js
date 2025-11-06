import { UserProgress } from '../models/UserProgress';
import StorageService from './StorageService';

/**
 * Servicio de progresión del usuario
 * Maneja el seguimiento y análisis del progreso
 */

class ProgressService {
  constructor() {
    this.currentProgress = null;
    this.initialized = false;
  }

  /**
   * Inicializa el servicio cargando datos desde AsyncStorage
   */
  async initialize() {
    if (this.initialized) return;

    const savedProgress = await StorageService.loadUserProgress();
    if (savedProgress) {
      this.currentProgress = new UserProgress(savedProgress);
    } else {
      this.initializeProgress('default-user');
    }

    this.initialized = true;
  }

  /**
   * Inicializa el progreso del usuario
   */
  initializeProgress(userId) {
    this.currentProgress = new UserProgress({
      id: `progress-${userId}`,
      userId: userId
    });

    return this.currentProgress;
  }

  /**
   * Obtiene el progreso actual
   */
  getCurrentProgress() {
    if (!this.currentProgress) {
      this.initializeProgress('default-user');
    }
    return this.currentProgress;
  }

  /**
   * Registra un entrenamiento completado
   */
  recordWorkoutCompletion(workout, perceivedEffort) {
    const progress = this.getCurrentProgress();
    const result = progress.completeWorkout(workout, perceivedEffort);

    // Guardar progreso (en una app real, esto iría a AsyncStorage o base de datos)
    this.saveProgress();

    return result;
  }

  /**
   * Obtiene estadísticas semanales
   */
  getWeeklyStats() {
    const progress = this.getCurrentProgress();
    return progress.getWeeklyStats();
  }

  /**
   * Obtiene recomendación de siguiente entrenamiento
   */
  getNextWorkoutRecommendation() {
    const progress = this.getCurrentProgress();

    return {
      difficulty: progress.getDifficultyRecommendation(),
      focusMuscleGroups: progress.suggestMuscleGroupsToWork(),
      numberOfBlocks: this.calculateOptimalBlocks(),
      restDayRecommended: this.shouldRecommendRestDay()
    };
  }

  /**
   * Calcula el número óptimo de bloques basado en el nivel
   */
  calculateOptimalBlocks() {
    const progress = this.getCurrentProgress();

    if (progress.level < 5) return 2;
    if (progress.level < 10) return 3;
    if (progress.level < 20) return 4;
    return 5;
  }

  /**
   * Determina si se debe recomendar un día de descanso
   */
  shouldRecommendRestDay() {
    const progress = this.getCurrentProgress();

    if (progress.performanceHistory.length < 2) {
      return false;
    }

    // Verificar si ha entrenado 3+ días consecutivos
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let consecutiveDays = 0;
    for (let i = 0; i < 5; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const hasWorkout = progress.performanceHistory.some(perf => {
        const perfDate = new Date(perf.date);
        perfDate.setHours(0, 0, 0, 0);
        return perfDate.getTime() === checkDate.getTime();
      });

      if (hasWorkout) {
        consecutiveDays++;
      } else {
        break;
      }
    }

    return consecutiveDays >= 3;
  }

  /**
   * Analiza tendencias de rendimiento
   */
  analyzePerformanceTrends() {
    const progress = this.getCurrentProgress();

    if (progress.performanceHistory.length < 5) {
      return {
        trend: 'insufficient_data',
        message: 'Necesitas más entrenamientos para analizar tendencias'
      };
    }

    const recentWorkouts = progress.performanceHistory.slice(-10);

    // Analizar esfuerzo percibido
    const firstHalf = recentWorkouts.slice(0, 5);
    const secondHalf = recentWorkouts.slice(5);

    const avgEffortFirst = firstHalf.reduce((sum, w) => sum + w.perceivedEffort, 0) / firstHalf.length;
    const avgEffortSecond = secondHalf.reduce((sum, w) => sum + w.perceivedEffort, 0) / secondHalf.length;

    let trend, message;

    if (avgEffortSecond < avgEffortFirst - 0.5) {
      trend = 'improving';
      message = '¡Excelente! Tu capacidad está mejorando. Los mismos entrenamientos te resultan más fáciles.';
    } else if (avgEffortSecond > avgEffortFirst + 0.5) {
      trend = 'declining';
      message = 'Parece que necesitas más descanso. Considera tomar un día de recuperación.';
    } else {
      trend = 'stable';
      message = 'Tu rendimiento se mantiene estable. Considera aumentar la dificultad.';
    }

    return {
      trend,
      message,
      averageEffortRecent: avgEffortSecond.toFixed(1),
      averageEffortPrevious: avgEffortFirst.toFixed(1)
    };
  }

  /**
   * Obtiene logros del usuario
   */
  getAchievements() {
    const progress = this.getCurrentProgress();
    const achievements = [];

    // Logros por cantidad de entrenamientos
    const workoutMilestones = [1, 5, 10, 25, 50, 100];
    workoutMilestones.forEach(milestone => {
      if (progress.workoutsCompleted >= milestone) {
        achievements.push({
          id: `workouts-${milestone}`,
          title: `${milestone} Entrenamientos`,
          description: `Has completado ${milestone} entrenamientos`,
          icon: '🏆',
          unlocked: true
        });
      }
    });

    // Logros por racha
    if (progress.longestStreak >= 7) {
      achievements.push({
        id: 'streak-7',
        title: 'Una Semana Imparable',
        description: '7 días de entrenamiento consecutivos',
        icon: '🔥',
        unlocked: true
      });
    }

    if (progress.longestStreak >= 30) {
      achievements.push({
        id: 'streak-30',
        title: 'Mes de Hierro',
        description: '30 días de entrenamiento consecutivos',
        icon: '💪',
        unlocked: true
      });
    }

    // Logros por nivel
    const levelMilestones = [5, 10, 20, 50];
    levelMilestones.forEach(milestone => {
      if (progress.level >= milestone) {
        achievements.push({
          id: `level-${milestone}`,
          title: `Nivel ${milestone}`,
          description: `Has alcanzado el nivel ${milestone}`,
          icon: '⭐',
          unlocked: true
        });
      }
    });

    return achievements;
  }

  /**
   * Guarda el progreso en AsyncStorage
   */
  async saveProgress() {
    if (!this.currentProgress) return false;

    const success = await StorageService.saveUserProgress(this.currentProgress);
    return success;
  }

  /**
   * Carga el progreso desde AsyncStorage
   */
  async loadProgress(userId) {
    const savedProgress = await StorageService.loadUserProgress();
    if (savedProgress) {
      this.currentProgress = new UserProgress(savedProgress);
      return this.currentProgress;
    }
    return this.initializeProgress(userId);
  }

  /**
   * Resetea el progreso del usuario
   */
  async resetProgress(userId) {
    await StorageService.clearAllData();
    this.currentProgress = this.initializeProgress(userId);
    await this.saveProgress();
    return this.currentProgress;
  }
}

export default new ProgressService();
