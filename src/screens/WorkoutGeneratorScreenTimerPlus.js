import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors, Typography, Layout, formatTimeValue } from '../styles/TimerPlusDesign';
import { TabataRatio } from '../models/Block';
import { Workout } from '../models/Block';
import WorkoutGenerator from '../services/WorkoutGenerator';
import { exerciseCatalog } from '../data/exerciseCatalog';

/**
 * WorkoutGeneratorScreen - Timer Plus Config Style
 */
const WorkoutGeneratorScreenTimerPlus = ({ navigation }) => {
  // Estados de configuración
  const [restDuration, setRestDuration] = useState(10);
  const [workDuration, setWorkDuration] = useState(30);
  const [rounds, setRounds] = useState(4);
  const [cycles, setCycles] = useState(2);
  const [restBetweenCycles, setRestBetweenCycles] = useState(30);

  // Generar workout
  const handleGenerateWorkout = () => {
    try {
      const ratio = { work: workDuration, rest: restDuration };
      const workout = WorkoutGenerator.generateWorkout(
        exerciseCatalog,
        cycles,      // numberOfBlocks
        rounds,      // exercisesPerBlock
        ratio
      );

      navigation.navigate('WorkoutSession', { workout });
    } catch (error) {
      console.error('Error generating workout:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>CANCEL</Text>
        </TouchableOpacity>

        <Text style={styles.title}>TABATA</Text>

        <TouchableOpacity onPress={handleGenerateWorkout}>
          <Text style={styles.saveButton}>START</Text>
        </TouchableOpacity>
      </View>

      {/* INTERVALS SECTION */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>INTERVALS</Text>

        {/* REST */}
        <ConfigItem
          color={Colors.rest}
          label="REST"
          subtitle="REST FOR THIS LONG"
          value={formatTimeValue(restDuration)}
          onPress={() => {}}
        />

        {/* WORK */}
        <ConfigItem
          color={Colors.work}
          label="WORK"
          subtitle="DO EXERCISES FOR THIS LONG"
          value={formatTimeValue(workDuration)}
          onPress={() => {}}
        />

        {/* REST (segundo) */}
        <ConfigItem
          color={Colors.rest}
          label="REST"
          subtitle="REST FOR THIS LONG"
          value={formatTimeValue(restDuration)}
          onPress={() => {}}
        />

        {/* ROUNDS */}
        <ConfigItem
          color={Colors.blue}
          label="ROUNDS"
          subtitle="ONE ROUND IS WORK + REST"
          value={rounds}
          onPress={() => {}}
        />

        {/* CYCLES */}
        <ConfigItem
          color={Colors.yellow}
          label="CYCLES"
          subtitle={`ONE CYCLE IS ${rounds} ROUNDS`}
          value={cycles}
          onPress={() => {}}
        />

        {/* REST BETWEEN CYCLES */}
        <ConfigItem
          color={Colors.yellow}
          label="REST BETWEEN CYCLES"
          subtitle="RECOVERY INTERVAL"
          value={formatTimeValue(restBetweenCycles)}
          onPress={() => {}}
        />

        {/* ADD NEW TIMER BUTTON */}
        <TouchableOpacity style={styles.addButton} onPress={handleGenerateWorkout}>
          <Text style={styles.addButtonIcon}>⏱</Text>
          <Text style={styles.addButtonText}>START WORKOUT</Text>
        </TouchableOpacity>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.tabIcon}>⏱</Text>
          <Text style={styles.tabLabel}>TABATA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabIcon}>↻</Text>
          <Text style={styles.tabLabel}>ROUNDS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabIcon}>⏲</Text>
          <Text style={styles.tabLabel}>STOPWATCH</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabIcon}>⋯</Text>
          <Text style={styles.tabLabel}>MORE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Config Item Component
 */
const ConfigItem = ({ color, label, subtitle, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.configItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.configLeft}>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <View style={styles.configLabels}>
          <Text style={styles.configLabel}>{label}</Text>
          <Text style={styles.configSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.configRight}>
        <Text style={styles.configValue}>{value}</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.mediumGray,
  },

  cancelButton: {
    ...Typography.buttonText,
    fontSize: 16,
    color: Colors.cancelGray,
  },

  title: {
    ...Typography.buttonText,
    fontSize: 18,
    color: Colors.textWhite,
  },

  saveButton: {
    ...Typography.buttonText,
    fontSize: 16,
    color: Colors.saveGreen,
  },

  // Content
  content: {
    flex: 1,
  },

  sectionTitle: {
    ...Typography.configSubtext,
    color: Colors.textGray,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },

  // Config Item
  configItem: {
    ...Layout.configItem,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.darkGray,
    marginHorizontal: 0,
  },

  configLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 20,
  },

  colorDot: {
    ...Layout.configColorDot,
    marginRight: 16,
  },

  configLabels: {
    flex: 1,
  },

  configLabel: {
    ...Typography.configLabel,
    color: Colors.textWhite,
    fontSize: 15,
    marginBottom: 4,
  },

  configSubtitle: {
    ...Typography.configSubtext,
    fontSize: 11,
  },

  configRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },

  configValue: {
    ...Typography.configValue,
    color: Colors.textWhite,
    marginRight: 12,
  },

  arrow: {
    fontSize: 24,
    color: Colors.textGray,
    fontWeight: '400',
  },

  // Add Button
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 18,
    backgroundColor: Colors.mediumGray,
    borderRadius: 12,
  },

  addButtonIcon: {
    fontSize: 20,
    color: Colors.textWhite,
    marginRight: 12,
  },

  addButtonText: {
    ...Typography.buttonText,
    color: Colors.textWhite,
  },

  // Bottom Tab Bar
  tabBar: {
    flexDirection: 'row',
    height: Layout.tabBarHeight,
    backgroundColor: Colors.black,
    borderTopWidth: 0.5,
    borderTopColor: Colors.mediumGray,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabIcon: {
    fontSize: 24,
    color: Colors.textWhite,
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textWhite,
    letterSpacing: 0.5,
  },
});

export default WorkoutGeneratorScreenTimerPlus;
