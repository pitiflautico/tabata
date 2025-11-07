import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';
import { WORKOUT_PRESETS } from '../data/workoutPresets';
import Button from './Button';
import Card from './Card';

/**
 * Modal para seleccionar presets de workout
 */
const WorkoutPresetsModal = ({ visible, onClose, onSelectPreset }) => {
  const handleSelectPreset = (preset) => {
    onSelectPreset(preset);
    onClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return AppTheme.colors.success;
      case 'medium':
        return AppTheme.colors.warning;
      case 'hard':
        return AppTheme.colors.accent3;
      case 'extreme':
        return AppTheme.colors.error;
      default:
        return AppTheme.colors.textSecondary;
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
      case 'extreme':
        return 'Extremo';
      default:
        return difficulty;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="flash" size={28} color={AppTheme.colors.primary} />
              <Text style={styles.title}>Entrenamientos Rápidos</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={AppTheme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Selecciona un preset predefinido y comienza ya
          </Text>

          {/* Presets List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {WORKOUT_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                onPress={() => handleSelectPreset(preset)}
              >
                <Card style={styles.presetCard}>
                  <View style={styles.presetHeader}>
                    <View
                      style={[
                        styles.presetIcon,
                        { backgroundColor: preset.color + '20' },
                      ]}
                    >
                      <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                    </View>
                    <View style={styles.presetInfo}>
                      <Text style={styles.presetName}>{preset.name}</Text>
                      <Text style={styles.presetDescription}>
                        {preset.description}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={AppTheme.colors.textSecondary}
                    />
                  </View>

                  <View style={styles.presetMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={AppTheme.colors.textSecondary}
                      />
                      <Text style={styles.metaText}>
                        {preset.estimatedDuration} min
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons
                        name="flame-outline"
                        size={16}
                        color={AppTheme.colors.textSecondary}
                      />
                      <Text style={styles.metaText}>
                        ~{preset.estimatedCalories} kcal
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor:
                            getDifficultyColor(preset.difficulty) + '20',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          { color: getDifficultyColor(preset.difficulty) },
                        ]}
                      >
                        {getDifficultyLabel(preset.difficulty)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.focusContainer}>
                    {preset.focus.map((focus, index) => (
                      <View key={index} style={styles.focusChip}>
                        <Text style={styles.focusText}>{focus}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    backgroundColor: AppTheme.colors.background,
    borderTopLeftRadius: AppTheme.borderRadius.xxl,
    borderTopRightRadius: AppTheme.borderRadius.xxl,
    maxHeight: '80%',
    paddingTop: AppTheme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
    marginBottom: AppTheme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginLeft: AppTheme.spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    paddingHorizontal: AppTheme.layout.screenPadding,
    marginBottom: AppTheme.spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingBottom: AppTheme.spacing.xxl,
  },
  presetCard: {
    marginBottom: AppTheme.spacing.md,
    padding: AppTheme.spacing.base,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  presetIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  presetEmoji: {
    fontSize: 28,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: 2,
  },
  presetDescription: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
  },
  presetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
    gap: AppTheme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: AppTheme.borderRadius.sm,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
  },
  focusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.xs,
  },
  focusChip: {
    backgroundColor: AppTheme.colors.backgroundCardLight,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: AppTheme.borderRadius.sm,
  },
  focusText: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
  },
});

export default WorkoutPresetsModal;
