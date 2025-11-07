import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

const ConfigItem = ({
  label,
  description,
  value,
  color,
  onPress,
  showChevron = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.indicator, { backgroundColor: color }]} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.value}>{value}</Text>
        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={24}
            color={AppTheme.colors.gray2}
            style={styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppTheme.colors.gray6,
    paddingVertical: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    width: 8,
    height: 40,
    borderRadius: AppTheme.borderRadius.sm,
    marginRight: AppTheme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: AppTheme.typography.fontSize.md,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.regular,
    color: AppTheme.colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: AppTheme.spacing.xs,
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.black,
    color: AppTheme.colors.white,
    marginRight: AppTheme.spacing.sm,
  },
  chevron: {
    marginLeft: AppTheme.spacing.xs,
  },
});

export default ConfigItem;
