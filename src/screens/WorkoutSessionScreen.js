import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal
} from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Pantalla de sesión de entrenamiento en vivo
 */
const WorkoutSessionScreen = ({ route, navigation }) => {
  const { workout } = route.params;

  // Estados
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const intervalRef = useRef(null);
  const totalIntervalRef = useRef(null);

  // Obtener datos actuales
  const currentBlock = workout.blocks[currentBlockIndex];
  const currentExercise = currentBlock?.exercises[currentExerciseIndex];
  const ratio = currentBlock?.ratio || { work: 40, rest: 20 };

  // Inicializar timer
  useEffect(() => {
    setTimeLeft(ratio.work);

    // Timer para tiempo total
    totalIntervalRef.current = setInterval(() => {
      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(totalIntervalRef.current);
    };
  }, []);

  // Timer principal
  useEffect(() => {
    if (!isPaused && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Cambiar de fase o ejercicio
            handlePhaseChange();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isPaused, isFinished, isWorkPhase, currentExerciseIndex, currentBlockIndex]);

  // Cambio automático de frames durante ejercicio
  useEffect(() => {
    if (isWorkPhase && currentExercise?.frames.length > 0) {
      const frameInterval = setInterval(() => {
        setCurrentFrameIndex(prev =>
          (prev + 1) % currentExercise.frames.length
        );
      }, 2000); // Cambiar frame cada 2 segundos

      return () => clearInterval(frameInterval);
    }
  }, [isWorkPhase, currentExercise]);

  const handlePhaseChange = () => {
    if (isWorkPhase) {
      // Fin del trabajo, empezar descanso
      setIsWorkPhase(false);
      setTimeLeft(ratio.rest);
      playSound('rest');
      setCurrentFrameIndex(0);
    } else {
      // Fin del descanso, siguiente ejercicio
      if (currentExerciseIndex < currentBlock.exercises.length - 1) {
        // Siguiente ejercicio en el mismo bloque
        setCurrentExerciseIndex(prev => prev + 1);
        setIsWorkPhase(true);
        setTimeLeft(ratio.work);
        setCurrentFrameIndex(0);
        playSound('work');
      } else {
        // Fin del bloque
        if (currentBlockIndex < workout.blocks.length - 1) {
          // Siguiente bloque
          setCurrentBlockIndex(prev => prev + 1);
          setCurrentExerciseIndex(0);
          setIsWorkPhase(true);
          setTimeLeft(ratio.work);
          setCurrentFrameIndex(0);
          playSound('block_complete');
        } else {
          // Fin del entrenamiento
          finishWorkout();
        }
      }
    }
  };

  const playSound = (type) => {
    // Placeholder para audio - se implementará con expo-av
    console.log(`Playing sound: ${type}`);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleSkip = () => {
    Alert.alert(
      'Saltar ejercicio',
      '¿Estás seguro de que quieres saltar este ejercicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Saltar',
          onPress: () => {
            setTimeLeft(0);
            handlePhaseChange();
          }
        }
      ]
    );
  };

  const handleQuit = () => {
    Alert.alert(
      'Terminar entrenamiento',
      '¿Estás seguro de que quieres terminar? Tu progreso no se guardará.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Terminar',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const finishWorkout = () => {
    setIsFinished(true);
    clearInterval(intervalRef.current);
    clearInterval(totalIntervalRef.current);
    playSound('workout_complete');

    // Aquí se guardaría el progreso
    setTimeout(() => {
      navigation.navigate('WorkoutComplete', {
        workout,
        totalTime,
        completedAt: new Date()
      });
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    if (isFinished) return '#4CAF50';
    return isWorkPhase ? '#FF5722' : '#2196F3';
  };

  const getPhaseLabel = () => {
    if (isFinished) return '¡COMPLETADO!';
    return isWorkPhase ? 'TRABAJO' : 'DESCANSO';
  };

  const getNextExercise = () => {
    if (isWorkPhase) {
      return currentExercise;
    } else {
      if (currentExerciseIndex < currentBlock.exercises.length - 1) {
        return currentBlock.exercises[currentExerciseIndex + 1];
      } else if (currentBlockIndex < workout.blocks.length - 1) {
        return workout.blocks[currentBlockIndex + 1].exercises[0];
      }
      return null;
    }
  };

  const calculateProgress = () => {
    const totalExercises = workout.blocks.reduce((sum, block) =>
      sum + block.exercises.length, 0
    );
    const completedExercises = workout.blocks.slice(0, currentBlockIndex).reduce((sum, block) =>
      sum + block.exercises.length, 0
    ) + currentExerciseIndex + (isWorkPhase ? 0 : 1);

    return (completedExercises / totalExercises) * 100;
  };

  if (!currentExercise) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const currentFrame = currentExercise.frames[currentFrameIndex];
  const nextExercise = getNextExercise();

  return (
    <View style={styles.container}>
      {/* Header con progreso */}
      <View style={styles.header}>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${calculateProgress()}%` }]}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerText}>
            Bloque {currentBlockIndex + 1}/{workout.blocks.length}
          </Text>
          <Text style={styles.headerText}>
            Ejercicio {currentExerciseIndex + 1}/{currentBlock.exercises.length}
          </Text>
          <Text style={styles.headerText}>
            Total: {formatTime(totalTime)}
          </Text>
        </View>
      </View>

      {/* Indicador de fase */}
      <View style={[styles.phaseIndicator, { backgroundColor: getPhaseColor() }]}>
        <Text style={styles.phaseLabel}>{getPhaseLabel()}</Text>
      </View>

      {/* Timer principal */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: getPhaseColor() }]}>
          {formatTime(timeLeft)}
        </Text>
        {isPaused && (
          <Text style={styles.pausedLabel}>PAUSADO</Text>
        )}
      </View>

      {/* Ejercicio actual */}
      <View style={styles.exerciseContainer}>
        <Text style={styles.exerciseName}>
          {isWorkPhase ? currentExercise.name : 'Descansa'}
        </Text>

        {isWorkPhase && currentFrame && (
          <View style={styles.frameContainer}>
            <View style={styles.framePlaceholder}>
              <Text style={styles.framePlaceholderEmoji}>🏋️</Text>
              <Text style={styles.frameTitle}>{currentFrame.title}</Text>
            </View>
            <Text style={styles.frameDescription}>
              {currentFrame.description}
            </Text>

            {/* Indicadores de frames */}
            <View style={styles.frameIndicators}>
              {currentExercise.frames.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.frameIndicator,
                    index === currentFrameIndex && styles.frameIndicatorActive
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {!isWorkPhase && (
          <View style={styles.restContainer}>
            <Text style={styles.restEmoji}>😌</Text>
            <Text style={styles.restText}>Respira y prepárate</Text>
          </View>
        )}
      </View>

      {/* Próximo ejercicio */}
      {nextExercise && !isWorkPhase && (
        <View style={styles.nextExerciseContainer}>
          <Text style={styles.nextExerciseLabel}>Siguiente:</Text>
          <Text style={styles.nextExerciseName}>{nextExercise.name}</Text>
        </View>
      )}

      {/* Controles */}
      <View style={styles.controls}>
        {!isFinished && (
          <>
            <TouchableOpacity
              style={[styles.controlButton, styles.quitButton]}
              onPress={handleQuit}
            >
              <Text style={styles.controlButtonText}>✕</Text>
            </TouchableOpacity>

            {!isPaused ? (
              <TouchableOpacity
                style={[styles.controlButton, styles.pauseButton]}
                onPress={handlePause}
              >
                <Text style={styles.controlButtonText}>❚❚</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.controlButton, styles.resumeButton]}
                onPress={handleResume}
              >
                <Text style={styles.controlButtonText}>▶</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.controlButton, styles.skipButton]}
              onPress={handleSkip}
            >
              <Text style={styles.controlButtonText}>⏭</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Modal de finalización */}
      <Modal visible={isFinished} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Entrenamiento Completado!</Text>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalText}>
              Tiempo total: {formatTime(totalTime)}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#0f3460',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#eaeaea',
    fontSize: 12,
  },
  phaseIndicator: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  phaseLabel: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  timerText: {
    fontSize: 96,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  pausedLabel: {
    color: '#FF9800',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  exerciseContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eaeaea',
    textAlign: 'center',
    marginBottom: 24,
  },
  frameContainer: {
    alignItems: 'center',
  },
  framePlaceholder: {
    width: width - 80,
    height: 200,
    backgroundColor: '#0f3460',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  framePlaceholderEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  frameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eaeaea',
  },
  frameDescription: {
    fontSize: 16,
    color: '#eaeaea',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  frameIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  frameIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0f3460',
    marginHorizontal: 4,
  },
  frameIndicatorActive: {
    backgroundColor: '#4CAF50',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  restContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  restEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  restText: {
    fontSize: 20,
    color: '#eaeaea',
    fontStyle: 'italic',
  },
  nextExerciseContainer: {
    backgroundColor: '#0f3460',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  nextExerciseLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  nextExerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eaeaea',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  controlButtonText: {
    fontSize: 28,
    color: '#fff',
  },
  quitButton: {
    backgroundColor: '#F44336',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  skipButton: {
    backgroundColor: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    width: width - 80,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  modalEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    color: '#666',
  },
});

export default WorkoutSessionScreen;
