import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppTheme } from '../theme/AppTheme';

const BarChart = ({
  data = [],
  height = 150,
  showLabels = true,
  showValues = true,
  colors = [AppTheme.colors.primary, AppTheme.colors.secondary],
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  const getBarColor = (index) => {
    if (Array.isArray(colors)) {
      return colors[index % colors.length];
    }
    return colors;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { height }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height;
          const barColor = item.color || getBarColor(index);

          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barContainer}>
                {showValues && (
                  <Text style={[styles.value, { color: barColor }]}>
                    {item.value}
                  </Text>
                )}
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              {showLabels && (
                <Text style={styles.label} numberOfLines={1}>
                  {item.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: AppTheme.spacing.xs,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: AppTheme.spacing.xs,
  },
  barContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: AppTheme.borderRadius.sm,
    minHeight: 4,
  },
  value: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    marginBottom: AppTheme.spacing.xs,
  },
  label: {
    fontSize: AppTheme.typography.fontSize.xxs,
    fontWeight: AppTheme.typography.fontWeight.medium,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.xs,
    textTransform: 'uppercase',
  },
});

export default BarChart;
