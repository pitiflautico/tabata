import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import { useApp } from '../context/AppContext';
import CircularProgress from '../components/CircularProgress';
import CircularButton from '../components/CircularButton';
import Button from '../components/Button';
import SoundService from '../services/SoundService';
import { CustomAlert } from '../components/CustomAlert';

/**
 * Estados de la sesión
 */
const SessionPhase = {
  GET_READY: 'GET_READY', // Preparación inicial (10s)
  PREPARE: 'PREPARE', // Preparación antes de cada ejercicio (5s)
  WORK: 'WORK', // Trabajo
  REST: 'REST', // Descanso entre ejercicios
  BLOCK_REST: 'BLOCK_REST', // Descanso entre bloques (30s)
  COMPLETE: 'COMPLETE', // Sesión completada
};

/**
 * Pantalla de sesión de entrenamiento generado
 * Ejecuta workouts generados por el AI Coach
 */
const WorkoutSessionScreen = ({ route, navigation }) => {
  const { workout } = route.params;
  const { addWorkout, settings } = useApp();

  // Estado de la sesión
  const [phase, setPhase] = useState(SessionPhase.GET_READY);
  const [timeLeft, setTimeLeft] = useState(10); // Tiempo de preparación inicial
  const [isPaused, setIsPaused] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const timerRef = useRef(null);

  // Initialize sound service
  useEffect(() => {
    SoundService.initialize();
    SoundService.setEnabled(settings.soundEnabled);

    return () => {
      SoundService.cleanup();
    };
  }, []);

  // Update sound settings
  useEffect(() => {
    SoundService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Obtener datos actuales
  const currentBlock = workout.blocks[currentBlockIndex];
  const currentExercise = currentBlock?.exercises[currentExerciseIndex];
  const ratio = currentBlock?.ratio;

  // Calcular progreso total
  const getTotalExercisesDone = () => {
    let count = 0;
    for (let i = 0; i < currentBlockIndex; i++) {
      count += workout.blocks[i].exercises.length;
    }
    count += currentExerciseIndex;
    if (phase === SessionPhase.WORK || phase === SessionPhase.REST) {
      count += 1;
    }
    return count;
  };

  const getTotalExercisesCount = () => {
    return workout.blocks.reduce((sum, block) => sum + block.exercises.length, 0);
  };

  const progressPercent = (getTotalExercisesDone() / getTotalExercisesCount()) * 100;

  // Obtener color según fase
  const getPhaseColor = () => {
    switch (phase) {
      case SessionPhase.GET_READY:
        return AppTheme.colors.warning;
      case SessionPhase.PREPARE:
        return AppTheme.colors.warning;
      case SessionPhase.WORK:
        return AppTheme.colors.primary;
      case SessionPhase.REST:
        return AppTheme.colors.secondary;
      case SessionPhase.BLOCK_REST:
        return AppTheme.colors.accent1;
      case SessionPhase.COMPLETE:
        return AppTheme.colors.success;
      default:
        return AppTheme.colors.primary;
    }
  };

  // Obtener texto de fase
  const getPhaseText = () => {
    switch (phase) {
      case SessionPhase.GET_READY:
        return '¡Prepárate!';
      case SessionPhase.PREPARE:
        return 'A continuación';
      case SessionPhase.WORK:
        return '¡TRABAJO!';
      case SessionPhase.REST:
        return 'Descanso';
      case SessionPhase.BLOCK_REST:
        return 'Descanso entre bloques';
      case SessionPhase.COMPLETE:
        return '¡Completado!';
      default:
        return '';
    }
  };

  // Manejo del timer
  useEffect(() => {
    if (isPaused || phase === SessionPhase.COMPLETE) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handlePhaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [phase, isPaused, currentBlockIndex, currentExerciseIndex]);

  // Countdown sounds
  useEffect(() => {
    if (timeLeft <= 3 && timeLeft >= 1) {
      SoundService.playCountdown(timeLeft);
    }
  }, [timeLeft]);

  // Cuando se completa una fase
  const handlePhaseComplete = () => {
    if (settings.vibrationEnabled) {
      Vibration.vibrate(200);
    }

    if (phase === SessionPhase.GET_READY) {
      // Iniciar primer ejercicio
      SoundService.playGetReady();
      setPhase(SessionPhase.PREPARE);
      setTimeLeft(5);
    } else if (phase === SessionPhase.PREPARE) {
      // Comenzar trabajo
      SoundService.playWorkStart();
      setPhase(SessionPhase.WORK);
      setTimeLeft(ratio.work);
    } else if (phase === SessionPhase.WORK) {
      // Ir a descanso o siguiente ejercicio
      const isLastExerciseInBlock = currentExerciseIndex >= currentBlock.exercises.length - 1;

      if (isLastExerciseInBlock) {
        // Último ejercicio del bloque
        const isLastBlock = currentBlockIndex >= workout.blocks.length - 1;

        if (isLastBlock) {
          // Sesión completada
          handleWorkoutComplete();
        } else {
          // Descanso entre bloques
          SoundService.playBlockComplete();
          setPhase(SessionPhase.BLOCK_REST);
          setTimeLeft(30);
        }
      } else {
        // Descanso normal entre ejercicios
        SoundService.playRestStart();
        setPhase(SessionPhase.REST);
        setTimeLeft(ratio.rest);
      }
    } else if (phase === SessionPhase.REST) {
      // Siguiente ejercicio
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setPhase(SessionPhase.PREPARE);
      setTimeLeft(5);
    } else if (phase === SessionPhase.BLOCK_REST) {
      // Siguiente bloque
      SoundService.playGetReady();
      setCurrentBlockIndex(currentBlockIndex + 1);
      setCurrentExerciseIndex(0);
      setPhase(SessionPhase.PREPARE);
      setTimeLeft(5);
    }
  };

  // Completar workout
  const handleWorkoutComplete = () => {
    setPhase(SessionPhase.COMPLETE);
    SoundService.playWorkoutComplete();

    if (settings.vibrationEnabled) {
      Vibration.vibrate([0, 200, 100, 200, 100, 400]);
    }

    const duration = Math.floor((Date.now() - startTime) / 1000 / 60);
    const calories = Math.round(duration * 8.5);

    addWorkout({
      duration,
      calories,
      rounds: workout.blocks.length,
      cycles: getTotalExercisesCount(),
    });
  };

  // Pausar/Reanudar
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Saltar ejercicio
  const skipExercise = () => {
    CustomAlert.confirm(
      'Saltar Ejercicio',
      '¿Seguro que quieres saltar este ejercicio?',
      () => {
        handlePhaseComplete();
      }
    );
  };

  // Abandonar workout
  const quitWorkout = () => {
    CustomAlert.alert(
      'Abandonar Entrenamiento',
      '¿Seguro que quieres abandonar? El progreso no se guardará.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abandonar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
      { type: 'warning' }
    );
  };

  // Finalizar y volver
  const finishAndGoBack = () => {
    navigation.navigate('HomeMain');
  };

  if (phase === SessionPhase.COMPLETE) {
    return (
      <View style={CommonStyles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.completeContainer}>
          <View style={styles.completeIcon}>
            <Ionicons name="checkmark-circle" size={120} color={AppTheme.colors.success} />
          </View>

          <Text style={styles.completeTitle}>¡Entrenamiento Completado!</Text>
          <Text style={styles.completeSubtitle}>
            Excelente trabajo. Has completado tu sesión.
          </Text>

          <View style={styles.completeSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.floor((Date.now() - startTime) / 1000 / 60)}
              </Text>
              <Text style={styles.summaryLabel}>minutos</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{getTotalExercisesCount()}</Text>
              <Text style={styles.summaryLabel}>ejercicios</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.round(Math.floor((Date.now() - startTime) / 1000 / 60) * 8.5)}
              </Text>
              <Text style={styles.summaryLabel}>kcal</Text>
            </View>
          </View>

          <Button
            title="Ver Estadísticas"
            icon="stats-chart"
            onPress={() => navigation.navigate('Stats')}
            size="large"
            style={styles.completeButton}
          />

          <Button
            title="Volver al Inicio"
            icon="home"
            variant="outline"
            onPress={finishAndGoBack}
            size="large"
            style={styles.completeButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={CommonStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <CircularButton
          icon="close"
          size="medium"
          onPress={quitWorkout}
        />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Sesión en Progreso</Text>
          <Text style={styles.headerSubtitle}>
            Bloque {currentBlockIndex + 1} de {workout.blocks.length}
          </Text>
        </View>
        <CircularButton
          icon={isPaused ? 'play' : 'pause'}
          size="medium"
          onPress={togglePause}
        />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%`, backgroundColor: getPhaseColor() },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {getTotalExercisesDone()} / {getTotalExercisesCount()} ejercicios
        </Text>
      </View>

      {/* Main Timer */}
      <View style={styles.timerContainer}>
        <Text style={[styles.phaseLabel, { color: getPhaseColor() }]}>
          {getPhaseText()}
        </Text>

        <CircularProgress
          size={280}
          strokeWidth={16}
          progress={
            phase === SessionPhase.GET_READY
              ? (timeLeft / 10) * 100
              : phase === SessionPhase.PREPARE
              ? (timeLeft / 5) * 100
              : phase === SessionPhase.WORK
              ? (timeLeft / ratio.work) * 100
              : phase === SessionPhase.REST
              ? (timeLeft / ratio.rest) * 100
              : phase === SessionPhase.BLOCK_REST
              ? (timeLeft / 30) * 100
              : 100
          }
          progressColor={getPhaseColor()}
          backgroundColor={AppTheme.colors.backgroundCard}
        >
          <Text style={styles.timerValue}>{timeLeft}</Text>
          <Text style={styles.timerUnit}>segundos</Text>
        </CircularProgress>

        {/* Exercise Info */}
        {currentExercise && phase !== SessionPhase.GET_READY && (
          <View style={styles.exerciseInfo}>
            {phase === SessionPhase.PREPARE && (
              <Text style={styles.nextLabel}>A continuación:</Text>
            )}
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <View style={styles.exerciseMeta}>
              {currentExercise.muscleGroups.slice(0, 3).map((mg, index) => (
                <View key={index} style={styles.muscleChip}>
                  <Text style={styles.muscleChipText}>{mg}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {phase !== SessionPhase.GET_READY && (
          <TouchableOpacity style={styles.skipButton} onPress={skipExercise}>
            <Ionicons name="play-skip-forward" size={24} color={AppTheme.colors.textSecondary} />
            <Text style={styles.skipText}>Saltar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Block Preview */}
      <View style={styles.blockPreview}>
        <Text style={styles.blockPreviewTitle}>Ejercicios en este bloque:</Text>
        <View style={styles.exerciseList}>
          {currentBlock.exercises.map((ex, index) => (
            <View
              key={index}
              style={[
                styles.exerciseItem,
                index === currentExerciseIndex && styles.exerciseItemActive,
                index < currentExerciseIndex && styles.exerciseItemComplete,
              ]}
            >
              {index < currentExerciseIndex ? (
                <Ionicons name="checkmark-circle" size={20} color={AppTheme.colors.success} />
              ) : index === currentExerciseIndex ? (
                <Ionicons name="radio-button-on" size={20} color={AppTheme.colors.primary} />
              ) : (
                <Ionicons name="ellipse-outline" size={20} color={AppTheme.colors.textSecondary} />
              )}
              <Text
                style={[
                  styles.exerciseItemText,
                  index === currentExerciseIndex && styles.exerciseItemTextActive,
                  index < currentExerciseIndex && styles.exerciseItemTextComplete,
                ]}
                numberOfLines={1}
              >
                {ex.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  headerSubtitle: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  progressBarContainer: {
    paddingHorizontal: AppTheme.layout.screenPadding,
    marginBottom: AppTheme.spacing.xl,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: AppTheme.spacing.xs,
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.xl,
  },
  phaseLabel: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    marginBottom: AppTheme.spacing.xl,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  timerValue: {
    fontSize: 72,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  timerUnit: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.xs,
  },
  exerciseInfo: {
    alignItems: 'center',
    marginTop: AppTheme.spacing.xl,
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  nextLabel: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.xs,
  },
  exerciseName: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  exerciseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: AppTheme.spacing.xs,
  },
  muscleChip: {
    backgroundColor: AppTheme.colors.backgroundCard,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  muscleChipText: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  controls: {
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.lg,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.sm,
  },
  skipText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginLeft: AppTheme.spacing.xs,
  },
  blockPreview: {
    backgroundColor: AppTheme.colors.backgroundCard,
    borderTopLeftRadius: AppTheme.borderRadius.xl,
    borderTopRightRadius: AppTheme.borderRadius.xl,
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingTop: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.xl,
  },
  blockPreviewTitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.md,
  },
  exerciseList: {
    gap: AppTheme.spacing.sm,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  exerciseItemActive: {
    // Activo
  },
  exerciseItemComplete: {
    // Completado
  },
  exerciseItemText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    flex: 1,
  },
  exerciseItemTextActive: {
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
  },
  exerciseItemTextComplete: {
    color: AppTheme.colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  completeIcon: {
    marginBottom: AppTheme.spacing.xl,
  },
  completeTitle: {
    fontSize: AppTheme.typography.fontSize.xxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.sm,
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.xxl,
    textAlign: 'center',
  },
  completeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.xl,
    marginBottom: AppTheme.spacing.xxl,
    width: '100%',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: AppTheme.typography.fontSize.xxxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  summaryLabel: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: AppTheme.colors.backgroundCardLight,
  },
  completeButton: {
    width: '100%',
    marginBottom: AppTheme.spacing.md,
  },
});

export default WorkoutSessionScreen;
