/**
 * Timer Plus Design System - PIXEL PERFECT
 * Basado en análisis detallado de screenshots reales
 */

import { Platform } from 'react-native';

export const Colors = {
  // Colores principales (EXACTOS de screenshots)
  work: '#B8FF00',           // Verde lima - WORK
  prepare: '#FFEB00',        // Amarillo - PREPARE
  rest: '#FF5252',           // Rojo - REST
  complete: '#4CAF50',       // Verde éxito

  // Backgrounds
  black: '#000000',          // Negro puro (config screen)
  darkGray: '#1C1C1E',       // Gris oscuro (casi negro)
  mediumGray: '#2C2C2E',     // Gris medio
  lightGray: '#3A3A3C',      // Gris claro para items

  // Text colors
  textBlack: '#000000',      // Negro sobre fondos brillantes
  textWhite: '#FFFFFF',      // Blanco sobre fondos oscuros
  textGray: '#8E8E93',       // Gris para labels secundarios
  textLightGray: '#AEAEB2', // Gris más claro

  // Accent colors (para contadores)
  blue: '#00D9FF',           // Azul - ROUNDS
  yellow: '#FFD600',         // Amarillo - CYCLES
  green: '#39FF14',          // Verde neón - botones
  orange: '#FF9500',         // Naranja - warning

  // UI elements
  saveGreen: '#39FF14',      // Verde para botón SAVE
  cancelGray: '#8E8E93',     // Gris para CANCEL
};

export const Typography = {
  // Timer gigante (números principales)
  timerGiant: {
    fontSize: 140,             // Más grande para portrait
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    letterSpacing: -8,         // Números muy apretados
    includeFontPadding: false,
  },

  timerGiantLandscape: {
    fontSize: 200,             // Aún más grande en landscape
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    letterSpacing: -12,
  },

  // Títulos de fase (WORK, REST, PREPARE)
  phaseTitle: {
    fontSize: 44,
    fontWeight: '900',         // Ultra bold
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    letterSpacing: 2,
  },

  // Header timer (tiempo total)
  headerTimer: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
  },

  // Timer secundario (en barras)
  secondaryTimer: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },

  // Contadores (ROUNDS LEFT)
  counterValue: {
    fontSize: 56,              // Muy grande
    fontWeight: '900',
    letterSpacing: -2,
  },

  counterLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Config screen
  configValue: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },

  configLabel: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  configSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textGray,
    textTransform: 'uppercase',
  },

  // Botones
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Small info text
  smallText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
};

export const Layout = {
  // Botones (EXACTOS según screenshots)
  buttonSquareLarge: {
    width: 88,
    height: 88,
    borderRadius: 8,           // Levemente redondeado
  },

  buttonCircleLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },

  buttonSquareMedium: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },

  headerButton: {
    width: 44,
    height: 44,
  },

  // Spacing (basado en análisis)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // Config screen items
  configItem: {
    height: 70,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  configColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  // Bottom tab bar
  tabBarHeight: 70,
  tabIconSize: 24,
};

// Helper: Obtener color según fase
export const getPhaseColor = (phase) => {
  const map = {
    prepare: Colors.prepare,
    work: Colors.work,
    rest: Colors.rest,
    complete: Colors.complete,
  };
  return map[phase] || Colors.black;
};

// Helper: Texto sobre fondo
export const getTextColor = (backgroundColor) => {
  const brightBg = [Colors.work, Colors.prepare, Colors.rest, Colors.yellow];
  return brightBg.includes(backgroundColor) ? Colors.textBlack : Colors.textWhite;
};

// Helper: Formatear tiempo como :SS o MM:SS
export const formatTimeValue = (seconds) => {
  if (seconds < 60) {
    return `:${String(seconds).padStart(2, '0')}`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Helper: Formatear tiempo MM:SS
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Animaciones
export const Animations = {
  phaseTransition: 250,
  pulse: 150,
  fadeIn: 300,
};

export default {
  Colors,
  Typography,
  Layout,
  getPhaseColor,
  getTextColor,
  formatTimeValue,
  formatTime,
  Animations,
};
