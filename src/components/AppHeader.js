import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { AppTheme } from '../theme/AppTheme';
import CircularButton from './CircularButton';

const AppHeader = ({
  title,
  subtitle,
  leftButton,
  rightButton,
  backgroundColor = AppTheme.colors.background,
  titleColor = AppTheme.colors.prepare,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.leftSection}>
        {leftButton && (
          <CircularButton
            icon={leftButton.icon}
            onPress={leftButton.onPress}
            size="small"
            color={AppTheme.colors.gray4}
          />
        )}
      </View>

      <View style={styles.centerSection}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {rightButton && (
          <CircularButton
            icon={rightButton.icon}
            onPress={rightButton.onPress}
            size="small"
            color={AppTheme.colors.gray4}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingBottom: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
});

export default AppHeader;
