import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Timer Configuration
  const [config, setConfig] = useState({
    prepareTime: 10,
    workTime: 30,
    restTime: 10,
    rounds: 8,
    cycles: 3,
    restBetweenCycles: 60,
  });

  // Workout History
  const [workoutHistory, setWorkoutHistory] = useState([]);

  // Generated Workouts (from AI Coach)
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Workout Templates
  const [templates, setTemplates] = useState([]);

  // Settings
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
  });

  // Statistics
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalMinutes: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastWorkoutDate: null,
  });

  // Goals
  const [goals, setGoals] = useState({
    weeklyWorkouts: 5,
    dailyCalories: 400,
  });

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    saveData();
  }, [config, workoutHistory, stats, goals, savedWorkouts, templates, settings]);

  const loadData = async () => {
    try {
      const [
        savedConfig,
        savedHistory,
        savedStats,
        savedGoals,
        savedWorkoutsData,
        savedTemplatesData,
        savedSettingsData,
      ] = await Promise.all([
        AsyncStorage.getItem('config'),
        AsyncStorage.getItem('workoutHistory'),
        AsyncStorage.getItem('stats'),
        AsyncStorage.getItem('goals'),
        AsyncStorage.getItem('savedWorkouts'),
        AsyncStorage.getItem('templates'),
        AsyncStorage.getItem('settings'),
      ]);

      if (savedConfig) setConfig(JSON.parse(savedConfig));
      if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedWorkoutsData) setSavedWorkouts(JSON.parse(savedWorkoutsData));
      if (savedTemplatesData) setTemplates(JSON.parse(savedTemplatesData));
      if (savedSettingsData) setSettings(JSON.parse(savedSettingsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('config', JSON.stringify(config)),
        AsyncStorage.setItem('workoutHistory', JSON.stringify(workoutHistory)),
        AsyncStorage.setItem('stats', JSON.stringify(stats)),
        AsyncStorage.setItem('goals', JSON.stringify(goals)),
        AsyncStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts)),
        AsyncStorage.setItem('templates', JSON.stringify(templates)),
        AsyncStorage.setItem('settings', JSON.stringify(settings)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Update config
  const updateConfig = (newConfig) => {
    setConfig(newConfig);
  };

  // Add workout to history
  const addWorkout = (workout) => {
    const newWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: workout.duration,
      calories: workout.calories,
      rounds: workout.rounds,
      cycles: workout.cycles,
      completed: true,
    };

    setWorkoutHistory([newWorkout, ...workoutHistory]);

    // Update stats
    updateStats(newWorkout);
  };

  // Update statistics
  const updateStats = (workout) => {
    const today = new Date().toDateString();
    const lastWorkout = stats.lastWorkoutDate
      ? new Date(stats.lastWorkoutDate).toDateString()
      : null;

    let newStreak = stats.currentStreak;

    // Calculate streak
    if (lastWorkout === today) {
      // Same day, maintain streak
      newStreak = stats.currentStreak;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastWorkout === yesterdayStr) {
        // Consecutive day, increment streak
        newStreak = stats.currentStreak + 1;
      } else if (!lastWorkout) {
        // First workout
        newStreak = 1;
      } else {
        // Streak broken, restart
        newStreak = 1;
      }
    }

    setStats({
      totalWorkouts: stats.totalWorkouts + 1,
      totalCalories: stats.totalCalories + workout.calories,
      totalMinutes: stats.totalMinutes + workout.duration,
      currentStreak: newStreak,
      bestStreak: Math.max(stats.bestStreak, newStreak),
      lastWorkoutDate: new Date().toISOString(),
    });
  };

  // Get workouts for a specific period
  const getWorkoutsForPeriod = (period = 'week') => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }

    return workoutHistory.filter(
      (workout) => new Date(workout.date) >= startDate
    );
  };

  // Get today's workouts
  const getTodayWorkouts = () => {
    const today = new Date().toDateString();
    return workoutHistory.filter(
      (workout) => new Date(workout.date).toDateString() === today
    );
  };

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const weekWorkouts = getWorkoutsForPeriod('week');
    return {
      workouts: weekWorkouts.length,
      calories: weekWorkouts.reduce((sum, w) => sum + w.calories, 0),
      minutes: weekWorkouts.reduce((sum, w) => sum + w.duration, 0),
    };
  };

  // Save generated workout
  const saveGeneratedWorkout = (workout, name = null) => {
    const workoutToSave = {
      id: `workout-${Date.now()}`,
      name: name || workout.name,
      createdAt: new Date().toISOString(),
      ...workout,
    };

    setSavedWorkouts([workoutToSave, ...savedWorkouts]);
    return workoutToSave;
  };

  // Delete saved workout
  const deleteSavedWorkout = (workoutId) => {
    setSavedWorkouts(savedWorkouts.filter((w) => w.id !== workoutId));
  };

  // Save as template
  const saveAsTemplate = (workout, name, description = '') => {
    const template = {
      id: `template-${Date.now()}`,
      name,
      description,
      numberOfBlocks: workout.blocks.length,
      exercisesPerBlock: workout.blocks[0]?.exercises.length || 4,
      ratio: workout.blocks[0]?.ratio,
      createdAt: new Date().toISOString(),
      blocks: workout.blocks,
    };

    setTemplates([template, ...templates]);
    return template;
  };

  // Delete template
  const deleteTemplate = (templateId) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };

  // Reset all data (for testing)
  const resetAllData = async () => {
    setConfig({
      prepareTime: 10,
      workTime: 30,
      restTime: 10,
      rounds: 8,
      cycles: 3,
      restBetweenCycles: 60,
    });
    setWorkoutHistory([]);
    setSavedWorkouts([]);
    setTemplates([]);
    setSettings({
      soundEnabled: true,
      vibrationEnabled: true,
    });
    setStats({
      totalWorkouts: 0,
      totalCalories: 0,
      totalMinutes: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastWorkoutDate: null,
    });
    setGoals({
      weeklyWorkouts: 5,
      dailyCalories: 400,
    });

    await AsyncStorage.clear();
  };

  const value = {
    config,
    updateConfig,
    workoutHistory,
    addWorkout,
    stats,
    goals,
    setGoals,
    getWorkoutsForPeriod,
    getTodayWorkouts,
    getWeeklyStats,
    savedWorkouts,
    saveGeneratedWorkout,
    deleteSavedWorkout,
    templates,
    saveAsTemplate,
    deleteTemplate,
    settings,
    updateSettings,
    resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
