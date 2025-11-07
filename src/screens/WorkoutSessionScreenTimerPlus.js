import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { TimerPlusColors, TimerPlusTypography, TimerPlusLayout, getPhaseColor, getTextColorForBackground } from '../styles/TimerPlusTheme';
import AudioService from '../services/AudioService';

const { width, height } = Dimensions.get('window');

/**
 * WorkoutSessionScreen - Timer Plus Design
 * Diseño basado en Timer Plus app con colores brillantes y números gigantes
 */
const WorkoutSessionScreenTimerPlus = ({ route, navigation }) => {
  const { workout } = route.params;

  // Estados principales
  const [phase, setPhase] = useState('prepare'); // prepare, work, rest, complete
  const [timeLeft, setTimeLeft] = useState(10); // Tiempo preparación inicial
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Referencias
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);

  // Datos actuales
  const currentBlock = workout?.blocks[currentBlockIndex];
  const currentExercise = currentBlock?.exercises[currentExerciseIndex];
  const ratio = currentBlock?.ratio || { work: 20, rest: 10 };

  // Calcular total de rondas
  useEffect(() => {
    if (workout) {
      const total = workout.blocks.reduce((sum, block) =>
        sum + block.exercises.length, 0
      );
      setTotalRounds(total);
    }
  }, [workout]);

  // Timer principal
  useEffect(() => {
    if (!isPaused && phase !== 'complete') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseTransition();
            return 0;
          }

          // Flash en los últimos 3 segundos
          if (prev <= 3) {
            pulseAnimation();
            AudioService.playCountdownBeep(prev - 1);
          }

          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [isPaused, phase, currentExerciseIndex, currentBlockIndex]);

  // Timer de tiempo total transcurrido
  useEffect(() => {
    if (!isPaused && phase !== 'complete') {
      totalTimerRef.current = setInterval(() => {
        setTotalElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(totalTimerRef.current);
    }
  }, [isPaused, phase]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(totalTimerRef.current);
    };
  }, []);

  // Animación de pulso
  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Transición entre fases
  const handlePhaseTransition = async () => {
    if (phase === 'prepare') {
      // Prepare -> Work
      setPhase('work');
      setTimeLeft(ratio.work);
      await AudioService.announcePhaseChange(true, currentExercise?.nameES || currentExercise?.name);

    } else if (phase === 'work') {
      // Work -> Rest
      setPhase('rest');
      setTimeLeft(ratio.rest);
      await AudioService.announcePhaseChange(false);

    } else if (phase === 'rest') {
      // Rest -> Siguiente ejercicio o bloque
      const isLastExerciseInBlock = currentExerciseIndex >= currentBlock.exercises.length - 1;
      const isLastBlock = currentBlockIndex >= workout.blocks.length - 1;

      if (isLastExerciseInBlock && isLastBlock) {
        // Workout completado
        setPhase('complete');
        await AudioService.vibrateSuccess();
        setTimeout(() => {
          navigation.navigate('WorkoutComplete', {
            workout,
            totalTime: totalElapsed,
          });
        }, 2000);

      } else if (isLastExerciseInBlock) {
        // Siguiente bloque
        setCurrentBlockIndex(prev => prev + 1);
        setCurrentExerciseIndex(0);
        setPhase('work');
        setTimeLeft(workout.blocks[currentBlockIndex + 1].ratio.work);
        setCurrentRound(prev => prev + 1);

      } else {
        // Siguiente ejercicio en el mismo bloque
        setCurrentExerciseIndex(prev => prev + 1);
        setPhase('work');
        setTimeLeft(ratio.work);
        setCurrentRound(prev => prev + 1);
      }
    }

    // Animación de transición de fase
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Formatear tiempo MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Obtener siguiente fase y ejercicio
  const getNextPhaseInfo = () => {
    if (phase === 'prepare') {
      return {
        label: 'WORK',
        time: formatTime(ratio.work),
        color: TimerPlusColors.work,
      };
    } else if (phase === 'work') {
      return {
        label: 'REST',
        time: formatTime(ratio.rest),
        color: TimerPlusColors.rest,
      };
    } else if (phase === 'rest') {
      const nextExerciseIndex = currentExerciseIndex + 1;
      const nextExercise = currentBlock.exercises[nextExerciseIndex];

      if (nextExercise) {
        return {
          label: 'UP NEXT',
          exercise: nextExercise.nameES || nextExercise.name,
          time: formatTime(ratio.work),
          color: TimerPlusColors.work,
        };
      } else if (currentBlockIndex < workout.blocks.length - 1) {
        const nextBlock = workout.blocks[currentBlockIndex + 1];
        return {
          label: 'NEXT BLOCK',
          exercise: nextBlock.name,
          time: formatTime(nextBlock.ratio.work),
          color: TimerPlusColors.work,
        };
      }
    }
    return null;
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Skip interval
  const skipInterval = () => {
    handlePhaseTransition();
  };

  // Quit workout
  const quitWorkout = () => {
    navigation.goBack();
  };

  // Colores según fase
  const backgroundColor = getPhaseColor(phase);
  const textColor = getTextColorForBackground(backgroundColor);
  const nextPhaseInfo = getNextPhaseInfo();

  // Calcular rondas restantes
  const roundsLeft = totalRounds - currentRound;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={textColor === '#000000' ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
      />

      {/* Header - Tiempo total y configuración */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={quitWorkout}>
          <Text style={[styles.headerButtonText, { color: textColor }]}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerLabel, { color: textColor }]}>
            {workout.name}
          </Text>
          <Text style={[styles.headerTime, { color: textColor }]}>
            {formatTime(totalElapsed)}
          </Text>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
          <Text style={[styles.headerButtonText, { color: textColor }]}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Título de fase */}
      <Animated.View style={[styles.phaseTitleContainer, { opacity: fadeAnim }]}>
        <Text style={[styles.phaseTitle, { color: textColor }]}>
          {phase.toUpperCase()}
        </Text>
      </Animated.View>

      {/* Timer gigante */}
      <Animated.View
        style={[
          styles.timerContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Text style={[styles.timerGiant, { color: textColor }]}>
          {formatTime(timeLeft)}
        </Text>
      </Animated.View>

      {/* Nombre del ejercicio actual */}
      {phase !== 'prepare' && phase !== 'complete' && currentExercise && (
        <View style={styles.exerciseNameContainer}>
          <Text style={[styles.exerciseName, { color: textColor }]}>
            {currentExercise.nameES || currentExercise.name}
          </Text>
        </View>
      )}

      {/* Siguiente fase (barra inferior) */}
      {nextPhaseInfo && (
        <View style={[styles.nextPhaseBar, { backgroundColor: nextPhaseInfo.color }]}>
          <Text style={styles.nextPhaseLabel}>
            {nextPhaseInfo.label}
          </Text>
          <Text style={styles.nextPhaseTime}>
            {nextPhaseInfo.time}
          </Text>
          {nextPhaseInfo.exercise && (
            <Text style={styles.nextPhaseExercise}>
              {nextPhaseInfo.exercise}
            </Text>
          )}
        </View>
      )}

      {/* Footer - Controles y contadores */}
      <View style={styles.footer}>
        {/* Rounds left */}
        <View style={styles.counterContainer}>
          <Text style={[styles.counterValue, { color: TimerPlusColors.infoBlue }]}>
            {roundsLeft}
          </Text>
          <Text style={[styles.counterLabel, { color: textColor }]}>
            ROUNDS LEFT
          </Text>
        </View>

        {/* Botón central STOP/PLAY */}
        <TouchableOpacity
          style={[
            styles.mainButton,
            {
              backgroundColor: isPaused ? TimerPlusColors.successGreen : textColor === '#000000' ? '#333' : '#DDD'
            }
          ]}
          onPress={togglePause}
        >
          <Text style={[styles.mainButtonText, { color: isPaused ? '#000' : '#FFF' }]}>
            {isPaused ? '▶' : '■'}
          </Text>
        </TouchableOpacity>

        {/* Current block/cycle */}
        <View style={styles.counterContainer}>
          <Text style={[styles.counterValue, { color: TimerPlusColors.warning }]}>
            {currentBlockIndex + 1}
          </Text>
          <Text style={[styles.counterLabel, { color: textColor }]}>
            BLOCK
          </Text>
        </View>
      </View>

      {/* Botones secundarios - Skip */}
      {phase !== 'complete' && (
        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={skipInterval}
          >
            <Text style={[styles.secondaryButtonText, { color: textColor }]}>
              SKIP →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerButtonText: {
    fontSize: 28,
    fontWeight: '700',
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  headerTime: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },

  // Título de fase
  phaseTitleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  phaseTitle: {
    ...TimerPlusTypography.phaseTitle,
    fontSize: 40,
  },

  // Timer gigante
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerGiant: {
    ...TimerPlusTypography.timerGiant,
    fontSize: Math.min(width * 0.35, 160),
  },

  // Nombre del ejercicio
  exerciseNameContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },

  exerciseName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Siguiente fase (barra)
  nextPhaseBar: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  nextPhaseLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  nextPhaseTime: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000',
    marginTop: 4,
  },

  nextPhaseExercise: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },

  counterContainer: {
    alignItems: 'center',
  },

  counterValue: {
    ...TimerPlusTypography.counterValue,
    fontSize: 52,
  },

  counterLabel: {
    ...TimerPlusTypography.counterLabel,
    fontSize: 11,
    marginTop: 4,
  },

  mainButton: {
    ...TimerPlusLayout.buttonLarge,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  mainButtonText: {
    fontSize: 32,
    fontWeight: '800',
  },

  // Botones secundarios
  secondaryButtons: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 150 : 130,
    right: 20,
  },

  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default WorkoutSessionScreenTimerPlus;
