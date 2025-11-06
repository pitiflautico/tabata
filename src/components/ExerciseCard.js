import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Componente ExerciseCard
 * Muestra la información básica de un ejercicio
 */
const ExerciseCard = ({ exercise, onPress }) => {
  const getIntensityColor = (cardioIndex) => {
    if (cardioIndex <= 2) return '#4CAF50'; // Verde - baja
    if (cardioIndex <= 3) return '#FFC107'; // Amarillo - media
    if (cardioIndex <= 4) return '#FF9800'; // Naranja - media-alta
    return '#F44336'; // Rojo - alta
  };

  const getIntensityLabel = (cardioIndex) => {
    if (cardioIndex <= 2) return 'Baja';
    if (cardioIndex <= 3) return 'Media';
    if (cardioIndex <= 4) return 'Media-Alta';
    return 'Alta';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{exercise.name}</Text>
        {exercise.isCombo && (
          <View style={styles.comboBadge}>
            <Text style={styles.comboText}>COMBO</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {exercise.description}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Grupos:</Text>
          <Text style={styles.infoValue}>
            {exercise.muscleGroups.slice(0, 2).join(', ')}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{exercise.type}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityLabel}>Intensidad:</Text>
          <View
            style={[
              styles.intensityBadge,
              { backgroundColor: getIntensityColor(exercise.cardioIndex) }
            ]}
          >
            <Text style={styles.intensityText}>
              {getIntensityLabel(exercise.cardioIndex)}
            </Text>
          </View>
        </View>

        {exercise.equipment.length > 0 && (
          <View style={styles.equipmentContainer}>
            <Text style={styles.equipmentIcon}>🏋️</Text>
            <Text style={styles.equipmentText}>
              {exercise.equipment[0]}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    flex: 1,
  },
  comboBadge: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  comboText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  intensityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  intensityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  equipmentText: {
    fontSize: 12,
    color: '#666',
  },
});

export default ExerciseCard;
