import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import CircularButton from '../components/CircularButton';
import Button from '../components/Button';
import Card from '../components/Card';

/**
 * Pantalla de detalle de ejercicio
 */
const NewExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const getIntensityColor = (cardioIndex) => {
    if (cardioIndex <= 2) return AppTheme.colors.success;
    if (cardioIndex <= 3) return AppTheme.colors.warning;
    if (cardioIndex <= 4) return AppTheme.colors.accent3;
    return AppTheme.colors.error;
  };

  const getIntensityLabel = (cardioIndex) => {
    if (cardioIndex <= 2) return 'Baja Intensidad';
    if (cardioIndex <= 3) return 'Intensidad Media';
    if (cardioIndex <= 4) return 'Media-Alta Intensidad';
    return 'Alta Intensidad';
  };

  const currentFrame = exercise.frames && exercise.frames[currentFrameIndex];

  return (
    <View style={CommonStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <CircularButton
          icon="arrow-back"
          size="medium"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {exercise.name}
        </Text>
        <CircularButton
          icon="heart-outline"
          size="medium"
          onPress={() => {}}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

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

          {exercise.isCombo && (
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>EJERCICIO COMBINADO</Text>
            </View>
          )}
        </View>

        {/* Exercise Image */}
        {exercise.imageUrl ? (
          <Card style={styles.imageCard}>
            <Image
              source={{ uri: exercise.imageUrl }}
              style={styles.exerciseImage}
              resizeMode="cover"
            />
          </Card>
        ) : (
          <Card style={styles.imagePlaceholder}>
            <Ionicons
              name="image-outline"
              size={64}
              color={AppTheme.colors.textSecondary}
            />
            <Text style={styles.imagePlaceholderText}>
              Imagen no disponible
            </Text>
          </Card>
        )}

        {/* Description */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{exercise.description}</Text>
        </Card>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <Card style={styles.infoCard}>
            <Ionicons name="body" size={32} color={AppTheme.colors.primary} />
            <Text style={styles.infoLabel}>Grupos</Text>
            <Text style={styles.infoValue}>
              {exercise.muscleGroups.length}
            </Text>
          </Card>

          <Card style={styles.infoCard}>
            <Ionicons name="flash" size={32} color={AppTheme.colors.accent3} />
            <Text style={styles.infoLabel}>Intensidad</Text>
            <Text style={styles.infoValue}>
              {exercise.cardioIndex}/5
            </Text>
          </Card>

          <Card style={styles.infoCard}>
            <Ionicons name="fitness" size={32} color={AppTheme.colors.secondary} />
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {exercise.type}
            </Text>
          </Card>
        </View>

        {/* Muscle Groups */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Músculos Trabajados</Text>
          <View style={styles.muscleGrid}>
            {exercise.muscleGroups.map((muscle, index) => (
              <View key={index} style={styles.muscleChip}>
                <Ionicons
                  name="fitness"
                  size={16}
                  color={AppTheme.colors.primary}
                />
                <Text style={styles.muscleText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Equipment */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Equipo Necesario</Text>
            <View style={styles.equipmentList}>
              {exercise.equipment.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={AppTheme.colors.primary}
                  />
                  <Text style={styles.equipmentText}>{item}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Frames / Steps */}
        {exercise.frames && exercise.frames.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>
              Cómo Ejecutar ({exercise.frames.length} pasos)
            </Text>

            {/* Current Frame */}
            <View style={styles.frameContainer}>
              <View style={styles.frameHeader}>
                <Text style={styles.frameNumber}>
                  Paso {currentFrameIndex + 1}
                </Text>
                <Text style={styles.frameDuration}>
                  {currentFrame.duration}s
                </Text>
              </View>
              <Text style={styles.frameTitle}>{currentFrame.title}</Text>
              <Text style={styles.frameDescription}>
                {currentFrame.description}
              </Text>
            </View>

            {/* Frame Navigation */}
            <View style={styles.frameNavigation}>
              <CircularButton
                icon="chevron-back"
                size="medium"
                disabled={currentFrameIndex === 0}
                onPress={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))}
              />

              <View style={styles.frameDots}>
                {exercise.frames.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.frameDot,
                      index === currentFrameIndex && styles.frameDotActive,
                    ]}
                  />
                ))}
              </View>

              <CircularButton
                icon="chevron-forward"
                size="medium"
                disabled={currentFrameIndex === exercise.frames.length - 1}
                onPress={() =>
                  setCurrentFrameIndex(
                    Math.min(exercise.frames.length - 1, currentFrameIndex + 1)
                  )
                }
              />
            </View>
          </Card>
        )}

        {/* Variations */}
        {exercise.variations && exercise.variations.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Variaciones</Text>
            {exercise.variations.map((variation, index) => (
              <View key={index} style={styles.variationItem}>
                <Ionicons
                  name="git-branch-outline"
                  size={20}
                  color={AppTheme.colors.textSecondary}
                />
                <Text style={styles.variationText}>{variation}</Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <Button
          title="Usar en Workout"
          icon="add-circle"
          onPress={() => {
            // TODO: Añadir a workout
            navigation.goBack();
          }}
          fullWidth
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
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
    flex: 1,
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    textAlign: 'center',
    marginHorizontal: AppTheme.spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: AppTheme.spacing.xl,
  },
  exerciseName: {
    fontSize: AppTheme.typography.fontSize.xxxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.full,
    marginBottom: AppTheme.spacing.sm,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  intensityText: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
  },
  comboBadge: {
    backgroundColor: AppTheme.colors.accent2,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  comboText: {
    color: AppTheme.colors.white,
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.bold,
    letterSpacing: 1,
  },
  imageCard: {
    marginBottom: AppTheme.spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    marginBottom: AppTheme.spacing.lg,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCardLight,
  },
  imagePlaceholderText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.sm,
  },
  section: {
    marginBottom: AppTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.md,
  },
  description: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    lineHeight: AppTheme.typography.fontSize.base * 1.6,
  },
  infoGrid: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: AppTheme.spacing.lg,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: AppTheme.spacing.lg,
  },
  infoLabel: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.sm,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginTop: AppTheme.spacing.xs,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCardLight,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.full,
    margin: 4,
  },
  muscleText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.text,
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  equipmentList: {
    marginTop: AppTheme.spacing.sm,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  equipmentText: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.text,
    marginLeft: AppTheme.spacing.md,
  },
  frameContainer: {
    backgroundColor: AppTheme.colors.backgroundCardLight,
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.lg,
  },
  frameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AppTheme.spacing.sm,
  },
  frameNumber: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  frameDuration: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
  },
  frameTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.sm,
  },
  frameDescription: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    lineHeight: AppTheme.typography.fontSize.base * 1.5,
  },
  frameNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frameDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    marginHorizontal: 4,
  },
  frameDotActive: {
    backgroundColor: AppTheme.colors.primary,
    width: 24,
  },
  variationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  variationText: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.text,
    marginLeft: AppTheme.spacing.md,
  },
  actionBar: {
    padding: AppTheme.layout.screenPadding,
    backgroundColor: AppTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.backgroundCard,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default NewExerciseDetailScreen;
