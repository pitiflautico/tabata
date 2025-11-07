import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import Card from './Card';

const MetricCard = ({
  value,
  unit = '',
  label,
  icon,
  color = AppTheme.colors.primary,
  trend,
  trendValue,
  size = 'medium',
  onPress,
}) => {
  const sizes = {
    small: {
      value: AppTheme.typography.fontSize.xl,
      label: AppTheme.typography.fontSize.xs,
      icon: AppTheme.layout.iconSize.md,
    },
    medium: {
      value: AppTheme.typography.fontSize.xxxl,
      label: AppTheme.typography.fontSize.sm,
      icon: AppTheme.layout.iconSize.lg,
    },
    large: {
      value: AppTheme.typography.fontSize.huge,
      label: AppTheme.typography.fontSize.md,
      icon: AppTheme.layout.iconSize.xl,
    },
  };

  const sizeConfig = sizes[size];

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={sizeConfig.icon} color={color} />
          </View>
        )}
        {trend && (
          <View style={[styles.trendContainer, { backgroundColor: trend === 'up' ? AppTheme.colors.success + '20' : AppTheme.colors.error + '20' }]}>
            <Ionicons
              name={trend === 'up' ? 'trending-up' : 'trending-down'}
              size={16}
              color={trend === 'up' ? AppTheme.colors.success : AppTheme.colors.error}
            />
            {trendValue && (
              <Text style={[styles.trendValue, { color: trend === 'up' ? AppTheme.colors.success : AppTheme.colors.error }]}>
                {trendValue}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { fontSize: sizeConfig.value, color }]}>
            {value}
          </Text>
          {unit && (
            <Text style={[styles.unit, { color }]}>
              {unit}
            </Text>
          )}
        </View>
        <Text style={[styles.label, { fontSize: sizeConfig.label }]}>
          {label}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: AppTheme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  trendValue: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontWeight: AppTheme.typography.fontWeight.bold,
    lineHeight: AppTheme.typography.fontSize.huge * AppTheme.typography.lineHeight.tight,
  },
  unit: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.medium,
    marginLeft: 4,
    opacity: 0.8,
  },
  label: {
    fontWeight: AppTheme.typography.fontWeight.medium,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.xs,
    textTransform: 'capitalize',
  },
});

export default MetricCard;
