// Sistema de diseño completo - Basado en el diseño de referencia
// Estilo fitness/health moderno con verde neón como color principal

export const AppTheme = {
  // Paleta de colores
  colors: {
    // Color principal (verde neón)
    primary: '#BDFF00',
    primaryDark: '#9FE600',
    primaryLight: '#D4FF4D',

    // Colores secundarios
    secondary: '#0080FF',
    secondaryDark: '#0066CC',
    secondaryLight: '#339FFF',

    // Colores de acento
    accent1: '#00FFB8',  // Verde agua
    accent2: '#FF006B',  // Rosa/magenta
    accent3: '#FFB800',  // Amarillo/naranja
    accent4: '#8B5CF6',  // Púrpura

    // Fondos
    background: '#0A0A0A',
    backgroundElevated: '#151515',
    backgroundCard: '#1C1C1E',
    backgroundCardLight: '#2C2C2E',
    backgroundOverlay: 'rgba(0, 0, 0, 0.7)',

    // Textos
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',
    textDisabled: '#48484A',

    // Estados del workout (adaptados al nuevo diseño)
    work: '#BDFF00',
    rest: '#0080FF',
    prepare: '#FFB800',

    // Estados de UI
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#0080FF',

    // Escala de grises
    white: '#FFFFFF',
    black: '#000000',
    gray1: '#F2F2F7',
    gray2: '#E5E5EA',
    gray3: '#D1D1D6',
    gray4: '#C7C7CC',
    gray5: '#AEAEB2',
    gray6: '#8E8E93',
    gray7: '#636366',
    gray8: '#48484A',
    gray9: '#3A3A3C',
    gray10: '#2C2C2E',
    gray11: '#1C1C1E',
    gray12: '#151515',
  },

  // Gradientes
  gradients: {
    primary: ['#BDFF00', '#9FE600'],
    secondary: ['#0080FF', '#0066CC'],
    dark: ['#151515', '#0A0A0A'],
    card: ['#2C2C2E', '#1C1C1E'],
    accent: ['#00FFB8', '#BDFF00'],
  },

  // Tipografía
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },

    fontSize: {
      // Números gigantes para timers
      giant: 72,
      huge: 56,
      xxxl: 48,
      xxl: 40,
      xl: 32,
      lg: 24,
      md: 18,
      base: 16,
      sm: 14,
      xs: 12,
      xxs: 10,
    },

    fontWeight: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
      extraBold: '800',
      black: '900',
    },

    lineHeight: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    letterSpacing: {
      tighter: -0.5,
      tight: -0.25,
      normal: 0,
      wide: 0.25,
      wider: 0.5,
      widest: 1,
    },
  },

  // Espaciado
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 48,
    giant: 64,
  },

  // Border radius
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    full: 9999,
  },

  // Sombras (sutiles, estilo moderno)
  shadows: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.20,
      shadowRadius: 2.5,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.30,
      shadowRadius: 10,
      elevation: 10,
    },
  },

  // Layout
  layout: {
    screenPadding: 20,
    cardPadding: 16,
    sectionSpacing: 24,

    headerHeight: 60,
    tabBarHeight: 80,

    buttonHeight: {
      small: 36,
      medium: 44,
      large: 56,
      xl: 64,
    },

    iconSize: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
      xxl: 48,
    },

    avatarSize: {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 56,
      xl: 72,
    },
  },

  // Animaciones
  animation: {
    duration: {
      fastest: 100,
      fast: 200,
      normal: 300,
      slow: 500,
      slowest: 800,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Opacidades
  opacity: {
    disabled: 0.4,
    hover: 0.8,
    active: 0.6,
    overlay: 0.5,
  },
};

// Estilos comunes reutilizables
export const CommonStyles = {
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },

  screenPadding: {
    paddingHorizontal: AppTheme.layout.screenPadding,
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cards
  card: {
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.layout.cardPadding,
    ...AppTheme.shadows.sm,
  },

  cardLight: {
    backgroundColor: AppTheme.colors.backgroundCardLight,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.layout.cardPadding,
    ...AppTheme.shadows.sm,
  },

  // Textos
  h1: {
    fontSize: AppTheme.typography.fontSize.xxxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    lineHeight: AppTheme.typography.fontSize.xxxl * AppTheme.typography.lineHeight.tight,
  },

  h2: {
    fontSize: AppTheme.typography.fontSize.xxl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    lineHeight: AppTheme.typography.fontSize.xxl * AppTheme.typography.lineHeight.tight,
  },

  h3: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
    lineHeight: AppTheme.typography.fontSize.xl * AppTheme.typography.lineHeight.snug,
  },

  h4: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
  },

  body: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.regular,
    color: AppTheme.colors.text,
    lineHeight: AppTheme.typography.fontSize.base * AppTheme.typography.lineHeight.normal,
  },

  bodySmall: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.regular,
    color: AppTheme.colors.textSecondary,
    lineHeight: AppTheme.typography.fontSize.sm * AppTheme.typography.lineHeight.normal,
  },

  caption: {
    fontSize: AppTheme.typography.fontSize.xs,
    fontWeight: AppTheme.typography.fontWeight.medium,
    color: AppTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: AppTheme.typography.letterSpacing.wide,
  },

  label: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
  },

  // Números grandes para métricas
  metricNumber: {
    fontSize: AppTheme.typography.fontSize.huge,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.primary,
    lineHeight: AppTheme.typography.fontSize.huge * AppTheme.typography.lineHeight.tight,
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  column: {
    flexDirection: 'column',
  },

  // Botones
  button: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: AppTheme.borderRadius.lg,
    paddingVertical: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppTheme.shadows.sm,
  },

  buttonText: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.background,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default AppTheme;
