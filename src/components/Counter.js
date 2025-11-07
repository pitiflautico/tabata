import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppTheme } from '../theme/AppTheme';

const Counter = ({
  value,
  label,
  color = AppTheme.colors.rounds,
  size = 'medium',
}) => {
  const sizeConfig = {
    small: {
      numberSize: AppTheme.typography.fontSize.xl,
      labelSize: AppTheme.typography.fontSize.xs,
    },
    medium: {
      numberSize: AppTheme.typography.fontSize.huge,
      labelSize: AppTheme.typography.fontSize.sm,
    },
    large: {
      numberSize: AppTheme.typography.fontSize.giant,
      labelSize: AppTheme.typography.fontSize.md,
    },
  };

  const config = sizeConfig[size];

  return (
    <View style={styles.container}>
      <Text style={[styles.number, { fontSize: config.numberSize, color }]}>
        {value}
      </Text>
      <Text style={[styles.label, { fontSize: config.labelSize }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontWeight: AppTheme.typography.fontWeight.black,
    lineHeight: AppTheme.typography.fontSize.huge * 0.9,
  },
  label: {
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: AppTheme.spacing.xs,
  },
});

export default Counter;
