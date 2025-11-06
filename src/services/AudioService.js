import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

/**
 * Servicio de Audio y Notificaciones
 * Maneja sonidos, voz y vibraciones
 */

class AudioService {
  constructor() {
    this.soundObjects = {};
    this.isInitialized = false;
  }

  /**
   * Inicializa el servicio de audio
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  /**
   * Reproduce un beep de countdown (3-2-1)
   */
  async playCountdownBeep(secondsLeft) {
    try {
      if (secondsLeft <= 3 && secondsLeft > 0) {
        // Tono diferente según los segundos
        const frequency = secondsLeft === 1 ? 800 : 600;
        await this.playTone(frequency, 200);

        // Vibración
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Error playing countdown beep:', error);
    }
  }

  /**
   * Reproduce un tono simple
   */
  async playTone(frequency = 440, duration = 200) {
    try {
      // En una implementación real, generarías un tono sintético
      // Por ahora, usamos haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error playing tone:', error);
    }
  }

  /**
   * Reproduce sonido de inicio de trabajo
   */
  async playWorkSound() {
    try {
      await this.playTone(600, 300);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error playing work sound:', error);
    }
  }

  /**
   * Reproduce sonido de descanso
   */
  async playRestSound() {
    try {
      await this.playTone(400, 300);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.error('Error playing rest sound:', error);
    }
  }

  /**
   * Reproduce sonido de bloque completado
   */
  async playBlockCompleteSound() {
    try {
      await this.playTone(700, 200);
      await new Promise(resolve => setTimeout(resolve, 150));
      await this.playTone(900, 200);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error playing block complete sound:', error);
    }
  }

  /**
   * Reproduce sonido de entrenamiento completado
   */
  async playWorkoutCompleteSound() {
    try {
      await this.playTone(600, 150);
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.playTone(800, 150);
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.playTone(1000, 300);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error playing workout complete sound:', error);
    }
  }

  /**
   * Dice el nombre de un ejercicio
   */
  async speakExerciseName(exerciseName) {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      await Speech.speak(exerciseName, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.9
      });
    } catch (error) {
      console.error('Error speaking exercise name:', error);
    }
  }

  /**
   * Dice una instrucción
   */
  async speakInstruction(instruction) {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      await Speech.speak(instruction, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.85
      });
    } catch (error) {
      console.error('Error speaking instruction:', error);
    }
  }

  /**
   * Anuncia cambio de fase
   */
  async announcePhaseChange(isWorkPhase, exerciseName = null) {
    try {
      if (isWorkPhase && exerciseName) {
        await this.speakInstruction(`Comienza. ${exerciseName}`);
        await this.playWorkSound();
      } else {
        await this.speakInstruction('Descansa');
        await this.playRestSound();
      }
    } catch (error) {
      console.error('Error announcing phase change:', error);
    }
  }

  /**
   * Vibración simple
   */
  async vibrate() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error vibrating:', error);
    }
  }

  /**
   * Vibración de éxito
   */
  async vibrateSuccess() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error vibrating success:', error);
    }
  }

  /**
   * Vibración de advertencia
   */
  async vibrateWarning() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.error('Error vibrating warning:', error);
    }
  }

  /**
   * Detiene toda reproducción de voz
   */
  async stopSpeech() {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  /**
   * Limpia recursos de audio
   */
  async cleanup() {
    try {
      await this.stopSpeech();

      // Descargar objetos de sonido
      for (const key in this.soundObjects) {
        if (this.soundObjects[key]) {
          await this.soundObjects[key].unloadAsync();
        }
      }

      this.soundObjects = {};
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  }
}

export default new AudioService();
