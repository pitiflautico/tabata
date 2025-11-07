import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

let alertInstance = null;

/**
 * Custom Alert Component con diseño oscuro
 * Reemplaza Alert.alert nativo
 */
const CustomAlertComponent = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    buttons: [],
    type: 'info', // 'info', 'success', 'warning', 'error'
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  const show = (title, message, buttons = [], type = 'info') => {
    setConfig({ title, message, buttons, type });
    setVisible(true);
  };

  const hide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const handleButton = (button) => {
    hide();
    if (button.onPress) {
      // Ejecutar después de que la animación termine
      setTimeout(() => button.onPress(), 200);
    }
  };

  const getIconAndColor = () => {
    switch (config.type) {
      case 'success':
        return { icon: 'checkmark-circle', color: AppTheme.colors.success };
      case 'warning':
        return { icon: 'warning', color: AppTheme.colors.warning };
      case 'error':
        return { icon: 'close-circle', color: AppTheme.colors.error };
      default:
        return { icon: 'information-circle', color: AppTheme.colors.primary };
    }
  };

  const { icon, color } = getIconAndColor();

  // Botones por defecto si no se proporcionan
  const displayButtons =
    config.buttons.length > 0
      ? config.buttons
      : [{ text: 'OK', onPress: () => {} }];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={hide}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            // Solo cerrar si hay botón de cancelar
            const cancelButton = displayButtons.find(
              (b) => b.style === 'cancel'
            );
            if (cancelButton) {
              handleButton(cancelButton);
            }
          }}
        />

        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={40} color={color} />
          </View>

          {/* Title */}
          {config.title ? (
            <Text style={styles.title}>{config.title}</Text>
          ) : null}

          {/* Message */}
          {config.message ? (
            <Text style={styles.message}>{config.message}</Text>
          ) : null}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {displayButtons.map((button, index) => {
              const isDestructive = button.style === 'destructive';
              const isCancel = button.style === 'cancel';
              const isPrimary =
                !isDestructive &&
                !isCancel &&
                (displayButtons.length === 1 || index === displayButtons.length - 1);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isPrimary && styles.buttonPrimary,
                    isDestructive && styles.buttonDestructive,
                    isCancel && styles.buttonCancel,
                    displayButtons.length > 2 && styles.buttonVertical,
                  ]}
                  onPress={() => handleButton(button)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isPrimary && styles.buttonTextPrimary,
                      isDestructive && styles.buttonTextDestructive,
                      isCancel && styles.buttonTextCancel,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  alertContainer: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
    ...AppTheme.shadows.large,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
  },
  title: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  message: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: AppTheme.spacing.xl,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: AppTheme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.lg,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonVertical: {
    width: '100%',
    flex: 0,
  },
  buttonPrimary: {
    backgroundColor: AppTheme.colors.primary,
  },
  buttonDestructive: {
    backgroundColor: AppTheme.colors.error + '20',
  },
  buttonCancel: {
    backgroundColor: AppTheme.colors.backgroundCardLight,
  },
  buttonText: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.textSecondary,
  },
  buttonTextPrimary: {
    color: AppTheme.colors.background,
  },
  buttonTextDestructive: {
    color: AppTheme.colors.error,
  },
  buttonTextCancel: {
    color: AppTheme.colors.textSecondary,
  },
});

// Singleton para mostrar alertas desde cualquier parte
class CustomAlert {
  static setAlertRef(ref) {
    alertInstance = ref;
  }

  static alert(title, message, buttons, options = {}) {
    if (!alertInstance) {
      console.warn('CustomAlert no está montado. Usando Alert nativo como fallback.');
      // Fallback a Alert nativo
      const Alert = require('react-native').Alert;
      return Alert.alert(title, message, buttons);
    }

    const type = options.type || 'info';
    const formattedButtons = buttons || [{ text: 'OK' }];

    alertInstance.show(title, message, formattedButtons, type);
  }

  static success(title, message, buttons) {
    this.alert(title, message, buttons, { type: 'success' });
  }

  static warning(title, message, buttons) {
    this.alert(title, message, buttons, { type: 'warning' });
  }

  static error(title, message, buttons) {
    this.alert(title, message, buttons, { type: 'error' });
  }

  static confirm(title, message, onConfirm, onCancel) {
    this.alert(title, message, [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ]);
  }
}

export { CustomAlertComponent, CustomAlert };
