import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { exerciseCatalog } from '../data/exerciseCatalog';
import { TabataRatio } from '../models/Block';
import WorkoutGenerator from '../services/WorkoutGenerator';
import ExerciseCard from '../components/ExerciseCard';

/**
 * Pantalla de generación de entrenamientos
 */
const WorkoutGeneratorScreen = ({ navigation }) => {
  const [numberOfBlocks, setNumberOfBlocks] = useState(3);
  const [exercisesPerBlock, setExercisesPerBlock] = useState(4);
  const [selectedRatio, setSelectedRatio] = useState('CLASSIC');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);

  const ratios = [
    { key: 'BEGINNER', label: 'Principiante (30s/30s)', value: TabataRatio.BEGINNER },
    { key: 'CLASSIC', label: 'Clásico (40s/20s)', value: TabataRatio.CLASSIC },
    { key: 'ADVANCED', label: 'Avanzado (50s/10s)', value: TabataRatio.ADVANCED }
  ];

  const generateWorkout = () => {
    try {
      const ratio = ratios.find(r => r.key === selectedRatio).value;
      const workout = WorkoutGenerator.generateWorkout(
        exerciseCatalog,
        numberOfBlocks,
        exercisesPerBlock,
        ratio
      );

      setGeneratedWorkout(workout);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el entrenamiento');
      console.error(error);
    }
  };

  const startWorkout = () => {
    if (!generatedWorkout) {
      Alert.alert('Aviso', 'Primero genera un entrenamiento');
      return;
    }

    navigation.navigate('WorkoutSession', { workout: generatedWorkout });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nuevo Entrenamiento</Text>
        <Text style={styles.headerSubtitle}>
          Personaliza tu sesión de Tabata
        </Text>
      </View>

      {/* Configuración */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>

        {/* Número de bloques */}
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Número de bloques</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setNumberOfBlocks(Math.max(1, numberOfBlocks - 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{numberOfBlocks}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setNumberOfBlocks(Math.min(6, numberOfBlocks + 1))}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ejercicios por bloque */}
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Ejercicios por bloque</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setExercisesPerBlock(Math.max(2, exercisesPerBlock - 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{exercisesPerBlock}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setExercisesPerBlock(Math.min(8, exercisesPerBlock + 1))}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ratio Tabata */}
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Nivel de intensidad</Text>
          <View style={styles.ratioContainer}>
            {ratios.map(ratio => (
              <TouchableOpacity
                key={ratio.key}
                style={[
                  styles.ratioButton,
                  selectedRatio === ratio.key && styles.ratioButtonActive
                ]}
                onPress={() => setSelectedRatio(ratio.key)}
              >
                <Text
                  style={[
                    styles.ratioButtonText,
                    selectedRatio === ratio.key && styles.ratioButtonTextActive
                  ]}
                >
                  {ratio.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duración estimada */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Duración estimada:</Text>
          <Text style={styles.infoValue}>
            {(() => {
              const ratio = ratios.find(r => r.key === selectedRatio).value;
              const exerciseDuration = ratio.work + ratio.rest;
              const blockDuration = exerciseDuration * exercisesPerBlock;
              const totalDuration = (blockDuration * numberOfBlocks) / 60;
              return `~${Math.ceil(totalDuration)} minutos`;
            })()}
          </Text>
        </View>
      </View>

      {/* Botón generar */}
      <TouchableOpacity style={styles.generateButton} onPress={generateWorkout}>
        <Text style={styles.generateButtonText}>
          🎲 Generar Entrenamiento
        </Text>
      </TouchableOpacity>

      {/* Entrenamiento generado */}
      {generatedWorkout && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entrenamiento Generado</Text>
          <Text style={styles.workoutInfo}>
            {generatedWorkout.getTotalExercises()} ejercicios únicos •{' '}
            {generatedWorkout.getTotalDurationMinutes()} minutos
          </Text>

          {generatedWorkout.blocks.map((block, blockIndex) => (
            <View key={block.id} style={styles.blockContainer}>
              <Text style={styles.blockTitle}>
                Bloque {blockIndex + 1} ({block.getTotalDurationMinutes()} min)
              </Text>

              {block.exercises.map((exercise, exerciseIndex) => (
                <ExerciseCard
                  key={`${block.id}-${exercise.id}-${exerciseIndex}`}
                  exercise={exercise}
                  onPress={() =>
                    navigation.navigate('ExerciseDetail', { exercise })
                  }
                />
              ))}
            </View>
          ))}

          {/* Botón iniciar */}
          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>▶️ Iniciar Entrenamiento</Text>
          </TouchableOpacity>
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
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#0f3460',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  ratioContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 12,
  },
  ratioButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  ratioButtonActive: {
    backgroundColor: '#0f3460',
  },
  ratioButtonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ratioButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#0d47a1',
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  workoutInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  blockContainer: {
    marginBottom: 24,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f3460',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default WorkoutGeneratorScreen;
