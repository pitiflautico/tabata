import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import Button from '../components/Button';
import CircularButton from '../components/CircularButton';
import BarChart from '../components/BarChart';
import { useApp } from '../context/AppContext';

const NewHomeScreen = ({ navigation }) => {
  const { stats, getTodayWorkouts, getWorkoutsForPeriod, getWeeklyStats } = useApp();

  // Today's stats
  const todayWorkouts = getTodayWorkouts();
  const todayStats = {
    workoutsCompleted: todayWorkouts.length,
    caloriesBurned: todayWorkouts.reduce((sum, w) => sum + w.calories, 0),
    totalTime: todayWorkouts.reduce((sum, w) => sum + w.duration, 0),
    currentStreak: stats.currentStreak,
  };

  // Weekly data for chart
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

  const weeklyData = getWeeklyChartData();

  const handleStartWorkout = () => {
    navigation.navigate('Timer');
  };

  const handleViewStats = () => {
    navigation.navigate('Stats');
  };

  return (
    <View style={CommonStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.subtitle}>Ready for your workout?</Text>
        </View>
        <CircularButton
          icon="settings-outline"
          size="medium"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Action Buttons */}
        <Button
          title="Start Tabata Workout"
          icon="play-circle"
          onPress={handleStartWorkout}
          size="large"
          fullWidth
          style={styles.startButton}
        />

        <Button
          title="AI Coach - Generate Workout"
          icon="sparkles"
          variant="secondary"
          onPress={() => navigation.navigate('WorkoutGenerator')}
          size="large"
          fullWidth
          style={styles.aiCoachButton}
        />

        <Button
          title="Browse Exercises"
          icon="list"
          variant="outline"
          onPress={() => navigation.navigate('Exercises')}
          size="large"
          fullWidth
          style={styles.exercisesButton}
        />

        {/* Today's Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricHalf}>
              <MetricCard
                value={todayStats.workoutsCompleted}
                label="Workouts"
                icon="fitness"
                color={AppTheme.colors.primary}
                size="medium"
              />
            </View>
            <View style={styles.metricHalf}>
              <MetricCard
                value={todayStats.caloriesBurned}
                unit="kcal"
                label="Calories"
                icon="flame"
                color={AppTheme.colors.accent3}
                trend="up"
                trendValue="+12%"
                size="medium"
              />
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricHalf}>
              <MetricCard
                value={todayStats.totalTime}
                unit="min"
                label="Active Time"
                icon="time"
                color={AppTheme.colors.secondary}
                size="medium"
              />
            </View>
            <View style={styles.metricHalf}>
              <MetricCard
                value={todayStats.currentStreak}
                unit="days"
                label="Streak"
                icon="trophy"
                color={AppTheme.colors.accent1}
                trend="up"
                size="medium"
              />
            </View>
          </View>
        </View>

        {/* Weekly Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <Button
              title="View All"
              variant="ghost"
              size="small"
              onPress={handleViewStats}
            />
          </View>

          <Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Calories Burned</Text>
              <Text style={styles.chartSubtitle}>
                Daily average: <Text style={styles.chartValue}>305 kcal</Text>
              </Text>
            </View>
            <BarChart
              data={weeklyData}
              height={120}
              colors={[
                AppTheme.colors.primary,
                AppTheme.colors.secondary,
                AppTheme.colors.accent1,
              ]}
            />
          </Card>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>

          <Card>
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>💪</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Total Workouts</Text>
                <Text style={styles.statValue}>47</Text>
              </View>
              <Text style={styles.statTrend}>+5 this week</Text>
            </View>
          </Card>

          <Card style={styles.cardSpacing}>
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>🔥</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Best Streak</Text>
                <Text style={styles.statValue}>14 days</Text>
              </View>
              <Text style={styles.statTrend}>Current: {todayStats.currentStreak}</Text>
            </View>
          </Card>

          <Card style={styles.cardSpacing}>
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>⏱️</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Total Time</Text>
                <Text style={styles.statValue}>28.5 hrs</Text>
              </View>
              <Text style={styles.statTrend}>This month</Text>
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
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: AppTheme.typography.fontSize.xxxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
  },
  startButton: {
    marginBottom: AppTheme.spacing.md,
  },
  aiCoachButton: {
    marginBottom: AppTheme.spacing.md,
  },
  exercisesButton: {
    marginBottom: AppTheme.spacing.xl,
  },
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.md,
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
  chartCard: {
    padding: AppTheme.spacing.lg,
  },
  chartHeader: {
    marginBottom: AppTheme.spacing.lg,
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
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AppTheme.spacing.md,
  },
  statEmoji: {
    fontSize: 24,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  statTrend: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  cardSpacing: {
    marginTop: AppTheme.spacing.md,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NewHomeScreen;
