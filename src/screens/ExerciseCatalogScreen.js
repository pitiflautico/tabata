import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { exerciseCatalog, lowerBodyExercises, comboExercises } from '../data/exerciseCatalog';
import ExerciseCard from '../components/ExerciseCard';
import { MuscleGroup, ExerciseType } from '../models/Exercise';

/**
 * Pantalla del catálogo de ejercicios
 */
const ExerciseCatalogScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);

  const filters = [
    { key: 'all', label: 'Todos', count: exerciseCatalog.length },
    { key: 'lower', label: 'Tren Inferior', count: lowerBodyExercises.length },
    { key: 'combo', label: 'Combinados', count: comboExercises.length }
  ];

  const muscleGroups = [
    MuscleGroup.LEGS,
    MuscleGroup.GLUTES,
    MuscleGroup.CALVES,
    MuscleGroup.HAMSTRINGS,
    MuscleGroup.FULL_BODY
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
      filtered = filtered.filter(ex =>
        ex.worksMuscleGroup(selectedMuscleGroup)
      );
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredExercises = getFilteredExercises();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo de Ejercicios</Text>
        <Text style={styles.headerSubtitle}>
          {exerciseCatalog.length} ejercicios disponibles
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ejercicios..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtros por tipo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter.key && styles.filterChipTextActive
              ]}
            >
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtros por grupo muscular */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.muscleGroupsContainer}
      >
        <TouchableOpacity
          style={[
            styles.muscleGroupChip,
            !selectedMuscleGroup && styles.muscleGroupChipActive
          ]}
          onPress={() => setSelectedMuscleGroup(null)}
        >
          <Text
            style={[
              styles.muscleGroupChipText,
              !selectedMuscleGroup && styles.muscleGroupChipTextActive
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {muscleGroups.map(group => (
          <TouchableOpacity
            key={group}
            style={[
              styles.muscleGroupChip,
              selectedMuscleGroup === group && styles.muscleGroupChipActive
            ]}
            onPress={() => setSelectedMuscleGroup(group)}
          >
            <Text
              style={[
                styles.muscleGroupChipText,
                selectedMuscleGroup === group && styles.muscleGroupChipTextActive
              ]}
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de ejercicios */}
      <ScrollView style={styles.exerciseList}>
        <View style={styles.resultInfo}>
          <Text style={styles.resultText}>
            {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {filteredExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onPress={() => navigation.navigate('ExerciseDetail', { exercise })}
          />
        ))}

        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              No se encontraron ejercicios
            </Text>
            <Text style={styles.emptySubtext}>
              Intenta con otros filtros
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#0f3460',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0f3460',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  muscleGroupsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  muscleGroupChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  muscleGroupChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  muscleGroupChipText: {
    fontSize: 12,
    color: '#666',
  },
  muscleGroupChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  exerciseList: {
    flex: 1,
    padding: 16,
  },
  resultInfo: {
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default ExerciseCatalogScreen;
