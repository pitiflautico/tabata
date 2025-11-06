import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Componente TabataTimer
 * Temporizador para entrenamientos Tabata con ratio trabajo/descanso
 */
const TabataTimer = ({
  workTime = 40,
  restTime = 20,
  onWorkPhase,
  onRestPhase,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [completedRounds, setCompletedRounds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Cambiar de fase
            if (isWorkPhase) {
              setIsWorkPhase(false);
              if (onRestPhase) onRestPhase();
              return restTime;
            } else {
              setIsWorkPhase(true);
              setCompletedRounds((prev) => prev + 1);
              if (onWorkPhase) onWorkPhase();
              return workTime;
            }
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isActive, isPaused, isWorkPhase, workTime, restTime, onWorkPhase, onRestPhase]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(workTime);
    setIsWorkPhase(true);
    setCompletedRounds(0);
    clearInterval(intervalRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    return isWorkPhase ? '#4CAF50' : '#FF9800';
  };

  const getPhaseLabel = () => {
    return isWorkPhase ? 'TRABAJO' : 'DESCANSO';
  };

  return (
    <View style={styles.container}>
      {/* Indicador de fase */}
      <View style={[styles.phaseIndicator, { backgroundColor: getPhaseColor() }]}>
        <Text style={styles.phaseLabel}>{getPhaseLabel()}</Text>
      </View>

      {/* Temporizador principal */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: getPhaseColor() }]}>
          {formatTime(timeLeft)}
        </Text>
      </View>

      {/* Información de rondas */}
      <Text style={styles.roundsText}>
        Rondas completadas: {completedRounds}
      </Text>

      {/* Controles */}
      <View style={styles.controls}>
        {!isActive ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={startTimer}
          >
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        ) : (
          <>
            {!isPaused ? (
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={pauseTimer}
              >
                <Text style={styles.buttonText}>Pausar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.resumeButton]}
                onPress={resumeTimer}
              >
                <Text style={styles.buttonText}>Reanudar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetTimer}
            >
              <Text style={styles.buttonText}>Reiniciar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${((isWorkPhase ? workTime - timeLeft : restTime - timeLeft) /
                       (isWorkPhase ? workTime : restTime)) * 100}%`,
              backgroundColor: getPhaseColor()
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phaseIndicator: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 24,
  },
  phaseLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  roundsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    backgroundColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default TabataTimer;
