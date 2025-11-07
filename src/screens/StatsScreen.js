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
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import CircularButton from '../components/CircularButton';
import BarChart from '../components/BarChart';
import CircularProgress from '../components/CircularProgress';
import { useApp } from '../context/AppContext';

const StatsScreen = ({ navigation }) => {
  const { stats: globalStats, goals, getWorkoutsForPeriod, getWeeklyStats } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Get real data
  const weeklyStats = getWeeklyStats();

  const stats = {
    totalWorkouts: globalStats.totalWorkouts,
    totalCalories: globalStats.totalCalories,
    totalMinutes: globalStats.totalMinutes,
    avgWorkoutTime: globalStats.totalWorkouts > 0
      ? Math.round(globalStats.totalMinutes / globalStats.totalWorkouts)
      : 0,
    bestStreak: globalStats.bestStreak,
    currentStreak: globalStats.currentStreak,
    weeklyGoal: goals.weeklyWorkouts,
    completedThisWeek: weeklyStats.workouts,
  };

  // Weekly chart data
  const getWeeklyChartData = () => {
    const weekWorkouts = getWorkoutsForPeriod('week');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();

    return days.map((day, index) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - (6 - index));
      const dateStr = targetDate.toDateString();

      const dayWorkouts = weekWorkouts.filter(
        (w) => new Date(w.date).toDateString() === dateStr
      );

      const calories = dayWorkouts.reduce((sum, w) => sum + w.calories, 0);

      return {
        label: day.substring(0, 2),
        value: calories,
      };
    });
  };

  // Monthly chart data
  const getMonthlyChartData = () => {
    const monthWorkouts = getWorkoutsForPeriod('month');
    const weeks = ['W1', 'W2', 'W3', 'W4'];

    return weeks.map((week, index) => {
      const weekWorkouts = monthWorkouts.filter(w => {
        const workoutDate = new Date(w.date);
        const weekOfMonth = Math.floor((workoutDate.getDate() - 1) / 7);
        return weekOfMonth === index;
      });

      const calories = weekWorkouts.reduce((sum, w) => sum + w.calories, 0);

      return {
        label: week,
        value: calories,
      };
    });
  };

  const weekData = getWeeklyChartData();
  const monthData = getMonthlyChartData();

  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  const getData = () => {
    switch (selectedPeriod) {
      case 'month':
        return monthData;
      case 'week':
      default:
        return weekData;
    }
  };

  const goalProgress = stats.completedThisWeek / stats.weeklyGoal;

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
        <Text style={styles.headerTitle}>Statistics</Text>
        <CircularButton
          icon="download-outline"
          size="medium"
          onPress={() => {}}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Weekly Goal Progress */}
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.goalTitle}>Weekly Goal</Text>
              <Text style={styles.goalSubtitle}>
                {stats.completedThisWeek}/{stats.weeklyGoal} workouts completed
              </Text>
            </View>
          </View>

          <View style={styles.goalProgress}>
            <CircularProgress
              size={140}
              strokeWidth={12}
              progress={goalProgress}
              color={goalProgress >= 1 ? AppTheme.colors.success : AppTheme.colors.primary}
            >
              <View style={styles.goalContent}>
                <Text style={styles.goalPercentage}>
                  {Math.round(goalProgress * 100)}%
                </Text>
                <Text style={styles.goalLabel}>Complete</Text>
              </View>
            </CircularProgress>
          </View>
        </Card>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.id && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calories Chart */}
        <View style={styles.section}>
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Calories Burned</Text>
            <Text style={styles.chartSubtitle}>
              Average: <Text style={styles.chartValue}>305 kcal</Text> per workout
            </Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={getData()}
                height={140}
                colors={[
                  AppTheme.colors.primary,
                  AppTheme.colors.secondary,
                  AppTheme.colors.accent1,
                ]}
              />
            </View>
          </Card>
        </View>

        {/* Summary Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricHalf}>
              <MetricCard
                value={stats.totalWorkouts}
                label="Total Workouts"
                icon="fitness"
                color={AppTheme.colors.primary}
                size="medium"
              />
            </View>
            <View style={styles.metricHalf}>
              <MetricCard
                value={(stats.totalCalories / 1000).toFixed(1)}
                unit="k"
                label="Total Calories"
                icon="flame"
                color={AppTheme.colors.accent3}
                size="medium"
              />
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricHalf}>
              <MetricCard
                value={Math.round(stats.totalMinutes / 60)}
                unit="hrs"
                label="Total Time"
                icon="time"
                color={AppTheme.colors.secondary}
                size="medium"
              />
            </View>
            <View style={styles.metricHalf}>
              <MetricCard
                value={stats.avgWorkoutTime}
                unit="min"
                label="Avg Workout"
                icon="timer"
                color={AppTheme.colors.accent1}
                size="medium"
              />
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          <Card>
            <View style={styles.achievementRow}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>🔥</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Current Streak</Text>
                <Text style={styles.achievementValue}>{stats.currentStreak} days</Text>
              </View>
              <View style={styles.achievementBadge}>
                <Text style={styles.achievementBadgeText}>Active</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.cardSpacing}>
            <View style={styles.achievementRow}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>🏆</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Best Streak</Text>
                <Text style={styles.achievementValue}>{stats.bestStreak} days</Text>
              </View>
              <View style={[styles.achievementBadge, styles.achievementBadgeGold]}>
                <Text style={styles.achievementBadgeText}>Record</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.cardSpacing}>
            <View style={styles.achievementRow}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>💪</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Consistency</Text>
                <Text style={styles.achievementValue}>85% this month</Text>
              </View>
              <View style={[styles.achievementBadge, styles.achievementBadgeSuccess]}>
                <Text style={styles.achievementBadgeText}>Great</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  goalCard: {
    padding: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
  },
  goalHeader: {
    marginBottom: AppTheme.spacing.lg,
  },
  goalTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
  },
  goalProgress: {
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.lg,
  },
  goalContent: {
    alignItems: 'center',
  },
  goalPercentage: {
    fontSize: AppTheme.typography.fontSize.xxxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  goalLabel: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
    padding: 4,
    marginBottom: AppTheme.spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: AppTheme.spacing.sm,
    alignItems: 'center',
    borderRadius: AppTheme.borderRadius.md,
  },
  periodButtonActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  periodButtonText: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
  },
  periodButtonTextActive: {
    color: AppTheme.colors.background,
  },
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.md,
  },
  chartCard: {
    padding: AppTheme.spacing.lg,
  },
  chartTitle: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
  },
  chartValue: {
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
  },
  chartContainer: {
    marginTop: AppTheme.spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: AppTheme.spacing.md,
  },
  metricHalf: {
    flex: 1,
    paddingHorizontal: 6,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AppTheme.spacing.md,
  },
  achievementEmoji: {
    fontSize: 28,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginBottom: 2,
  },
  achievementValue: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  achievementBadge: {
    backgroundColor: AppTheme.colors.primary + '20',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  achievementBadgeGold: {
    backgroundColor: AppTheme.colors.accent3 + '20',
  },
  achievementBadgeSuccess: {
    backgroundColor: AppTheme.colors.success + '20',
  },
  achievementBadgeText: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.primary,
  },
  cardSpacing: {
    marginTop: AppTheme.spacing.md,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default StatsScreen;
