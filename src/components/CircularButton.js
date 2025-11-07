import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

const CircularButton = ({
  icon,
  size = 'medium',
  color = AppTheme.colors.backgroundCard,
  iconColor = AppTheme.colors.white,
  onPress,
  style,
  disabled = false,
}) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80,
  };

  const iconSizeMap = {
    small: 20,
    medium: 28,
    large: 36,
  };

  const buttonSize = sizeMap[size];
  const iconSize = iconSizeMap[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: color,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularButton;
