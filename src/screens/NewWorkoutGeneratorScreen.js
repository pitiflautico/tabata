import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import { useApp } from '../context/AppContext';
import { exerciseCatalog } from '../data/exerciseCatalog';
import { TabataRatio } from '../models/Block';
import WorkoutGenerator from '../services/WorkoutGenerator';
import CircularButton from '../components/CircularButton';
import Button from '../components/Button';
import Card from '../components/Card';
import ExerciseCard from '../components/ExerciseCard';
import SaveWorkoutModal from '../components/SaveWorkoutModal';
import WorkoutPresetsModal from '../components/WorkoutPresetsModal';
import { shareWorkout, formatWorkoutAsText } from '../utils/shareWorkout';
import { CustomAlert } from '../components/CustomAlert';

/**
 * Pantalla de generación de entrenamientos con AI Coach
 */
const NewWorkoutGeneratorScreen = ({ navigation }) => {
  const {
    config,
    saveGeneratedWorkout,
    saveAsTemplate,
  } = useApp();

  const [numberOfBlocks, setNumberOfBlocks] = useState(3);
  const [exercisesPerBlock, setExercisesPerBlock] = useState(4);
  const [selectedRatio, setSelectedRatio] = useState('CLASSIC');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState({});

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPresetsModal, setShowPresetsModal] = useState(false);

  // Helper functions for serialized workout
  const getTotalExercises = (workout) => {
    if (!workout) return 0;
    const uniqueExercises = new Set();
    workout.blocks.forEach(block => {
      block.exercises.forEach(ex => uniqueExercises.add(ex.id));
    });
    return uniqueExercises.size;
  };

  const getTotalDurationMinutes = (workout) => {
    if (!workout) return 0;
    const totalSeconds = workout.blocks.reduce((acc, block) => {
      const exerciseDuration = block.ratio.work + block.ratio.rest;
      const blockDuration = exerciseDuration * block.exercises.length;
      return acc + (blockDuration * (block.rounds || 1));
    }, 0);
    return Math.ceil(totalSeconds / 60);
  };

  const ratios = [
    {
      key: 'BEGINNER',
      label: 'Principiante',
      subtitle: '30s trabajo / 30s descanso',
      value: TabataRatio.BEGINNER,
      color: AppTheme.colors.success,
      icon: 'walk',
    },
    {
      key: 'CLASSIC',
      label: 'Clásico',
      subtitle: '40s trabajo / 20s descanso',
      value: TabataRatio.CLASSIC,
      color: AppTheme.colors.warning,
      icon: 'fitness',
    },
    {
      key: 'ADVANCED',
      label: 'Avanzado',
      subtitle: '50s trabajo / 10s descanso',
      value: TabataRatio.ADVANCED,
      color: AppTheme.colors.error,
      icon: 'flame',
    },
  ];

  const generateWorkout = async () => {
    setIsGenerating(true);

    // Simulate AI thinking delay for better UX
    setTimeout(() => {
      try {
        const ratio = ratios.find((r) => r.key === selectedRatio).value;
        const workout = WorkoutGenerator.generateWorkout(
          exerciseCatalog,
          numberOfBlocks,
          exercisesPerBlock,
          ratio
        );

        setGeneratedWorkout(workout);

        // Expand first block by default
        setExpandedBlocks({ 0: true });
      } catch (error) {
        CustomAlert.error('Error', 'No se pudo generar el entrenamiento');
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };

  const regenerateBlock = (blockIndex) => {
    if (!generatedWorkout) return;

    try {
      const ratio = ratios.find((r) => r.key === selectedRatio).value;
      const newBlock = WorkoutGenerator.generateIntensityBalancedBlock(
        exerciseCatalog,
        exercisesPerBlock,
        ratio,
        blockIndex
      );

      const updatedWorkout = { ...generatedWorkout };
      updatedWorkout.blocks[blockIndex] = newBlock;
      setGeneratedWorkout(updatedWorkout);

      CustomAlert.success('✓ Bloque regenerado', 'El bloque ha sido actualizado');
    } catch (error) {
      CustomAlert.error('Error', 'No se pudo regenerar el bloque');
    }
  };

  const removeExerciseFromBlock = (blockIndex, exerciseIndex) => {
    if (!generatedWorkout) return;

    const updatedWorkout = { ...generatedWorkout };
    const block = updatedWorkout.blocks[blockIndex];

    if (block.exercises.length <= 2) {
      CustomAlert.warning('Aviso', 'Un bloque debe tener al menos 2 ejercicios');
      return;
    }

    block.exercises.splice(exerciseIndex, 1);
    setGeneratedWorkout(updatedWorkout);
  };

  const toggleBlockExpansion = (blockIndex) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockIndex]: !prev[blockIndex],
    }));
  };

  const startWorkout = () => {
    if (!generatedWorkout) {
      CustomAlert.warning('Aviso', 'Primero genera un entrenamiento');
      return;
    }

    CustomAlert.confirm(
      'Iniciar Entrenamiento',
      `¿Comenzar entrenamiento de ${getTotalDurationMinutes(generatedWorkout)} minutos?`,
      () => {
        // Serializar el workout (convertir Date a ISO string para React Navigation)
        const serializedWorkout = {
          ...generatedWorkout,
          date: generatedWorkout.date?.toISOString() || new Date().toISOString(),
        };
        navigation.navigate('WorkoutSession', { workout: serializedWorkout });
      }
    );
  };

  const calculateEstimatedDuration = () => {
    const ratio = ratios.find((r) => r.key === selectedRatio).value;
    const exerciseDuration = ratio.work + ratio.rest;
    const blockDuration = exerciseDuration * exercisesPerBlock;
    const totalDuration = (blockDuration * numberOfBlocks) / 60;
    return Math.ceil(totalDuration);
  };

  const getSelectedRatioData = () => {
    return ratios.find((r) => r.key === selectedRatio);
  };

  return (
    <View style={CommonStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <CircularButton
          icon="arrow-back"
          size="medium"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Coach</Text>
          <Text style={styles.headerSubtitle}>Generador de Entrenamientos</Text>
        </View>
        <CircularButton
          icon="information-circle-outline"
          size="medium"
          onPress={() =>
            CustomAlert.alert(
              'AI Coach',
              'El coach genera entrenamientos balanceados alternando intensidades y evitando repetir grupos musculares consecutivamente.'
            )
          }
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Coach Hero Section */}
        {!generatedWorkout && (
          <Card style={styles.coachCard}>
            <View style={styles.coachHeader}>
              <View style={styles.robotIconContainer}>
                <Ionicons name="rocket" size={40} color={AppTheme.colors.primary} />
              </View>
              <Text style={styles.coachTitle}>¡Hola, Atleta!</Text>
              <Text style={styles.coachSubtitle}>
                Estoy listo para generar tu entrenamiento perfecto del día
              </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStatsRow}>
              <View style={styles.quickStat}>
                <Ionicons
                  name="calendar"
                  size={24}
                  color={AppTheme.colors.primary}
                />
                <Text style={styles.quickStatLabel}>Hoy</Text>
                <Text style={styles.quickStatValue}>
                  {new Date().toLocaleDateString('es-ES', {
                    weekday: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.quickStat}>
                <Ionicons name="timer" size={24} color={AppTheme.colors.accent3} />
                <Text style={styles.quickStatLabel}>Duración</Text>
                <Text style={styles.quickStatValue}>
                  {calculateEstimatedDuration()} min
                </Text>
              </View>
              <View style={styles.quickStat}>
                <Ionicons
                  name="fitness"
                  size={24}
                  color={AppTheme.colors.secondary}
                />
                <Text style={styles.quickStatLabel}>Ejercicios</Text>
                <Text style={styles.quickStatValue}>
                  {numberOfBlocks * exercisesPerBlock}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Configuration Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración del Entrenamiento</Text>

          {/* Number of Blocks */}
          <View style={styles.configRow}>
            <View style={styles.configLabelContainer}>
              <Ionicons
                name="grid-outline"
                size={20}
                color={AppTheme.colors.primary}
              />
              <Text style={styles.configLabel}>Bloques</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfBlocks(Math.max(1, numberOfBlocks - 1))}
              >
                <Ionicons name="remove" size={20} color={AppTheme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{numberOfBlocks}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfBlocks(Math.min(6, numberOfBlocks + 1))}
              >
                <Ionicons name="add" size={20} color={AppTheme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Exercises per Block */}
          <View style={styles.configRow}>
            <View style={styles.configLabelContainer}>
              <Ionicons
                name="list-outline"
                size={20}
                color={AppTheme.colors.accent3}
              />
              <Text style={styles.configLabel}>Ejercicios por bloque</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  setExercisesPerBlock(Math.max(2, exercisesPerBlock - 1))
                }
              >
                <Ionicons name="remove" size={20} color={AppTheme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{exercisesPerBlock}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  setExercisesPerBlock(Math.min(8, exercisesPerBlock + 1))
                }
              >
                <Ionicons name="add" size={20} color={AppTheme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Ratio Selection */}
          <View style={styles.ratioSection}>
            <Text style={styles.configLabel}>Nivel de Intensidad</Text>
            {ratios.map((ratio) => (
              <TouchableOpacity
                key={ratio.key}
                style={[
                  styles.ratioCard,
                  selectedRatio === ratio.key && styles.ratioCardActive,
                  { borderColor: ratio.color },
                ]}
                onPress={() => setSelectedRatio(ratio.key)}
              >
                <View style={styles.ratioContent}>
                  <View
                    style={[
                      styles.ratioIcon,
                      { backgroundColor: ratio.color + '20' },
                    ]}
                  >
                    <Ionicons name={ratio.icon} size={24} color={ratio.color} />
                  </View>
                  <View style={styles.ratioTexts}>
                    <Text
                      style={[
                        styles.ratioLabel,
                        selectedRatio === ratio.key && styles.ratioLabelActive,
                      ]}
                    >
                      {ratio.label}
                    </Text>
                    <Text style={styles.ratioSubtitle}>{ratio.subtitle}</Text>
                  </View>
                </View>
                {selectedRatio === ratio.key && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={AppTheme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Duration Info */}
          <View style={styles.durationInfo}>
            <Ionicons
              name="information-circle"
              size={20}
              color={AppTheme.colors.primary}
            />
            <Text style={styles.durationText}>
              Duración estimada: <Text style={styles.durationValue}>
                ~{calculateEstimatedDuration()} minutos
              </Text>
            </Text>
          </View>
        </Card>

        {/* Generate Button */}
        {!generatedWorkout && (
          <Button
            title={isGenerating ? 'Generando...' : 'Generar Mi Entrenamiento'}
            icon={isGenerating ? 'refresh' : 'sparkles'}
            onPress={generateWorkout}
            loading={isGenerating}
            disabled={isGenerating}
            size="large"
            fullWidth
          />
        )}

        {/* Generated Workout */}
        {generatedWorkout && (
          <>
            <Card style={styles.section}>
              <View style={styles.workoutHeader}>
                <View>
                  <Text style={styles.workoutTitle}>
                    ✓ Entrenamiento Generado
                  </Text>
                  <Text style={styles.workoutSubtitle}>
                    {getTotalExercises(generatedWorkout)} ejercicios únicos •{' '}
                    {getTotalDurationMinutes(generatedWorkout)} minutos
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.regenerateButton}
                  onPress={generateWorkout}
                >
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={AppTheme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.modifyHint}>
                Toca un bloque para expandir y modificar
              </Text>
            </Card>

            {/* Blocks */}
            {generatedWorkout.blocks.map((block, blockIndex) => (
              <Card key={block.id} style={styles.blockCard}>
                <TouchableOpacity
                  style={styles.blockHeader}
                  onPress={() => toggleBlockExpansion(blockIndex)}
                >
                  <View style={styles.blockHeaderLeft}>
                    <View style={styles.blockNumberBadge}>
                      <Text style={styles.blockNumber}>{blockIndex + 1}</Text>
                    </View>
                    <View>
                      <Text style={styles.blockTitle}>Bloque {blockIndex + 1}</Text>
                      <Text style={styles.blockSubtitle}>
                        {block.exercises.length} ejercicios •{' '}
                        {block.getTotalDurationMinutes()} min
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={
                      expandedBlocks[blockIndex]
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={24}
                    color={AppTheme.colors.textSecondary}
                  />
                </TouchableOpacity>

                {/* Block Actions */}
                {expandedBlocks[blockIndex] && (
                  <>
                    <View style={styles.blockActions}>
                      <TouchableOpacity
                        style={styles.blockActionButton}
                        onPress={() => regenerateBlock(blockIndex)}
                      >
                        <Ionicons
                          name="refresh-circle-outline"
                          size={20}
                          color={AppTheme.colors.primary}
                        />
                        <Text style={styles.blockActionText}>
                          Regenerar Bloque
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Exercises in Block */}
                    {block.exercises.map((exercise, exerciseIndex) => (
                      <View
                        key={`${block.id}-${exercise.id}-${exerciseIndex}`}
                        style={styles.exerciseWrapper}
                      >
                        <ExerciseCard
                          exercise={exercise}
                          onPress={() =>
                            navigation.navigate('ExerciseDetail', { exercise })
                          }
                        />
                        <TouchableOpacity
                          style={styles.removeExerciseButton}
                          onPress={() =>
                            removeExerciseFromBlock(blockIndex, exerciseIndex)
                          }
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color={AppTheme.colors.error}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </>
                )}
              </Card>
            ))}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                title="Regenerar Todo"
                icon="refresh"
                variant="outline"
                onPress={generateWorkout}
                style={styles.actionButton}
              />
              <Button
                title="Iniciar Entrenamiento"
                icon="play-circle"
                onPress={startWorkout}
                style={styles.actionButton}
                size="large"
              />
            </View>
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50,
    paddingBottom: AppTheme.spacing.lg,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  headerSubtitle: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  coachCard: {
    marginBottom: AppTheme.spacing.lg,
    alignItems: 'center',
  },
  coachHeader: {
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
  },
  robotIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  coachTitle: {
    fontSize: AppTheme.typography.fontSize.xxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.xs,
  },
  coachSubtitle: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.xs,
  },
  quickStatValue: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginTop: 2,
  },
  section: {
    marginBottom: AppTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.md,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.base,
    paddingVertical: AppTheme.spacing.sm,
  },
  configLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.text,
    marginLeft: AppTheme.spacing.sm,
    fontWeight: AppTheme.typography.fontWeight.medium,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginHorizontal: AppTheme.spacing.base,
    minWidth: 30,
    textAlign: 'center',
  },
  ratioSection: {
    marginTop: AppTheme.spacing.base,
  },
  ratioCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCardLight,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.base,
    marginTop: AppTheme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratioCardActive: {
    backgroundColor: AppTheme.colors.backgroundCard,
    borderColor: AppTheme.colors.primary,
  },
  ratioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ratioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  ratioTexts: {
    flex: 1,
  },
  ratioLabel: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
  },
  ratioLabelActive: {
    color: AppTheme.colors.primary,
  },
  ratioSubtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primary + '20',
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.base,
    marginTop: AppTheme.spacing.base,
  },
  durationText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginLeft: AppTheme.spacing.sm,
  },
  durationValue: {
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: AppTheme.spacing.sm,
  },
  workoutTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.success,
  },
  workoutSubtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: 4,
  },
  regenerateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modifyHint: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: AppTheme.spacing.sm,
  },
  blockCard: {
    marginBottom: AppTheme.spacing.md,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blockNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  blockNumber: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.background,
  },
  blockTitle: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  blockSubtitle: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  blockActions: {
    marginTop: AppTheme.spacing.base,
    paddingTop: AppTheme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.backgroundCardLight,
  },
  blockActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.sm,
  },
  blockActionText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.primary,
    marginLeft: AppTheme.spacing.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
  },
  exerciseWrapper: {
    position: 'relative',
    marginTop: AppTheme.spacing.md,
  },
  removeExerciseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: AppTheme.colors.background,
    borderRadius: 12,
    padding: 2,
  },
  actionButtons: {
    gap: AppTheme.spacing.md,
  },
  actionButton: {
    marginBottom: AppTheme.spacing.sm,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NewWorkoutGeneratorScreen;
