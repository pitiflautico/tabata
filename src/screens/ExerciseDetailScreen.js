import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import ExerciseFrameViewer from '../components/ExerciseFrameViewer';

/**
 * Pantalla de detalle de un ejercicio
 */
const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;

  const getIntensityColor = (cardioIndex) => {
    if (cardioIndex <= 2) return '#4CAF50';
    if (cardioIndex <= 3) return '#FFC107';
    if (cardioIndex <= 4) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.exerciseName}>{exercise.name}</Text>

        {exercise.isCombo && (
          <View style={styles.comboBadge}>
            <Text style={styles.comboText}>EJERCICIO COMBINADO</Text>
          </View>
        )}
      </View>

      {/* Frame Viewer */}
      <View style={styles.frameViewerContainer}>
        <ExerciseFrameViewer exercise={exercise} autoPlay={true} />
      </View>

      {/* Descripción */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>

      {/* Información técnica */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Técnica</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Grupos Musculares</Text>
            <View style={styles.muscleGroupTags}>
              {exercise.muscleGroups.map((group, index) => (
                <View key={index} style={styles.muscleGroupTag}>
                  <Text style={styles.muscleGroupTagText}>{group}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Tipo de Ejercicio</Text>
            <Text style={styles.infoValue}>{exercise.type}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Índice Cardiovascular</Text>
            <View style={styles.cardioIndicator}>
              <View
                style={[
                  styles.cardioBar,
                  {
                    width: `${(exercise.cardioIndex / 5) * 100}%`,
                    backgroundColor: getIntensityColor(exercise.cardioIndex)
                  }
                ]}
              />
            </View>
            <Text style={styles.cardioValue}>
              {exercise.cardioIndex.toFixed(1)} / 5.0
            </Text>
          </View>

          {exercise.equipment.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Equipamiento Necesario</Text>
              {exercise.equipment.map((item, index) => (
                <Text key={index} style={styles.equipmentItem}>
                  • {item}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Variaciones */}
      {exercise.variations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variaciones</Text>
          {exercise.variations.map((variation, index) => (
            <View key={index} style={styles.variationCard}>
              <Text style={styles.variationNumber}>{index + 1}</Text>
              <Text style={styles.variationText}>{variation}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Consejos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Consejos</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            • Mantén una buena forma en todo momento
          </Text>
          <Text style={styles.tipText}>
            • Respira de manera controlada durante el ejercicio
          </Text>
          <Text style={styles.tipText}>
            • Empieza con una intensidad moderada y aumenta gradualmente
          </Text>
          <Text style={styles.tipText}>
            • Descansa si sientes dolor (no confundir con fatiga muscular)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#0f3460',
    fontSize: 16,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  comboBadge: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  comboText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  frameViewerContainer: {
    padding: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoGrid: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  muscleGroupTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleGroupTag: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  muscleGroupTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardioIndicator: {
    height: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardioBar: {
    height: '100%',
    borderRadius: 6,
  },
  cardioValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  equipmentItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginVertical: 4,
  },
  variationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  variationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  variationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tipCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#1976d2',
    marginVertical: 4,
    lineHeight: 20,
  },
});

export default ExerciseDetailScreen;
