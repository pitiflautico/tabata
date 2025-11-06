import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

/**
 * Componente ExerciseFrameViewer
 * Muestra los frames de un ejercicio con navegación
 */
const ExerciseFrameViewer = ({ exercise, autoPlay = false, interval = 2000 }) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const frames = exercise.frames || [];

  useEffect(() => {
    if (autoPlay && frames.length > 0) {
      const timer = setInterval(() => {
        setCurrentFrameIndex((prev) =>
          prev === frames.length - 1 ? 0 : prev + 1
        );
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, frames.length, interval]);

  if (!frames || frames.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noFramesText}>
          No hay frames disponibles para este ejercicio
        </Text>
      </View>
    );
  }

  const currentFrame = frames[currentFrameIndex];

  const goToNextFrame = () => {
    setCurrentFrameIndex((prev) =>
      prev === frames.length - 1 ? 0 : prev + 1
    );
  };

  const goToPreviousFrame = () => {
    setCurrentFrameIndex((prev) =>
      prev === 0 ? frames.length - 1 : prev - 1
    );
  };

  return (
    <View style={styles.container}>
      {/* Título del ejercicio */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      {/* Área de visualización del frame */}
      <View style={styles.frameContainer}>
        {/* Aquí se mostraría la imagen o avatar 3D */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>
            {currentFrame.title}
          </Text>
          <Text style={styles.placeholderEmoji}>🧍</Text>
        </View>

        {/* Indicador de progreso */}
        <View style={styles.progressContainer}>
          {frames.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentFrameIndex && styles.progressDotActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Información del frame actual */}
      <View style={styles.infoContainer}>
        <Text style={styles.frameTitle}>
          Frame {currentFrameIndex + 1} de {frames.length}: {currentFrame.title}
        </Text>
        <Text style={styles.frameDescription}>
          {currentFrame.description}
        </Text>
        <Text style={styles.frameDuration}>
          Duración: ~{currentFrame.duration}s
        </Text>
      </View>

      {/* Controles de navegación */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={goToPreviousFrame}
        >
          <Text style={styles.controlButtonText}>← Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.controlButtonPrimary]}
          onPress={goToNextFrame}
        >
          <Text style={[styles.controlButtonText, styles.controlButtonTextPrimary]}>
            Siguiente →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
    textAlign: 'center',
  },
  frameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f3460',
    marginBottom: 8,
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#0f3460',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  frameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  frameDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  frameDuration: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  controlButtonPrimary: {
    backgroundColor: '#0f3460',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  controlButtonTextPrimary: {
    color: '#fff',
  },
  noFramesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 32,
  },
});

export default ExerciseFrameViewer;
