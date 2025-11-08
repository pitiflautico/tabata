import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import { useApp } from '../context/AppContext';
import CircularButton from '../components/CircularButton';
import Card from '../components/Card';

/**
 * Pantalla de historial de entrenamientos
 * Muestra el registro diario y semanal de ejercicios completados
 */
const WorkoutHistoryScreen = ({ navigation }) => {
  const { workoutHistory } = useApp();
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'

  // Agrupar entrenamientos por fecha
  const groupWorkoutsByDate = () => {
    const grouped = {};

    workoutHistory.forEach(workout => {
      const date = new Date(workout.date);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(workout);
    });

    return grouped;
  };

  // Agrupar entrenamientos por semana
  const groupWorkoutsByWeek = () => {
    const grouped = {};

    workoutHistory.forEach(workout => {
      const date = new Date(workout.date);
      const weekStart = getWeekStart(date);
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          weekStart,
          workouts: [],
          totalDuration: 0,
          totalCalories: 0,
        };
      }

      grouped[weekKey].workouts.push(workout);
      grouped[weekKey].totalDuration += workout.duration || 0;
      grouped[weekKey].totalCalories += workout.calories || 0;
    });

    return grouped;
  };

  // Obtener inicio de la semana (lunes)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    return new Date(d.setDate(diff));
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Hoy';
    if (isYesterday) return 'Ayer';

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  // Formatear rango de semana
  const formatWeekRange = (weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const startStr = weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const endStr = weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    return `${startStr} - ${endStr}`;
  };

  // Renderizar vista diaria
  const renderDailyView = () => {
    const groupedWorkouts = groupWorkoutsByDate();
    const dates = Object.keys(groupedWorkouts).sort().reverse();

    if (dates.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={AppTheme.colors.textTertiary} />
          <Text style={styles.emptyTitle}>Sin entrenamientos aún</Text>
          <Text style={styles.emptyText}>
            Completa tu primer entrenamiento para ver tu historial aquí
          </Text>
        </View>
      );
    }

    return dates.map(dateKey => {
      const workouts = groupedWorkouts[dateKey];
      const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

      return (
        <Card key={dateKey} style={styles.dateCard}>
          <View style={styles.dateHeader}>
            <View>
              <Text style={styles.dateTitle}>{formatDate(dateKey)}</Text>
              <Text style={styles.dateSubtitle}>
                {workouts.length} entrenamiento{workouts.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.dateSummary}>
              <View style={styles.summaryItem}>
                <Ionicons name="time-outline" size={16} color={AppTheme.colors.primary} />
                <Text style={styles.summaryValue}>{totalDuration} min</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="flame-outline" size={16} color={AppTheme.colors.accent1} />
                <Text style={styles.summaryValue}>{totalCalories} kcal</Text>
              </View>
            </View>
          </View>

          {workouts.map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={styles.workoutIcon}>
                <Ionicons name="fitness" size={20} color={AppTheme.colors.primary} />
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>
                  {workout.blocks?.length || 0} bloques • {workout.cycles || 0} ejercicios
                </Text>
                <Text style={styles.workoutTime}>
                  {new Date(workout.date).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={styles.workoutStats}>
                <Text style={styles.workoutDuration}>{workout.duration} min</Text>
                <Text style={styles.workoutCalories}>{workout.calories} kcal</Text>
              </View>
            </View>
          ))}
        </Card>
      );
    });
  };

  // Renderizar vista semanal
  const renderWeeklyView = () => {
    const groupedWorkouts = groupWorkoutsByWeek();
    const weeks = Object.keys(groupedWorkouts).sort().reverse();

    if (weeks.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={AppTheme.colors.textTertiary} />
          <Text style={styles.emptyTitle}>Sin entrenamientos aún</Text>
          <Text style={styles.emptyText}>
            Completa tu primer entrenamiento para ver tu historial aquí
          </Text>
        </View>
      );
    }

    return weeks.map(weekKey => {
      const weekData = groupedWorkouts[weekKey];

      return (
        <Card key={weekKey} style={styles.weekCard}>
          <View style={styles.weekHeader}>
            <View>
              <Text style={styles.weekTitle}>{formatWeekRange(weekData.weekStart)}</Text>
              <Text style={styles.weekSubtitle}>
                {weekData.workouts.length} entrenamiento{weekData.workouts.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.weekStats}>
            <View style={styles.weekStatItem}>
              <Ionicons name="time" size={32} color={AppTheme.colors.primary} />
              <Text style={styles.weekStatValue}>{weekData.totalDuration}</Text>
              <Text style={styles.weekStatLabel}>minutos</Text>
            </View>
            <View style={styles.weekStatDivider} />
            <View style={styles.weekStatItem}>
              <Ionicons name="flame" size={32} color={AppTheme.colors.accent1} />
              <Text style={styles.weekStatValue}>{weekData.totalCalories}</Text>
              <Text style={styles.weekStatLabel}>kcal</Text>
            </View>
            <View style={styles.weekStatDivider} />
            <View style={styles.weekStatItem}>
              <Ionicons name="fitness" size={32} color={AppTheme.colors.success} />
              <Text style={styles.weekStatValue}>{weekData.workouts.length}</Text>
              <Text style={styles.weekStatLabel}>sesiones</Text>
            </View>
          </View>

          <View style={styles.weekDays}>
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => {
              const dayDate = new Date(weekData.weekStart);
              dayDate.setDate(dayDate.getDate() + index);
              const dayKey = dayDate.toISOString().split('T')[0];
              const hasWorkout = weekData.workouts.some(w => {
                const wDate = new Date(w.date).toISOString().split('T')[0];
                return wDate === dayKey;
              });

              return (
                <View key={index} style={[styles.weekDay, hasWorkout && styles.weekDayActive]}>
                  <Text style={[styles.weekDayText, hasWorkout && styles.weekDayTextActive]}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={CommonStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <CircularButton
          icon="arrow-back"
          size="medium"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver atrás"
        />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Historial</Text>
          <Text style={styles.headerSubtitle}>
            {workoutHistory.length} entrenamiento{workoutHistory.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <CircularButton
          icon="stats-chart"
          size="medium"
          onPress={() => navigation.navigate('Stats')}
          accessibilityLabel="Ver estadísticas"
        />
      </View>

      {/* View Mode Selector */}
      <View style={styles.viewModeSelector}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'daily' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('daily')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={viewMode === 'daily' ? AppTheme.colors.background : AppTheme.colors.textSecondary}
          />
          <Text style={[styles.viewModeText, viewMode === 'daily' && styles.viewModeTextActive]}>
            Diario
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'weekly' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('weekly')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={viewMode === 'weekly' ? AppTheme.colors.background : AppTheme.colors.textSecondary}
          />
          <Text style={[styles.viewModeText, viewMode === 'weekly' && styles.viewModeTextActive]}>
            Semanal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'daily' ? renderDailyView() : renderWeeklyView()}
      </ScrollView>
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
  viewModeSelector: {
    flexDirection: 'row',
    marginHorizontal: AppTheme.layout.screenPadding,
    marginBottom: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.md,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.sm,
    gap: AppTheme.spacing.xs,
  },
  viewModeButtonActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  viewModeText: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
  },
  viewModeTextActive: {
    color: AppTheme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingBottom: AppTheme.spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.xxxl * 2,
  },
  emptyTitle: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
  },
  emptyText: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  dateCard: {
    marginBottom: AppTheme.spacing.md,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.backgroundCardLight,
  },
  dateTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    textTransform: 'capitalize',
  },
  dateSubtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  dateSummary: {
    gap: AppTheme.spacing.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.backgroundCardLight,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AppTheme.spacing.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.medium,
    color: AppTheme.colors.text,
    marginBottom: 2,
  },
  workoutTime: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
  },
  workoutStats: {
    alignItems: 'flex-end',
  },
  workoutDuration: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.primary,
  },
  workoutCalories: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  weekCard: {
    marginBottom: AppTheme.spacing.md,
  },
  weekHeader: {
    marginBottom: AppTheme.spacing.lg,
  },
  weekTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  weekSubtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  weekStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    borderRadius: AppTheme.borderRadius.md,
  },
  weekStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  weekStatValue: {
    fontSize: AppTheme.typography.fontSize.xxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginTop: AppTheme.spacing.xs,
  },
  weekStatLabel: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  weekStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: AppTheme.colors.backgroundCard,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.xs,
  },
  weekDay: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: AppTheme.borderRadius.sm,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  weekDayText: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textTertiary,
  },
  weekDayTextActive: {
    color: AppTheme.colors.background,
  },
});

export default WorkoutHistoryScreen;
