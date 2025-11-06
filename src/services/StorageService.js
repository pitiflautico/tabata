import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Servicio de almacenamiento persistente
 * Wrapper para AsyncStorage con funciones helper
 */

const KEYS = {
  USER_PROGRESS: '@tabata_user_progress',
  WORKOUT_HISTORY: '@tabata_workout_history',
  CUSTOM_EXERCISES: '@tabata_custom_exercises',
  SETTINGS: '@tabata_settings',
  FAVORITES: '@tabata_favorites',
  PROGRAMS: '@tabata_programs'
};

class StorageService {
  /**
   * Guardar progreso del usuario
   */
  async saveUserProgress(progress) {
    try {
      const jsonValue = JSON.stringify(progress);
      await AsyncStorage.setItem(KEYS.USER_PROGRESS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return false;
    }
  }

  /**
   * Cargar progreso del usuario
   */
  async loadUserProgress() {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading user progress:', error);
      return null;
    }
  }

  /**
   * Guardar historial de entrenamientos
   */
  async saveWorkoutHistory(history) {
    try {
      const jsonValue = JSON.stringify(history);
      await AsyncStorage.setItem(KEYS.WORKOUT_HISTORY, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving workout history:', error);
      return false;
    }
  }

  /**
   * Cargar historial de entrenamientos
   */
  async loadWorkoutHistory() {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.WORKOUT_HISTORY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading workout history:', error);
      return [];
    }
  }

  /**
   * Añadir un entrenamiento al historial
   */
  async addWorkoutToHistory(workout) {
    try {
      const history = await this.loadWorkoutHistory();
      history.push(workout);
      await this.saveWorkoutHistory(history);
      return true;
    } catch (error) {
      console.error('Error adding workout to history:', error);
      return false;
    }
  }

  /**
   * Guardar ejercicios personalizados
   */
  async saveCustomExercises(exercises) {
    try {
      const jsonValue = JSON.stringify(exercises);
      await AsyncStorage.setItem(KEYS.CUSTOM_EXERCISES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving custom exercises:', error);
      return false;
    }
  }

  /**
   * Cargar ejercicios personalizados
   */
  async loadCustomExercises() {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.CUSTOM_EXERCISES);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading custom exercises:', error);
      return [];
    }
  }

  /**
   * Añadir un ejercicio personalizado
   */
  async addCustomExercise(exercise) {
    try {
      const exercises = await this.loadCustomExercises();
      exercises.push(exercise);
      await this.saveCustomExercises(exercises);
      return true;
    } catch (error) {
      console.error('Error adding custom exercise:', error);
      return false;
    }
  }

  /**
   * Guardar configuraciones
   */
  async saveSettings(settings) {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(KEYS.SETTINGS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  /**
   * Cargar configuraciones
   */
  async loadSettings() {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : {
        soundEnabled: true,
        voiceEnabled: true,
        vibrateEnabled: true,
        autoNext: true,
        showFrames: true,
        countdownBeep: true,
        darkMode: false
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  }

  /**
   * Guardar entrenamientos favoritos
   */
  async saveFavorites(favorites) {
    try {
      const jsonValue = JSON.stringify(favorites);
      await AsyncStorage.setItem(KEYS.FAVORITES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  }

  /**
   * Cargar entrenamientos favoritos
   */
  async loadFavorites() {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.FAVORITES);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * Añadir a favoritos
   */
  async addToFavorites(workout) {
    try {
      const favorites = await this.loadFavorites();
      favorites.push(workout);
      await this.saveFavorites(favorites);
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  /**
   * Eliminar de favoritos
   */
  async removeFromFavorites(workoutId) {
    try {
      const favorites = await this.loadFavorites();
      const filtered = favorites.filter(w => w.id !== workoutId);
      await this.saveFavorites(filtered);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  /**
   * Guardar programas multi-semana
   */
  async savePrograms(programs) {
    try {
      const jsonValue = JSON.stringify(programs);
      await AsyncStorage.setItem(KEYS.PROGRAMS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving programs:', error);
      return false;
    }
  }

  /**
   * Cargar programas multi-semana
   */
  async loadPrograms() {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.PROGRAMS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading programs:', error);
      return [];
    }
  }

  /**
   * Limpiar todos los datos (reset)
   */
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        KEYS.USER_PROGRESS,
        KEYS.WORKOUT_HISTORY,
        KEYS.CUSTOM_EXERCISES,
        KEYS.FAVORITES,
        KEYS.PROGRAMS
        // No eliminamos KEYS.SETTINGS para mantener preferencias
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  /**
   * Exportar todos los datos
   */
  async exportAllData() {
    try {
      const [progress, history, exercises, settings, favorites, programs] = await Promise.all([
        this.loadUserProgress(),
        this.loadWorkoutHistory(),
        this.loadCustomExercises(),
        this.loadSettings(),
        this.loadFavorites(),
        this.loadPrograms()
      ]);

      return {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        data: {
          progress,
          history,
          customExercises: exercises,
          settings,
          favorites,
          programs
        }
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  /**
   * Importar datos desde un export
   */
  async importAllData(exportData) {
    try {
      const { data } = exportData;

      await Promise.all([
        data.progress && this.saveUserProgress(data.progress),
        data.history && this.saveWorkoutHistory(data.history),
        data.customExercises && this.saveCustomExercises(data.customExercises),
        data.settings && this.saveSettings(data.settings),
        data.favorites && this.saveFavorites(data.favorites),
        data.programs && this.savePrograms(data.programs)
      ]);

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Obtener tamaño aproximado de almacenamiento usado
   */
  async getStorageSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        if (key.startsWith('@tabata_')) {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            totalSize += value.length;
          }
        }
      }

      // Convertir bytes a KB
      return (totalSize / 1024).toFixed(2);
    } catch (error) {
      console.error('Error getting storage size:', error);
      return 0;
    }
  }
}

export default new StorageService();
