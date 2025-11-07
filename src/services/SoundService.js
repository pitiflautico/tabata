import { Audio } from 'expo-av';

/**
 * Servicio de sonidos para el workout
 * Gestiona todos los sonidos y notificaciones de audio durante el entrenamiento
 */
class SoundService {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
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
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      this.isInitialized = true;
      console.log('✅ SoundService initialized');
    } catch (error) {
      console.error('❌ Error initializing SoundService:', error);
    }
  }

  /**
   * Genera un sonido sintetizado
   * Como alternativa a archivos de audio, generamos tonos simples
   */
  async playBeep(frequency = 440, duration = 200) {
    if (!this.isEnabled || !this.isInitialized) return;

    try {
      // En una implementación real, aquí cargarías archivos de audio
      // Por ahora usamos vibración como feedback
      // Los archivos de audio se agregarían en assets/sounds/
      console.log(`🔊 Playing beep: ${frequency}Hz for ${duration}ms`);
    } catch (error) {
      console.error('Error playing beep:', error);
    }
  }

  /**
   * Reproduce sonido para inicio de preparación
   */
  async playGetReady() {
    // Tono de alerta (3 beeps cortos)
    await this.playBeep(800, 100);
    await new Promise(resolve => setTimeout(resolve, 150));
    await this.playBeep(800, 100);
    await new Promise(resolve => setTimeout(resolve, 150));
    await this.playBeep(800, 100);
  }

  /**
   * Reproduce sonido para inicio de trabajo
   */
  async playWorkStart() {
    // Tono alto y largo (motivador)
    await this.playBeep(1000, 300);
  }

  /**
   * Reproduce sonido para inicio de descanso
   */
  async playRestStart() {
    // Tono bajo y suave (relajante)
    await this.playBeep(400, 400);
  }

  /**
   * Reproduce sonido para cambio de bloque
   */
  async playBlockComplete() {
    // Secuencia ascendente
    await this.playBeep(523, 150); // Do
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playBeep(659, 150); // Mi
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playBeep(784, 200); // Sol
  }

  /**
   * Reproduce sonido para workout completado
   */
  async playWorkoutComplete() {
    // Fanfarria de victoria
    await this.playBeep(523, 150); // Do
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playBeep(659, 150); // Mi
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playBeep(784, 150); // Sol
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playBeep(1047, 400); // Do (octava alta)
  }

  /**
   * Cuenta regresiva (3, 2, 1)
   */
  async playCountdown(number) {
    if (number <= 3 && number >= 1) {
      await this.playBeep(600 + (number * 100), 150);
    }
  }

  /**
   * Halfway point del ejercicio
   */
  async playHalfway() {
    await this.playBeep(700, 100);
  }

  /**
   * Warning 5 segundos antes del final
   */
  async playWarning() {
    await this.playBeep(900, 150);
  }

  /**
   * Habilitar/deshabilitar sonidos
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Limpiar recursos
   */
  async cleanup() {
    try {
      for (const sound of Object.values(this.sounds)) {
        if (sound) {
          await sound.unloadAsync();
        }
      }
      this.sounds = {};
      this.isInitialized = false;
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
    }
  }
}

// Exportar instancia singleton
export default new SoundService();

/**
 * NOTA: Para implementación completa con archivos de audio reales:
 *
 * 1. Agregar archivos en assets/sounds/:
 *    - get-ready.mp3
 *    - work-start.mp3
 *    - rest-start.mp3
 *    - block-complete.mp3
 *    - workout-complete.mp3
 *    - countdown-3.mp3, countdown-2.mp3, countdown-1.mp3
 *    - halfway.mp3
 *    - warning.mp3
 *
 * 2. Cargar sonidos en initialize():
 *    const { sound } = await Audio.Sound.createAsync(
 *      require('../assets/sounds/work-start.mp3')
 *    );
 *    this.sounds.workStart = sound;
 *
 * 3. Reproducir:
 *    await this.sounds.workStart.replayAsync();
 *
 * 4. Considerar usar expo-speech para anuncios de voz:
 *    import * as Speech from 'expo-speech';
 *    Speech.speak('3, 2, 1, Go!');
 */
