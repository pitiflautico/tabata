import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

/**
 * Utilitario para compartir workout en formato JSON
 */
export const shareWorkout = async (workout) => {
  try {
    // Preparar datos del workout
    const workoutData = {
      name: workout.name,
      createdAt: new Date().toISOString(),
      blocks: workout.blocks.map((block) => ({
        name: block.name,
        ratio: block.ratio,
        exercises: block.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          muscleGroups: exercise.muscleGroups,
          cardioIndex: exercise.cardioIndex,
        })),
      })),
      totalExercises: workout.getTotalExercises(),
      totalDuration: workout.getTotalDurationMinutes(),
      generatedBy: 'Tabata AI Coach',
      appVersion: '1.0.0',
    };

    // Convertir a JSON
    const json = JSON.stringify(workoutData, null, 2);

    // Crear archivo temporal
    const fileName = `workout_${Date.now()}.json`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, json);

    // Verificar si se puede compartir
    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Compartir Entrenamiento',
        UTI: 'public.json',
      });
    } else {
      Alert.alert(
        'No disponible',
        'La función de compartir no está disponible en este dispositivo'
      );
    }

    // Limpiar archivo temporal después de un tiempo
    setTimeout(async () => {
      try {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      } catch (error) {
        console.log('Error cleaning up temp file:', error);
      }
    }, 5000);

    return true;
  } catch (error) {
    console.error('Error sharing workout:', error);
    Alert.alert('Error', 'No se pudo compartir el entrenamiento');
    return false;
  }
};

/**
 * Copia workout como texto al portapapeles
 */
export const copyWorkoutToClipboard = async (workout) => {
  try {
    const text = formatWorkoutAsText(workout);

    // En React Native necesitamos usar expo-clipboard
    // import * as Clipboard from 'expo-clipboard';
    // await Clipboard.setStringAsync(text);

    return text;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return null;
  }
};

/**
 * Formatea workout como texto legible
 */
export const formatWorkoutAsText = (workout) => {
  let text = `🏋️ ${workout.name}\n`;
  text += `📅 ${new Date().toLocaleDateString()}\n`;
  text += `⏱️ ${workout.getTotalDurationMinutes()} minutos\n`;
  text += `💪 ${workout.getTotalExercises()} ejercicios\n\n`;

  workout.blocks.forEach((block, blockIndex) => {
    text += `— Bloque ${blockIndex + 1} —\n`;
    text += `${block.ratio.work}s trabajo / ${block.ratio.rest}s descanso\n\n`;

    block.exercises.forEach((exercise, exerciseIndex) => {
      text += `${exerciseIndex + 1}. ${exercise.name}\n`;
      text += `   Grupos: ${exercise.muscleGroups.join(', ')}\n`;
      text += `   Intensidad: ${exercise.cardioIndex}/5\n\n`;
    });
  });

  text += `\n✨ Generado con Tabata AI Coach`;

  return text;
};

/**
 * Exporta estadísticas del workout como objeto
 */
export const exportWorkoutStats = (workout) => {
  return {
    name: workout.name,
    totalBlocks: workout.blocks.length,
    totalExercises: workout.getTotalExercises(),
    totalDuration: workout.getTotalDurationMinutes(),
    estimatedCalories: Math.round(workout.getTotalDurationMinutes() * 8.5),
    muscleGroups: [
      ...new Set(
        workout.blocks.flatMap((block) =>
          block.exercises.flatMap((ex) => ex.muscleGroups)
        )
      ),
    ],
    avgIntensity:
      workout.blocks.reduce((sum, block) => sum + block.getAverageCardioIndex(), 0) /
      workout.blocks.length,
    ratios: [
      ...new Set(
        workout.blocks.map((block) => `${block.ratio.work}s/${block.ratio.rest}s`)
      ),
    ],
  };
};
