import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import ProgressService from '../services/ProgressService';

const { width } = Dimensions.get('window');

/**
 * Pantalla de resumen al completar un entrenamiento
 */
const WorkoutCompleteScreen = ({ route, navigation }) => {
  const { workout, totalTime, completedAt } = route.params;
  const [perceivedEffort, setPerceivedEffort] = useState(3);
  const [saved, setSaved] = useState(false);

  const effortLevels = [
    { value: 1, label: 'Muy Fácil', emoji: '😊', color: '#4CAF50' },
    { value: 2, label: 'Fácil', emoji: '🙂', color: '#8BC34A' },
    { value: 3, label: 'Moderado', emoji: '😐', color: '#FFC107' },
    { value: 4, label: 'Difícil', emoji: '😅', color: '#FF9800' },
    { value: 5, label: 'Muy Difícil', emoji: '😰', color: '#F44336' }
  ];

  const handleSave = () => {
    // Guardar el entrenamiento
    const result = ProgressService.recordWorkoutCompletion(workout, perceivedEffort);

    setSaved(true);

    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedCalories = Math.round(totalTime / 60 * 10); // ~10 cal/min

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.congratsEmoji}>🎉</Text>
        <Text style={styles.congratsTitle}>¡Entrenamiento Completado!</Text>
        <Text style={styles.congratsSubtitle}>
          Excelente trabajo
        </Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>⏱️</Text>
          <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
          <Text style={styles.statLabel}>Tiempo Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{estimatedCalories}</Text>
          <Text style={styles.statLabel}>Calorías</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💪</Text>
          <Text style={styles.statValue}>{workout.blocks.length}</Text>
          <Text style={styles.statLabel}>Bloques</Text>
        </View>
      </View>

      {/* Detalle del entrenamiento */}
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Resumen del Entrenamiento</Text>

        {workout.blocks.map((block, index) => (
          <View key={block.id} style={styles.blockSummary}>
            <Text style={styles.blockTitle}>
              Bloque {index + 1} ({block.getTotalDurationMinutes()} min)
            </Text>
            {block.exercises.map((exercise, exIndex) => (
              <Text key={`${block.id}-${exIndex}`} style={styles.exerciseSummary}>
                • {exercise.name}
              </Text>
            ))}
          </View>
        ))}
      </View>

      {/* Calificación de esfuerzo */}
      {!saved && (
        <View style={styles.effortContainer}>
          <Text style={styles.effortTitle}>
            ¿Cómo te sentiste?
          </Text>
          <Text style={styles.effortSubtitle}>
            Esto nos ayuda a personalizar tus próximos entrenamientos
          </Text>

          <View style={styles.effortButtons}>
            {effortLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.effortButton,
                  perceivedEffort === level.value && {
                    backgroundColor: level.color,
                    transform: [{ scale: 1.1 }]
                  }
                ]}
                onPress={() => setPerceivedEffort(level.value)}
              >
                <Text style={styles.effortEmoji}>{level.emoji}</Text>
                <Text
                  style={[
                    styles.effortLabel,
                    perceivedEffort === level.value && styles.effortLabelActive
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Botones de acción */}
      {!saved ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>💾 Guardar y Continuar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.savedContainer}>
          <Text style={styles.savedEmoji}>✅</Text>
          <Text style={styles.savedText}>¡Guardado!</Text>
          <Text style={styles.savedSubtext}>Redirigiendo...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  congratsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  congratsSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: -20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailContainer: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  blockSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f3460',
    marginBottom: 8,
  },
  exerciseSummary: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginVertical: 2,
  },
  effortContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  effortTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
    textAlign: 'center',
  },
  effortSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  effortButtons: {
    flexDirection: 'column',
  },
  effortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 8,
  },
  effortEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  effortLabel: {
    fontSize: 16,
    color: '#666',
  },
  effortLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actions: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  savedContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  savedEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  savedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  savedSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default WorkoutCompleteScreen;
