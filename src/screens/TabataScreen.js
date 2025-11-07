import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { AppTheme } from '../theme/AppTheme';
import AppHeader from '../components/AppHeader';
import StateSection from '../components/StateSection';
import Counter from '../components/Counter';
import CircularButton from '../components/CircularButton';

const TabataScreen = ({ navigation }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState('PREPARE'); // PREPARE, WORK, REST
  const [currentTime, setCurrentTime] = useState(0);
  const [roundsLeft, setRoundsLeft] = useState(2);
  const [cyclesLeft, setCyclesLeft] = useState(3);

  // Configuración del timer (debería venir de settings)
  const [config, setConfig] = useState({
    prepareTime: 10,
    workTime: 30,
    restTime: 10,
    rounds: 4,
    cycles: 3,
    restBetweenCycles: 30,
  });

  const intervalRef = useRef(null);

  const getTimeForState = (state) => {
    switch (state) {
      case 'PREPARE':
        return config.prepareTime;
      case 'WORK':
        return config.workTime;
      case 'REST':
        return config.restTime;
      default:
        return 0;
    }
  };

  const getNextState = (current) => {
    if (current === 'PREPARE') return 'WORK';
    if (current === 'WORK') return 'REST';
    if (current === 'REST') return 'WORK';
    return 'PREPARE';
  };

  const startTimer = () => {
    setIsRunning(true);
    setCurrentState('PREPARE');
    setCurrentTime(config.prepareTime);
    setRoundsLeft(config.rounds);
    setCyclesLeft(config.cycles);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setCurrentState('PREPARE');
    setCurrentTime(0);
    setRoundsLeft(config.rounds);
    setCyclesLeft(config.cycles);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime <= 0.1) {
            // Cambiar de estado
            const nextState = getNextState(currentState);
            setCurrentState(nextState);

            // Actualizar rounds/cycles
            if (currentState === 'REST') {
              setRoundsLeft((prev) => prev - 1);
            }

            return getTimeForState(nextState);
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
  }, [isRunning, currentState]);

  const getPreviewTimes = () => {
    if (currentState === 'PREPARE') {
      return {
        work: config.workTime,
        rest: config.restTime,
      };
    } else if (currentState === 'WORK') {
      return {
        rest: config.restTime,
      };
    } else if (currentState === 'REST') {
      return {
        work: config.workTime,
      };
    }
    return {};
  };

  const previewTimes = getPreviewTimes();

  return (
    <View style={styles.container}>
      <AppHeader
        title="TABATA"
        subtitle={`${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}`}
        titleColor={AppTheme.colors.prepare}
        leftButton={{
          icon: 'settings-outline',
          onPress: () => navigation.navigate('Settings'),
        }}
        rightButton={{
          icon: 'refresh-outline',
          onPress: resetTimer,
        }}
      />

      <View style={styles.timerContainer}>
        {/* Estado actual */}
        <StateSection
          state={currentState}
          time={currentTime}
          isActive={true}
          showMilliseconds={false}
        />

        {/* Preview del siguiente estado */}
        {previewTimes.work && (
          <StateSection
            state="WORK"
            time={previewTimes.work}
            isActive={false}
            showMilliseconds={false}
          />
        )}

        {previewTimes.rest && (
          <StateSection
            state="REST"
            time={previewTimes.rest}
            isActive={false}
            showMilliseconds={false}
          />
        )}
      </View>

      {/* Contadores y controles */}
      <View style={styles.controlsContainer}>
        <View style={styles.countersRow}>
          <Counter
            value={roundsLeft}
            label="ROUNDS LEFT"
            color={AppTheme.colors.rounds}
            size="medium"
          />

          <CircularButton
            icon={isRunning ? 'square' : 'play'}
            size="large"
            color={AppTheme.colors.prepare}
            iconColor={AppTheme.colors.black}
            onPress={isRunning ? stopTimer : startTimer}
          />

          <Counter
            value={cyclesLeft}
            label="CYCLES LEFT"
            color={AppTheme.colors.cycles}
            size="medium"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  controlsContainer: {
    paddingBottom: AppTheme.spacing.xl,
  },
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
  },
});

export default TabataScreen;
