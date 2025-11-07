import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppTheme } from '../theme/AppTheme';

const Card = ({
  children,
  style,
  light = false,
  onPress,
  padding = true,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        light && styles.cardLight,
        !padding && styles.noPadding,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.layout.cardPadding,
    ...AppTheme.shadows.sm,
  },
  cardLight: {
    backgroundColor: AppTheme.colors.backgroundCardLight,
  },
  noPadding: {
    padding: 0,
  },
});

export default Card;
