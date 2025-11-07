import { TabataRatio } from '../models/Block';

/**
 * Templates predefinidos de workout para quick start
 */
export const WORKOUT_PRESETS = [
  {
    id: 'quick-burn',
    name: 'Quick Burn',
    description: '4 minutos intensos para quemar calorías rápido',
    emoji: '🔥',
    color: '#FF5722',
    numberOfBlocks: 1,
    exercisesPerBlock: 4,
    ratio: TabataRatio.CLASSIC,
    difficulty: 'medium',
    estimatedDuration: 4,
    estimatedCalories: 50,
    focus: ['Cardio', 'Full Body'],
  },
  {
    id: 'power-session',
    name: 'Power Session',
    description: '12 minutos de potencia y resistencia',
    emoji: '💪',
    color: '#4CAF50',
    numberOfBlocks: 3,
    exercisesPerBlock: 4,
    ratio: TabataRatio.CLASSIC,
    difficulty: 'hard',
    estimatedDuration: 12,
    estimatedCalories: 150,
    focus: ['Fuerza', 'Resistencia'],
  },
  {
    id: 'beginner-friendly',
    name: 'Beginner Friendly',
    description: '8 minutos suaves para empezar',
    emoji: '🌱',
    color: '#8BC34A',
    numberOfBlocks: 2,
    exercisesPerBlock: 4,
    ratio: TabataRatio.BEGINNER,
    difficulty: 'easy',
    estimatedDuration: 8,
    estimatedCalories: 80,
    focus: ['Principiante', 'Técnica'],
  },
  {
    id: 'endurance-builder',
    name: 'Endurance Builder',
    description: '16 minutos para construir resistencia',
    emoji: '🏃',
    color: '#2196F3',
    numberOfBlocks: 4,
    exercisesPerBlock: 4,
    ratio: TabataRatio.CLASSIC,
    difficulty: 'hard',
    estimatedDuration: 16,
    estimatedCalories: 200,
    focus: ['Resistencia', 'Cardio'],
  },
  {
    id: 'hiit-advanced',
    name: 'HIIT Advanced',
    description: '10 minutos de HIIT extremo',
    emoji: '⚡',
    color: '#FF9800',
    numberOfBlocks: 2,
    exercisesPerBlock: 5,
    ratio: TabataRatio.ADVANCED,
    difficulty: 'extreme',
    estimatedDuration: 10,
    estimatedCalories: 180,
    focus: ['HIIT', 'Explosividad'],
  },
  {
    id: 'lower-body-blast',
    name: 'Lower Body Blast',
    description: '12 minutos enfocados en tren inferior',
    emoji: '🦵',
    color: '#9C27B0',
    numberOfBlocks: 3,
    exercisesPerBlock: 4,
    ratio: TabataRatio.CLASSIC,
    difficulty: 'hard',
    estimatedDuration: 12,
    estimatedCalories: 140,
    focus: ['Piernas', 'Glúteos'],
    muscleGroupFilter: 'LEGS',
  },
];

/**
 * Obtener preset por ID
 */
export const getPresetById = (id) => {
  return WORKOUT_PRESETS.find((preset) => preset.id === id);
};

/**
 * Obtener presets por dificultad
 */
export const getPresetsByDifficulty = (difficulty) => {
  return WORKOUT_PRESETS.filter((preset) => preset.difficulty === difficulty);
};

/**
 * Obtener preset recomendado para principiantes
 */
export const getBeginnerPreset = () => {
  return WORKOUT_PRESETS.find((preset) => preset.id === 'beginner-friendly');
};

/**
 * Obtener preset rápido (< 5 minutos)
 */
export const getQuickPreset = () => {
  return WORKOUT_PRESETS.find((preset) => preset.id === 'quick-burn');
};
