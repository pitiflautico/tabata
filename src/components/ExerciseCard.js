import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

/**
 * Componente ExerciseCard - Rediseñado con nuevo tema
 */
const ExerciseCard = ({ exercise, onPress }) => {
  const getIntensityColor = (cardioIndex) => {
    if (cardioIndex <= 2) return AppTheme.colors.success;
    if (cardioIndex <= 3) return AppTheme.colors.warning;
    if (cardioIndex <= 4) return AppTheme.colors.accent3;
    return AppTheme.colors.error;
  };

  const getIntensityLabel = (cardioIndex) => {
    if (cardioIndex <= 2) return 'Baja';
    if (cardioIndex <= 3) return 'Media';
    if (cardioIndex <= 4) return 'Media-Alta';
    return 'Alta';
  };

  const getMuscleGroupIcon = (group) => {
    const icons = {
      'LEGS': 'fitness',
      'GLUTES': 'fitness-outline',
      'CALVES': 'walk',
      'HAMSTRINGS': 'barbell',
      'FULL_BODY': 'body',
      'CORE': 'trending-up',
    };
    return icons[group] || 'fitness';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {exercise.name}
        </Text>
        {exercise.isCombo && (
          <View style={styles.comboBadge}>
            <Text style={styles.comboText}>COMBO</Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {exercise.description}
      </Text>

      {/* Muscle Groups Icons */}
      <View style={styles.muscleRow}>
        {exercise.muscleGroups.slice(0, 3).map((group, index) => (
          <View key={index} style={styles.muscleItem}>
            <Ionicons
              name={getMuscleGroupIcon(group)}
              size={16}
              color={AppTheme.colors.primary}
            />
            <Text style={styles.muscleText}>{group}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Intensity Badge */}
        <View
          style={[
            styles.intensityBadge,
            { backgroundColor: getIntensityColor(exercise.cardioIndex) + '20' }
          ]}
        >
          <View
            style={[
              styles.intensityDot,
              { backgroundColor: getIntensityColor(exercise.cardioIndex) }
            ]}
          />
          <Text
            style={[
              styles.intensityText,
              { color: getIntensityColor(exercise.cardioIndex) }
            ]}
          >
            {getIntensityLabel(exercise.cardioIndex)}
          </Text>
        </View>

        {/* Equipment */}
        {exercise.equipment.length > 0 && (
          <View style={styles.equipmentBadge}>
            <Ionicons
              name="barbell-outline"
              size={14}
              color={AppTheme.colors.textSecondary}
            />
            <Text style={styles.equipmentText}>
              {exercise.equipment[0]}
            </Text>
          </View>
        )}

        {/* Type */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{exercise.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.base,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  name: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    flex: 1,
    marginRight: AppTheme.spacing.sm,
  },
  comboBadge: {
    backgroundColor: AppTheme.colors.accent2,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  comboText: {
    color: AppTheme.colors.white,
    fontSize: AppTheme.typography.fontSize.xxs,
    fontWeight: AppTheme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.md,
    lineHeight: AppTheme.typography.fontSize.sm * 1.4,
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: AppTheme.spacing.md,
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCardLight,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
    marginRight: AppTheme.spacing.xs,
    marginBottom: AppTheme.spacing.xs,
  },
  muscleText: {
    fontSize: AppTheme.typography.fontSize.xxs,
    color: AppTheme.colors.textSecondary,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
    marginRight: AppTheme.spacing.sm,
  },
  intensityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  intensityText: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCardLight,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
    marginRight: AppTheme.spacing.sm,
  },
  equipmentText: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginLeft: 4,
  },
  typeBadge: {
    backgroundColor: AppTheme.colors.primary + '20',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  typeText: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
  },
});

export default ExerciseCard;
