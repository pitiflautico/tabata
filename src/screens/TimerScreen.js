import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Vibration,
} from 'react-native';
import { AppTheme } from '../theme/AppTheme';
import CircularButton from '../components/CircularButton';
import CircularProgress from '../components/CircularProgress';
import { useApp } from '../context/AppContext';
import { CustomAlert } from '../components/CustomAlert';

const TimerScreen = ({ navigation }) => {
  // Get config and functions from context
  const { config, addWorkout } = useApp();

  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState('PREPARE'); // PREPARE, WORK, REST, COMPLETE
  const [currentTime, setCurrentTime] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [startTime, setStartTime] = useState(null);

  const intervalRef = useRef(null);

  // Get phase configuration
  const getPhaseConfig = (phaseName) => {
    switch (phaseName) {
      case 'PREPARE':
        return {
          duration: config.prepareTime,
          color: AppTheme.colors.prepare,
          label: 'Get Ready',
          nextPhase: 'WORK',
        };
      case 'WORK':
        return {
          duration: config.workTime,
          color: AppTheme.colors.work,
          label: 'Work',
          nextPhase: 'REST',
        };
      case 'REST':
        return {
          duration: config.restTime,
          color: AppTheme.colors.rest,
          label: 'Rest',
          nextPhase: 'WORK',
        };
      case 'CYCLE_REST':
        return {
          duration: config.restBetweenCycles,
          color: AppTheme.colors.secondary,
          label: 'Cycle Rest',
          nextPhase: 'WORK',
        };
      case 'COMPLETE':
        return {
          duration: 0,
          color: AppTheme.colors.success,
          label: 'Complete!',
          nextPhase: null,
        };
      default:
        return {
          duration: 0,
          color: AppTheme.colors.text,
          label: 'Ready',
          nextPhase: null,
        };
    }
  };

  // Start workout
  const startWorkout = () => {
    setIsRunning(true);
    setIsPaused(false);
    setPhase('PREPARE');
    setCurrentTime(config.prepareTime);
    setCurrentRound(1);
    setCurrentCycle(1);
    setStartTime(Date.now());
  };

  // Pause/Resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Stop workout
  const stopWorkout = () => {
    setIsRunning(false);
    setIsPaused(false);
    setPhase('PREPARE');
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Complete workout
  const completeWorkout = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
    const calories = Math.round(duration * 8.5); // Rough estimate: ~8.5 cal/min for HIIT

    addWorkout({
      duration,
      calories,
      rounds: config.rounds,
      cycles: config.cycles,
    });

    CustomAlert.success(
      'Workout Complete! 🎉',
      `Great job! You burned approximately ${calories} calories in ${duration} minutes.`,
      [
        {
          text: 'View Stats',
          onPress: () => navigation.navigate('StatsTab'),
        },
        {
          text: 'Done',
          style: 'cancel',
        },
      ]
    );
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && phase !== 'COMPLETE') {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime <= 0.1) {
            // Move to next phase
            handlePhaseTransition();
            return 0;
          }
          return prevTime - 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, phase]);

  // Handle phase transitions
  const handlePhaseTransition = () => {
    Vibration.vibrate(200);

    if (phase === 'PREPARE') {
      setPhase('WORK');
      setCurrentTime(config.workTime);
    } else if (phase === 'WORK') {
      if (currentRound < config.rounds) {
        setPhase('REST');
        setCurrentTime(config.restTime);
        setCurrentRound(currentRound + 1);
      } else if (currentCycle < config.cycles) {
        setPhase('CYCLE_REST');
        setCurrentTime(config.restBetweenCycles);
        setCurrentRound(1);
        setCurrentCycle(currentCycle + 1);
      } else {
        setPhase('COMPLETE');
        setIsRunning(false);
        completeWorkout();
      }
    } else if (phase === 'REST') {
      setPhase('WORK');
      setCurrentTime(config.workTime);
    } else if (phase === 'CYCLE_REST') {
      setPhase('WORK');
      setCurrentTime(config.workTime);
    }
  };

  const phaseConfig = getPhaseConfig(phase);
  const progress = phaseConfig.duration > 0 ? currentTime / phaseConfig.duration : 0;

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: isRunning ? phaseConfig.color + '15' : AppTheme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <CircularButton
          icon="arrow-back"
          size="medium"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Tabata</Text>
        <CircularButton
          icon="settings-outline"
          size="medium"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      {/* Main Timer Display */}
      <View style={styles.timerContainer}>
        {/* Phase Label */}
        <Text style={styles.phaseLabel}>{phaseConfig.label.toUpperCase()}</Text>

        {/* Circular Progress */}
        <View style={styles.circularProgressContainer}>
          <CircularProgress
            size={280}
            strokeWidth={12}
            progress={progress}
            color={phaseConfig.color}
          >
            <View style={styles.timerContent}>
              <Text style={[styles.timerText, { color: phaseConfig.color }]}>
                {formatTime(currentTime)}
              </Text>
              {phase !== 'PREPARE' && phase !== 'COMPLETE' && (
                <Text style={styles.phaseInfo}>
                  Round {currentRound}/{config.rounds}
                </Text>
              )}
            </View>
          </CircularProgress>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentCycle}</Text>
            <Text style={styles.statLabel}>CYCLE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{config.cycles}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!isRunning ? (
          <CircularButton
            icon="play"
            size="large"
            color={AppTheme.colors.primary}
            iconColor={AppTheme.colors.background}
            onPress={startWorkout}
          />
        ) : (
          <View style={styles.activeControls}>
            <CircularButton
              icon="stop"
              size="medium"
              color={AppTheme.colors.backgroundCard}
              onPress={stopWorkout}
            />
            <CircularButton
              icon={isPaused ? 'play' : 'pause'}
              size="large"
              color={AppTheme.colors.primary}
              iconColor={AppTheme.colors.background}
              onPress={togglePause}
            />
            <CircularButton
              icon="refresh"
              size="medium"
              color={AppTheme.colors.backgroundCard}
              onPress={() => {
                setCurrentTime(phaseConfig.duration);
              }}
            />
          </View>
        )}
      </View>

      {/* Next Phase Preview */}
      {isRunning && phase !== 'COMPLETE' && (
        <View style={styles.nextPhase}>
          <Text style={styles.nextPhaseLabel}>NEXT: {phaseConfig.nextPhase}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50,
    paddingBottom: AppTheme.spacing.lg,
  },
  headerTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.xxxl,
  },
  phaseLabel: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.textSecondary,
    letterSpacing: 2,
    marginBottom: AppTheme.spacing.xl,
  },
  circularProgressContainer: {
    marginVertical: AppTheme.spacing.xl,
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: AppTheme.typography.fontSize.giant,
    fontWeight: AppTheme.typography.fontWeight.bold,
    lineHeight: AppTheme.typography.fontSize.giant * 1.1,
  },
  phaseInfo: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.medium,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: AppTheme.spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.xl,
  },
  statValue: {
    fontSize: AppTheme.typography.fontSize.xxxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  statLabel: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.xs,
    letterSpacing: 1,
  },
  statDivider: {
    width: 2,
    height: 40,
    backgroundColor: AppTheme.colors.backgroundCard,
  },
  controls: {
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingBottom: AppTheme.spacing.xxxl,
    alignItems: 'center',
  },
  activeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  nextPhase: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  nextPhaseLabel: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
    letterSpacing: 1,
  },
});

export default TimerScreen;
