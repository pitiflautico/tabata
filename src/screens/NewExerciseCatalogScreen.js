import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import { exerciseCatalog, lowerBodyExercises, comboExercises } from '../data/exerciseCatalog';
import ExerciseCard from '../components/ExerciseCard';
import CircularButton from '../components/CircularButton';
import { MuscleGroup } from '../models/Exercise';

/**
 * Pantalla del catálogo de ejercicios - Rediseñada
 */
const NewExerciseCatalogScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);

  const filters = [
    { key: 'all', label: 'Todos', count: exerciseCatalog.length },
    { key: 'lower', label: 'Tren Inferior', count: lowerBodyExercises.length },
    { key: 'combo', label: 'Combinados', count: comboExercises.length },
  ];

  const muscleGroups = [
    { key: MuscleGroup.LEGS, label: 'Piernas', icon: 'fitness' },
    { key: MuscleGroup.GLUTES, label: 'Glúteos', icon: 'fitness-outline' },
    { key: MuscleGroup.CALVES, label: 'Pantorrillas', icon: 'walk' },
    { key: MuscleGroup.HAMSTRINGS, label: 'Isquios', icon: 'barbell' },
    { key: MuscleGroup.FULL_BODY, label: 'Cuerpo Completo', icon: 'body' },
  ];

  const getFilteredExercises = () => {
    let filtered = exerciseCatalog;

    // Filtrar por tipo
    if (selectedFilter === 'lower') {
      filtered = lowerBodyExercises;
    } else if (selectedFilter === 'combo') {
      filtered = comboExercises;
    }

    // Filtrar por grupo muscular
    if (selectedMuscleGroup) {
      filtered = filtered.filter((ex) =>
        ex.worksMuscleGroup(selectedMuscleGroup)
      );
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredExercises = getFilteredExercises();

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetail', { exercise });
  };

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <CircularButton
          icon="arrow-back"
          size="medium"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Ejercicios</Text>
          <Text style={styles.headerSubtitle}>
            {exerciseCatalog.length} disponibles
          </Text>
        </View>
        <CircularButton
          icon="add-circle-outline"
          size="medium"
          onPress={() => {}}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={AppTheme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ejercicios..."
          placeholderTextColor={AppTheme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color={AppTheme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter.key && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <View
              style={[
                styles.filterCount,
                selectedFilter === filter.key && styles.filterCountActive,
              ]}
            >
              <Text
                style={[
                  styles.filterCountText,
                  selectedFilter === filter.key && styles.filterCountTextActive,
                ]}
              >
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Muscle Group Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.muscleScroll}
        contentContainerStyle={styles.muscleContent}
      >
        {muscleGroups.map((group) => (
          <TouchableOpacity
            key={group.key}
            style={[
              styles.muscleChip,
              selectedMuscleGroup === group.key && styles.muscleChipActive,
            ]}
            onPress={() =>
              setSelectedMuscleGroup(
                selectedMuscleGroup === group.key ? null : group.key
              )
            }
          >
            <Ionicons
              name={group.icon}
              size={16}
              color={
                selectedMuscleGroup === group.key
                  ? AppTheme.colors.background
                  : AppTheme.colors.primary
              }
            />
            <Text
              style={[
                styles.muscleChipText,
                selectedMuscleGroup === group.key && styles.muscleChipTextActive,
              ]}
            >
              {group.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''}
        </Text>
        {(selectedFilter !== 'all' || selectedMuscleGroup || searchQuery) && (
          <TouchableOpacity
            onPress={() => {
              setSelectedFilter('all');
              setSelectedMuscleGroup(null);
              setSearchQuery('');
            }}
          >
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filteredExercises}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={AppTheme.colors.textTertiary} />
            <Text style={styles.emptyTitle}>No se encontraron ejercicios</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedType || selectedMuscleGroup
                ? 'Intenta ajustar los filtros o la búsqueda'
                : 'No hay ejercicios disponibles'}
            </Text>
            {(searchQuery || selectedType || selectedMuscleGroup) && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedType(null);
                  setSelectedMuscleGroup(null);
                }}
              >
                <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            onPress={() => handleExercisePress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50,
    paddingBottom: AppTheme.spacing.lg,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  headerSubtitle: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
    paddingHorizontal: AppTheme.spacing.base,
    marginHorizontal: AppTheme.layout.screenPadding,
    marginBottom: AppTheme.spacing.base,
    height: 48,
  },
  searchIcon: {
    marginRight: AppTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.text,
  },
  filtersScroll: {
    marginBottom: AppTheme.spacing.base,
  },
  filtersContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundCard,
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.base,
    borderRadius: AppTheme.borderRadius.full,
    marginRight: AppTheme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  filterChipText: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
    marginRight: AppTheme.spacing.xs,
  },
  filterChipTextActive: {
    color: AppTheme.colors.background,
  },
  filterCount: {
    backgroundColor: AppTheme.colors.backgroundCardLight,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: AppTheme.borderRadius.sm,
  },
  filterCountActive: {
    backgroundColor: AppTheme.colors.background + '40',
  },
  filterCountText: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  filterCountTextActive: {
    color: AppTheme.colors.white,
  },
  muscleScroll: {
    marginBottom: AppTheme.spacing.base,
  },
  muscleContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primary + '20',
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.full,
    marginRight: AppTheme.spacing.sm,
    borderWidth: 1,
    borderColor: AppTheme.colors.primary,
  },
  muscleChipActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  muscleChipText: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.primary,
    marginLeft: 6,
  },
  muscleChipTextActive: {
    color: AppTheme.colors.background,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingVertical: AppTheme.spacing.md,
  },
  resultsText: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
  },
  clearFiltersText: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.primary,
  },
  listContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.xxxl * 2,
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  emptyTitle: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  clearFiltersButton: {
    marginTop: AppTheme.spacing.xl,
    paddingHorizontal: AppTheme.spacing.xl,
    paddingVertical: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
  },
});

export default NewExerciseCatalogScreen;
