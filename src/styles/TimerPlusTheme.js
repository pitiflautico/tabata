/**
 * Timer Plus Design System
 * Basado en análisis de screenshots de Timer Plus app
 */

export const TimerPlusColors = {
  // Colores principales de fases
  work: '#B8FF00',           // Verde lima brillante para WORK
  prepare: '#FFEB00',        // Amarillo brillante para PREPARE
  rest: '#FF5252',           // Rojo coral para REST
  complete: '#00D9FF',       // Azul para COMPLETE

  // Colores de fondo
  backgroundDark: '#1C1C1E', // Negro/gris oscuro principal
  backgroundLight: '#2C2C2E', // Gris oscuro secundario

  // Colores de texto
  textOnBright: '#000000',   // Negro sobre fondos brillantes
  textOnDark: '#FFFFFF',     // Blanco sobre fondos oscuros
  textSecondary: '#8E8E93',  // Gris para texto secundario

  // Colores de UI
  infoBlue: '#00D9FF',       // Azul para contadores
  successGreen: '#39FF14',   // Verde neón para botones activos
  warning: '#FF9500',        // Naranja para alertas

  // Colores de configuración (por tipo de intervalo)
  configRest: '#FF5252',
  configWork: '#39FF14',
  configRounds: '#00D9FF',
  configCycles: '#FFEB00',
};

export const TimerPlusTypography = {
  // Timer gigante (números principales)
  timerGiant: {
    fontSize: 120,           // Ajustable según pantalla
    fontWeight: '900',       // Ultra bold
    fontFamily: 'System',    // Usar fuente del sistema bold
    letterSpacing: -4,       // Números apretados
  },

  // Títulos de fase (WORK, REST, PREPARE)
  phaseTitle: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'System',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Timer secundario (próxima fase)
  timerSecondary: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: -2,
  },

  // Contadores (ROUNDS LEFT, etc)
  counterLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  counterValue: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily: 'System',
  },

  // Info secundaria
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Texto pequeño
  smallText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
    textTransform: 'lowercase',
  },
};

export const TimerPlusLayout = {
  // Dimensiones de botones
  buttonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  buttonMedium: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  buttonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Alturas de secciones
  headerHeight: 80,
  footerHeight: 100,
  tabBarHeight: 50,

  // Bordes
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
  },
};

// Helper para obtener color según fase
export function getPhaseColor(phase) {
  const phaseColors = {
    prepare: TimerPlusColors.prepare,
    work: TimerPlusColors.work,
    rest: TimerPlusColors.rest,
    complete: TimerPlusColors.complete,
  };
  return phaseColors[phase] || TimerPlusColors.backgroundDark;
}

// Helper para obtener color de texto según fondo
export function getTextColorForBackground(backgroundColor) {
  // Fondos brillantes = texto negro
  const brightBackgrounds = [
    TimerPlusColors.work,
    TimerPlusColors.prepare,
    TimerPlusColors.rest,
    TimerPlusColors.complete,
  ];

  return brightBackgrounds.includes(backgroundColor)
    ? TimerPlusColors.textOnBright
    : TimerPlusColors.textOnDark;
}

// Configuración de animaciones
export const TimerPlusAnimations = {
  phaseTransition: {
    duration: 300,
    easing: 'ease-in-out',
  },

  pulseEffect: {
    duration: 1000,
    iterations: 'infinite',
  },

  countdownFlash: {
    duration: 200,
    easing: 'ease-out',
  },
};

export default {
  TimerPlusColors,
  TimerPlusTypography,
  TimerPlusLayout,
  TimerPlusAnimations,
  getPhaseColor,
  getTextColorForBackground,
};
