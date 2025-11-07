import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppTheme } from '../theme/AppTheme';
import TimerDisplay from './TimerDisplay';

const StateSection = ({
  state,
  time,
  isActive = false,
  showMilliseconds = false,
  vertical = false,
}) => {
  const getStateConfig = (state) => {
    switch (state) {
      case 'WORK':
        return {
          backgroundColor: AppTheme.colors.work,
          label: 'WORK',
        };
      case 'REST':
        return {
          backgroundColor: AppTheme.colors.rest,
          label: 'REST',
        };
      case 'PREPARE':
        return {
          backgroundColor: AppTheme.colors.prepare,
          label: 'PREPARE',
        };
      default:
        return {
          backgroundColor: AppTheme.colors.gray4,
          label: state || 'READY',
        };
    }
  };

  const config = getStateConfig(state);

  if (vertical) {
    return (
      <View
        style={[
          styles.verticalSection,
          { backgroundColor: config.backgroundColor },
          !isActive && styles.inactiveSection,
        ]}
      >
        <Text style={[styles.verticalLabel, !isActive && styles.inactiveLabel]}>
          {config.label}
        </Text>
        <TimerDisplay
          time={time}
          size={isActive ? 'huge' : 'medium'}
          color={AppTheme.colors.black}
          showMilliseconds={showMilliseconds}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: config.backgroundColor },
        !isActive && styles.inactiveSection,
      ]}
    >
      <Text style={[styles.label, !isActive && styles.inactiveLabel]}>
        {config.label}
      </Text>
      <TimerDisplay
        time={time}
        size={isActive ? 'giant' : 'large'}
        color={AppTheme.colors.black}
        showMilliseconds={showMilliseconds}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: AppTheme.spacing.xl,
    paddingHorizontal: AppTheme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.lg,
  },
  label: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.black,
    color: AppTheme.colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: AppTheme.spacing.sm,
  },
  verticalLabel: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.black,
    color: AppTheme.colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: AppTheme.spacing.xs,
  },
  inactiveSection: {
    opacity: 0.6,
  },
  inactiveLabel: {
    opacity: 0.8,
  },
});

export default StateSection;
