import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import ProgressService from '../services/ProgressService';

const { width } = Dimensions.get('window');

/**
 * Pantalla de progreso del usuario
 */
const ProgressScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const userProgress = ProgressService.getCurrentProgress();
    const stats = ProgressService.getWeeklyStats();
    const userAchievements = ProgressService.getAchievements();
    const performanceTrends = ProgressService.analyzePerformanceTrends();

    setProgress(userProgress);
    setWeeklyStats(stats);
    setAchievements(userAchievements);
    setTrends(performanceTrends);
  };

  if (!progress) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const levelProgress = progress.getLevelProgress();
  const experienceForNext = progress.getExperienceForNextLevel();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Progreso</Text>
        <Text style={styles.headerSubtitle}>
          Sigue mejorando cada día
        </Text>
      </View>

      {/* Nivel y XP */}
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{progress.level}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Nivel {progress.level}</Text>
            <Text style={styles.levelSubtitle}>
              {progress.experiencePoints} / {experienceForNext} XP
            </Text>
          </View>
        </View>

        {/* Barra de progreso de nivel */}
        <View style={styles.xpBarContainer}>
          <View
            style={[styles.xpBar, { width: `${levelProgress * 100}%` }]}
          />
        </View>
        <Text style={styles.xpText}>
          {Math.round(levelProgress * 100)}% hacia el nivel {progress.level + 1}
        </Text>
      </View>

      {/* Racha */}
      <View style={styles.streakContainer}>
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakValue}>{progress.currentStreak}</Text>
            <Text style={styles.streakLabel}>Racha Actual</Text>
          </View>
        </View>

        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>⭐</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakValue}>{progress.longestStreak}</Text>
            <Text style={styles.streakLabel}>Racha Máxima</Text>
          </View>
        </View>
      </View>

      {/* Estadísticas semanales */}
      {weeklyStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esta Semana</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>💪</Text>
              <Text style={styles.statValue}>{weeklyStats.workouts}</Text>
              <Text style={styles.statLabel}>Entrenamientos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⏱️</Text>
              <Text style={styles.statValue}>{weeklyStats.minutes}</Text>
              <Text style={styles.statLabel}>Minutos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{weeklyStats.calories}</Text>
              <Text style={styles.statLabel}>Calorías</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tendencias */}
      {trends && trends.trend !== 'insufficient_data' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análisis de Rendimiento</Text>

          <View style={[
            styles.trendCard,
            trends.trend === 'improving' && { borderLeftColor: '#4CAF50' },
            trends.trend === 'declining' && { borderLeftColor: '#F44336' },
            trends.trend === 'stable' && { borderLeftColor: '#FFC107' }
          ]}>
            <Text style={styles.trendEmoji}>
              {trends.trend === 'improving' && '📈'}
              {trends.trend === 'declining' && '📉'}
              {trends.trend === 'stable' && '➡️'}
            </Text>
            <View style={styles.trendInfo}>
              <Text style={styles.trendTitle}>
                {trends.trend === 'improving' && 'Mejorando'}
                {trends.trend === 'declining' && 'Necesitas Descanso'}
                {trends.trend === 'stable' && 'Rendimiento Estable'}
              </Text>
              <Text style={styles.trendMessage}>{trends.message}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Estadísticas totales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas Totales</Text>

        <View style={styles.totalStatsCard}>
          <View style={styles.totalStatRow}>
            <Text style={styles.totalStatLabel}>Total de Entrenamientos</Text>
            <Text style={styles.totalStatValue}>{progress.workoutsCompleted}</Text>
          </View>

          <View style={styles.totalStatRow}>
            <Text style={styles.totalStatLabel}>Tiempo Total</Text>
            <Text style={styles.totalStatValue}>{progress.totalMinutes} min</Text>
          </View>

          <View style={styles.totalStatRow}>
            <Text style={styles.totalStatLabel}>Calorías Totales</Text>
            <Text style={styles.totalStatValue}>{progress.totalCalories}</Text>
          </View>
        </View>
      </View>

      {/* Logros */}
      {achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Logros Desbloqueados ({achievements.length})
          </Text>

          <View style={styles.achievementsGrid}>
            {achievements.slice(0, 6).map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
              </View>
            ))}
          </View>

          {achievements.length > 6 && (
            <Text style={styles.moreAchievements}>
              +{achievements.length - 6} logros más
            </Text>
          )}
        </View>
      )}

      {/* Placeholder para gráficas (se implementará con react-native-chart-kit) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progreso Semanal</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            📊 Gráfica de progreso
          </Text>
          <Text style={styles.chartPlaceholderSubtext}>
            (Se implementará con react-native-chart-kit)
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
  levelContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  xpBarContainer: {
    height: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  xpText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
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
  trendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
  },
  trendEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  trendInfo: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  trendMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  totalStatsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  totalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  totalStatLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 64) / 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  achievementEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  moreAchievements: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  chartPlaceholderText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ProgressScreen;
