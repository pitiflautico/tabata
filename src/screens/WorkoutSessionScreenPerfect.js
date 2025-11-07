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
import { Colors, Typography, Layout, getPhaseColor, getTextColor, formatTime } from '../styles/TimerPlusDesign';
import AudioService from '../services/AudioService';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

/**
 * WorkoutSessionScreen - PIXEL PERFECT Timer Plus Design
 */
const WorkoutSessionScreenPerfect = ({ route, navigation }) => {
  const { workout } = route.params;

  // Estados
  const [phase, setPhase] = useState('prepare');
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);

  // Refs
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Datos actuales
  const currentBlock = workout?.blocks[currentBlockIndex];
  const currentExercise = currentBlock?.exercises[currentExerciseIndex];
  const ratio = currentBlock?.ratio || { work: 20, rest: 10 };

  // Calcular rondas totales
  useEffect(() => {
    if (workout) {
      const total = workout.blocks.reduce((sum, block) => sum + block.exercises.length, 0);
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

          // Beep en últimos 3 segundos
          if (prev <= 3 && prev > 0) {
            pulseAnimation();
            AudioService.playCountdownBeep(prev - 1);
          }

          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [isPaused, phase, currentExerciseIndex, currentBlockIndex]);

  // Timer total
  useEffect(() => {
    if (!isPaused && phase !== 'complete') {
      totalTimerRef.current = setInterval(() => {
        setTotalElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(totalTimerRef.current);
    }
  }, [isPaused, phase]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(totalTimerRef.current);
    };
  }, []);

  // Animación pulso
  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.08, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Transición de fase
  const handlePhaseTransition = async () => {
    if (phase === 'prepare') {
      setPhase('work');
      setTimeLeft(ratio.work);
      await AudioService.announcePhaseChange(true, currentExercise?.nameES || currentExercise?.name);

    } else if (phase === 'work') {
      setPhase('rest');
      setTimeLeft(ratio.rest);
      await AudioService.announcePhaseChange(false);

    } else if (phase === 'rest') {
      const isLastExercise = currentExerciseIndex >= currentBlock.exercises.length - 1;
      const isLastBlock = currentBlockIndex >= workout.blocks.length - 1;

      if (isLastExercise && isLastBlock) {
        setPhase('complete');
        await AudioService.vibrateSuccess();
        setTimeout(() => {
          navigation.navigate('WorkoutComplete', { workout, totalTime: totalElapsed });
        }, 2000);

      } else if (isLastExercise) {
        setCurrentBlockIndex(prev => prev + 1);
        setCurrentExerciseIndex(0);
        setPhase('work');
        setTimeLeft(workout.blocks[currentBlockIndex + 1].ratio.work);
        setCurrentRound(prev => prev + 1);

      } else {
        setCurrentExerciseIndex(prev => prev + 1);
        setPhase('work');
        setTimeLeft(ratio.work);
        setCurrentRound(prev => prev + 1);
      }
    }
  };

  // Toggle pause
  const togglePause = () => setIsPaused(!isPaused);

  // Próxima fase
  const getNextPhase = () => {
    if (phase === 'prepare') {
      return { label: 'WORK', time: ratio.work, color: Colors.work };
    } else if (phase === 'work') {
      return { label: 'REST', time: ratio.rest, color: Colors.rest };
    } else if (phase === 'rest') {
      const nextIdx = currentExerciseIndex + 1;
      if (nextIdx < currentBlock.exercises.length) {
        const nextEx = currentBlock.exercises[nextIdx];
        return {
          label: 'UP NEXT',
          exercise: nextEx.nameES || nextEx.name,
          time: ratio.work,
          color: Colors.work,
        };
      }
    }
    return null;
  };

  const backgroundColor = getPhaseColor(phase);
  const textColor = getTextColor(backgroundColor);
  const nextPhase = getNextPhase();
  const roundsLeft = totalRounds - currentRound;

  // Obtener hora actual
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={textColor === Colors.textBlack ? 'dark-content' : 'light-content'} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.headerIcon, { color: textColor }]}>⚙</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerLabel, { color: textColor }]}>
            {phase === 'prepare' ? 'TABATA' : 'ROUNDS'}
          </Text>
          <Text style={[styles.headerTime, { color: textColor }]}>
            {formatTime(totalElapsed)}
          </Text>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
          <Text style={[styles.headerIcon, { color: textColor }]}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* TÍTULO DE FASE */}
      <View style={styles.phaseTitleContainer}>
        <Text style={[styles.phaseTitle, { color: textColor }]}>
          {phase.toUpperCase()}
        </Text>
      </View>

      {/* TIMER GIGANTE */}
      <Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.timerGiant, { color: textColor }]}>
          {formatTime(timeLeft)}
        </Text>
      </Animated.View>

      {/* EJERCICIO ACTUAL (solo en work/rest) */}
      {phase !== 'prepare' && currentExercise && (
        <View style={styles.exerciseContainer}>
          <Text style={[styles.exerciseName, { color: textColor }]}>
            {currentExercise.nameES || currentExercise.name}
          </Text>
        </View>
      )}

      {/* BARRA DE PRÓXIMA FASE */}
      {nextPhase && (
        <View style={[styles.nextBar, { backgroundColor: nextPhase.color }]}>
          <Text style={styles.nextLabel}>{nextPhase.label}</Text>
          <Text style={styles.nextTime}>{formatTime(nextPhase.time)}</Text>
          {nextPhase.exercise && (
            <Text style={styles.nextExercise}>{nextPhase.exercise}</Text>
          )}
        </View>
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        {/* Contador izquierda */}
        <View style={styles.counter}>
          <Text style={[styles.counterValue, { color: Colors.blue }]}>
            {roundsLeft}
          </Text>
          <Text style={[styles.counterLabel, { color: textColor }]}>
            ROUNDS LEFT
          </Text>
        </View>

        {/* Botón central */}
        <TouchableOpacity
          style={[
            isPaused ? styles.buttonCircle : styles.buttonSquare,
            {
              backgroundColor:
                phase === 'prepare'
                  ? Colors.yellow
                  : phase === 'work'
                  ? Colors.green
                  : phase === 'rest'
                  ? Colors.rest
                  : Colors.textBlack,
            },
          ]}
          onPress={togglePause}
        >
          <Text style={styles.buttonIcon}>{isPaused ? '▶' : '■'}</Text>
        </TouchableOpacity>

        {/* Contador derecha (cycles si aplica) */}
        {currentBlockIndex < workout.blocks.length && (
          <View style={styles.counter}>
            <Text style={[styles.counterValue, { color: Colors.yellow }]}>
              {workout.blocks.length - currentBlockIndex}
            </Text>
            <Text style={[styles.counterLabel, { color: textColor }]}>
              CYCLES LEFT
            </Text>
          </View>
        )}
      </View>

      {/* BOTTOM TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabIcon}>⏱</Text>
          <Text style={styles.tabLabel}>TABATA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabIcon}>↻</Text>
          <Text style={styles.tabLabel}>ROUNDS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabIcon}>⏲</Text>
          <Text style={styles.tabLabel}>STOPWATCH</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabIcon}>⋯</Text>
          <Text style={styles.tabLabel}>MORE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerIcon: {
    fontSize: 28,
    fontWeight: '600',
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerLabel: {
    ...Typography.smallText,
    fontSize: 11,
  },

  headerTime: {
    ...Typography.headerTimer,
  },

  // Fase
  phaseTitleContainer: {
    alignItems: 'center',
    marginTop: 8,
  },

  phaseTitle: {
    ...Typography.phaseTitle,
  },

  // Timer
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  timerGiant: {
    ...Typography.timerGiant,
  },

  // Ejercicio
  exerciseContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },

  exerciseName: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // Barra siguiente
  nextBar: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  nextLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textBlack,
    letterSpacing: 1,
  },

  nextTime: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textBlack,
    marginTop: 2,
    letterSpacing: -1,
  },

  nextExercise: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textBlack,
    marginTop: 6,
    textAlign: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  counter: {
    alignItems: 'center',
    minWidth: 80,
  },

  counterValue: {
    ...Typography.counterValue,
  },

  counterLabel: {
    ...Typography.counterLabel,
    marginTop: 4,
  },

  buttonSquare: {
    ...Layout.buttonSquareLarge,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonCircle: {
    ...Layout.buttonCircleLarge,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonIcon: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textBlack,
  },

  // Bottom Tab Bar
  tabBar: {
    flexDirection: 'row',
    height: Layout.tabBarHeight,
    backgroundColor: Colors.black,
    borderTopWidth: 0.5,
    borderTopColor: Colors.mediumGray,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabIcon: {
    fontSize: 24,
    color: Colors.textWhite,
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textWhite,
    letterSpacing: 0.5,
  },
});

export default WorkoutSessionScreenPerfect;
