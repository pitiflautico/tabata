import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppTheme, CommonStyles } from '../theme/AppTheme';

const TimerDisplay = ({
  time,
  size = 'large',
  color = AppTheme.colors.black,
  showMilliseconds = false,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);

    if (showMilliseconds) {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sizeStyles = {
    giant: {
      fontSize: AppTheme.typography.fontSize.giant,
      lineHeight: AppTheme.typography.fontSize.giant * 0.9,
      letterSpacing: -4,
    },
    huge: {
      fontSize: AppTheme.typography.fontSize.huge,
      lineHeight: AppTheme.typography.fontSize.huge * 0.9,
      letterSpacing: -2,
    },
    large: {
      fontSize: AppTheme.typography.fontSize.xxl,
      lineHeight: AppTheme.typography.fontSize.xxl * 0.9,
      letterSpacing: -1,
    },
    medium: {
      fontSize: AppTheme.typography.fontSize.xl,
      lineHeight: AppTheme.typography.fontSize.xl * 0.9,
    },
    small: {
      fontSize: AppTheme.typography.fontSize.lg,
      lineHeight: AppTheme.typography.fontSize.lg * 0.9,
    },
  };

  return (
    <Text
      style={[
        styles.timer,
        sizeStyles[size],
        { color },
      ]}
    >
      {formatTime(time)}
    </Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontWeight: AppTheme.typography.fontWeight.black,
    textAlign: 'center',
  },
});

export default TimerDisplay;
