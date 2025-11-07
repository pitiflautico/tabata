import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: AppTheme.colors.primary,
          textColor: AppTheme.colors.background,
        };
      case 'secondary':
        return {
          backgroundColor: AppTheme.colors.secondary,
          textColor: AppTheme.colors.white,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: AppTheme.colors.primary,
          borderWidth: 2,
          borderColor: AppTheme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: AppTheme.colors.text,
        };
      case 'dark':
        return {
          backgroundColor: AppTheme.colors.backgroundCard,
          textColor: AppTheme.colors.text,
        };
      default:
        return {
          backgroundColor: AppTheme.colors.primary,
          textColor: AppTheme.colors.background,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: AppTheme.spacing.sm,
          paddingHorizontal: AppTheme.spacing.base,
          fontSize: AppTheme.typography.fontSize.sm,
          height: AppTheme.layout.buttonHeight.small,
        };
      case 'medium':
        return {
          paddingVertical: AppTheme.spacing.md,
          paddingHorizontal: AppTheme.spacing.lg,
          fontSize: AppTheme.typography.fontSize.base,
          height: AppTheme.layout.buttonHeight.medium,
        };
      case 'large':
        return {
          paddingVertical: AppTheme.spacing.base,
          paddingHorizontal: AppTheme.spacing.xl,
          fontSize: AppTheme.typography.fontSize.md,
          height: AppTheme.layout.buttonHeight.large,
        };
      default:
        return {
          paddingVertical: AppTheme.spacing.md,
          paddingHorizontal: AppTheme.spacing.lg,
          fontSize: AppTheme.typography.fontSize.base,
          height: AppTheme.layout.buttonHeight.medium,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          height: sizeStyles.height,
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor,
          opacity: disabled ? AppTheme.opacity.disabled : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={sizeStyles.fontSize * 1.2}
              color={variantStyles.textColor}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: variantStyles.textColor,
                fontSize: sizeStyles.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={sizeStyles.fontSize * 1.2}
              color={variantStyles.textColor}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AppTheme.borderRadius.lg,
    ...AppTheme.shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: AppTheme.spacing.sm,
  },
  iconRight: {
    marginLeft: AppTheme.spacing.sm,
  },
});

export default Button;
