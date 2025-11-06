import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import ProgressService from '../services/ProgressService';

/**
 * Pantalla de historial de entrenamientos
 */
const WorkoutHistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // all, week, month

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const progress = ProgressService.getCurrentProgress();
    setHistory(progress.performanceHistory || []);
  };

  const getFilteredHistory = () => {
    const now = new Date();

    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return history.filter(item => new Date(item.date) >= weekAgo);
    }

    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return history.filter(item => new Date(item.date) >= monthAgo);
    }

    return history;
  };

  const filteredHistory = getFilteredHistory();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (minutes) => {
    return `${minutes} min`;
  };

  const getEffortEmoji = (effort) => {
    const emojis = ['😊', '🙂', '😐', '😅', '😰'];
    return emojis[effort - 1] || '😐';
  };

  const getEffortLabel = (effort) => {
    const labels = ['Muy Fácil', 'Fácil', 'Moderado', 'Difícil', 'Muy Difícil'];
    return labels[effort - 1] || 'Moderado';
  };

  const totalStats = {
    workouts: filteredHistory.length,
    totalMinutes: filteredHistory.reduce((sum, item) => sum + item.duration, 0),
    totalCalories: filteredHistory.reduce((sum, item) => sum + item.caloriesBurned, 0),
    avgEffort: filteredHistory.length > 0
      ? (filteredHistory.reduce((sum, item) => sum + item.perceivedEffort, 0) / filteredHistory.length).toFixed(1)
      : 0
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial</Text>
        <Text style={styles.headerSubtitle}>
          Tus entrenamientos completados
        </Text>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'week' && styles.filterButtonActive]}
          onPress={() => setFilter('week')}
        >
          <Text style={[styles.filterText, filter === 'week' && styles.filterTextActive]}>
            Esta semana
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'month' && styles.filterButtonActive]}
          onPress={() => setFilter('month')}
        >
          <Text style={[styles.filterText, filter === 'month' && styles.filterTextActive]}>
            Este mes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Estadísticas resumidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalStats.workouts}</Text>
          <Text style={styles.statLabel}>Entrenamientos</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalStats.totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutos</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalStats.totalCalories}</Text>
          <Text style={styles.statLabel}>Calorías</Text>
        </View>
      </View>

      {/* Lista de entrenamientos */}
      <ScrollView style={styles.historyList}>
        {filteredHistory.length > 0 ? (
          filteredHistory.reverse().map((item, index) => (
            <View key={item.id || index} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View>
                  <Text style={styles.historyDate}>
                    {formatDate(item.date)}
                  </Text>
                  <Text style={styles.historyId}>
                    Workout #{filteredHistory.length - index}
                  </Text>
                </View>
                <View style={styles.effortBadge}>
                  <Text style={styles.effortEmoji}>
                    {getEffortEmoji(item.perceivedEffort)}
                  </Text>
                </View>
              </View>

              <View style={styles.historyStats}>
                <View style={styles.historyStat}>
                  <Text style={styles.historyStatLabel}>Duración</Text>
                  <Text style={styles.historyStatValue}>
                    {formatTime(item.duration)}
                  </Text>
                </View>

                <View style={styles.historyStat}>
                  <Text style={styles.historyStatLabel}>Calorías</Text>
                  <Text style={styles.historyStatValue}>
                    {item.caloriesBurned}
                  </Text>
                </View>

                <View style={styles.historyStat}>
                  <Text style={styles.historyStatLabel}>Esfuerzo</Text>
                  <Text style={styles.historyStatValue}>
                    {getEffortLabel(item.perceivedEffort)}
                  </Text>
                </View>
              </View>

              {item.experienceGained && (
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>
                    +{item.experienceGained} XP
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Aún no has completado ningún entrenamiento'
                : 'No hay entrenamientos en este período'}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('WorkoutGenerator')}
            >
              <Text style={styles.emptyButtonText}>
                Comenzar Entrenamiento
              </Text>
            </TouchableOpacity>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#0f3460',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f3460',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  historyList: {
    flex: 1,
    padding: 16,
  },
  historyCard: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  historyId: {
    fontSize: 12,
    color: '#999',
  },
  effortBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  effortEmoji: {
    fontSize: 24,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  historyStat: {
    flex: 1,
  },
  historyStatLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  historyStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  xpBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutHistoryScreen;
