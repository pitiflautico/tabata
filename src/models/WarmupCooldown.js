import { Exercise, ExerciseFrame, MuscleGroup, ExerciseType } from './Exercise';

/**
 * Ejercicios de calentamiento
 */
export const warmupExercises = [
  new Exercise({
    id: 'warmup-001',
    name: 'Marcha en el lugar',
    description: 'Marcha levantando las rodillas moderadamente. Mueve los brazos de forma natural.',
    muscleGroups: [MuscleGroup.FULL_BODY],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 2,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'warmup-001-f1',
        exerciseId: 'warmup-001',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, brazos relajados',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'warmup-001-f2',
        exerciseId: 'warmup-001',
        order: 2,
        title: 'Marcha',
        description: 'Levanta rodilla derecha, balanceando brazos',
        duration: 1
      })
    ]
  }),

  new Exercise({
    id: 'warmup-002',
    name: 'Círculos de brazos',
    description: 'Extiende los brazos y haz círculos amplios hacia adelante y hacia atrás.',
    muscleGroups: [MuscleGroup.SHOULDERS],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 1,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'warmup-002-f1',
        exerciseId: 'warmup-002',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, brazos extendidos a los lados',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'warmup-002-f2',
        exerciseId: 'warmup-002',
        order: 2,
        title: 'Círculos',
        description: 'Haz círculos amplios con los brazos',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'warmup-003',
    name: 'Rotación de cadera',
    description: 'Manos en la cintura, rota la cadera en círculos amplios.',
    muscleGroups: [MuscleGroup.CORE],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 1,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'warmup-003-f1',
        exerciseId: 'warmup-003',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, manos en la cintura',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'warmup-003-f2',
        exerciseId: 'warmup-003',
        order: 2,
        title: 'Rotación',
        description: 'Rota la cadera en círculos amplios',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'warmup-004',
    name: 'Estiramiento dinámico de piernas',
    description: 'Balancea una pierna hacia adelante y atrás manteniendo el equilibrio.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.HAMSTRINGS],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 2,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'warmup-004-f1',
        exerciseId: 'warmup-004',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, equilibrio en una pierna',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'warmup-004-f2',
        exerciseId: 'warmup-004',
        order: 2,
        title: 'Balanceo',
        description: 'Balancea la pierna libre adelante y atrás',
        duration: 2
      })
    ]
  })
];

/**
 * Ejercicios de enfriamiento (cooldown)
 */
export const cooldownExercises = [
  new Exercise({
    id: 'cooldown-001',
    name: 'Estiramiento de cuádriceps',
    description: 'De pie, lleva un talón hacia el glúteo y mantén 20 segundos.',
    muscleGroups: [MuscleGroup.LEGS],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 1,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'cooldown-001-f1',
        exerciseId: 'cooldown-001',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, equilibrio en una pierna',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'cooldown-001-f2',
        exerciseId: 'cooldown-001',
        order: 2,
        title: 'Estiramiento',
        description: 'Lleva talón hacia glúteo, mantén 20s',
        duration: 20
      })
    ]
  }),

  new Exercise({
    id: 'cooldown-002',
    name: 'Estiramiento de femorales',
    description: 'Siéntate con las piernas extendidas, intenta tocar los pies.',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 1,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'cooldown-002-f1',
        exerciseId: 'cooldown-002',
        order: 1,
        title: 'Posición inicial',
        description: 'Sentado, piernas extendidas',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'cooldown-002-f2',
        exerciseId: 'cooldown-002',
        order: 2,
        title: 'Estiramiento',
        description: 'Inclínate hacia adelante, mantén 20s',
        duration: 20
      })
    ]
  }),

  new Exercise({
    id: 'cooldown-003',
    name: 'Estiramiento de gemelos',
    description: 'Apóyate en la pared, estira una pierna atrás con el talón en el suelo.',
    muscleGroups: [MuscleGroup.CALVES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 1,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'cooldown-003-f1',
        exerciseId: 'cooldown-003',
        order: 1,
        title: 'Posición inicial',
        description: 'Manos en la pared',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'cooldown-003-f2',
        exerciseId: 'cooldown-003',
        order: 2,
        title: 'Estiramiento',
        description: 'Pierna atrás, talón en suelo, mantén 20s',
        duration: 20
      })
    ]
  }),

  new Exercise({
    id: 'cooldown-004',
    name: 'Estiramiento de glúteos',
    description: 'Tumbado, cruza una pierna sobre la otra y tira hacia el pecho.',
    muscleGroups: [MuscleGroup.GLUTES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 1,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'cooldown-004-f1',
        exerciseId: 'cooldown-004',
        order: 1,
        title: 'Posición inicial',
        description: 'Tumbado boca arriba',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'cooldown-004-f2',
        exerciseId: 'cooldown-004',
        order: 2,
        title: 'Estiramiento',
        description: 'Cruza pierna y tira hacia pecho, mantén 20s',
        duration: 20
      })
    ]
  }),

  new Exercise({
    id: 'cooldown-005',
    name: 'Respiración profunda',
    description: 'De pie, inhala profundamente elevando los brazos, exhala bajándolos.',
    muscleGroups: [MuscleGroup.CORE],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 1,
    intensityLevel: 1,
    equipment: [],
    variations: [],
    frames: [
      new ExerciseFrame({
        id: 'cooldown-005-f1',
        exerciseId: 'cooldown-005',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, brazos relajados',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'cooldown-005-f2',
        exerciseId: 'cooldown-005',
        order: 2,
        title: 'Inhalación',
        description: 'Inhala elevando brazos lentamente',
        duration: 4
      }),
      new ExerciseFrame({
        id: 'cooldown-005-f3',
        exerciseId: 'cooldown-005',
        order: 3,
        title: 'Exhalación',
        description: 'Exhala bajando brazos lentamente',
        duration: 4
      })
    ]
  })
];

/**
 * Crea un bloque de calentamiento
 */
export function createWarmupBlock(duration = 300) {
  // 5 minutos de calentamiento
  return {
    id: 'warmup-block',
    name: 'Calentamiento',
    exercises: warmupExercises,
    duration: duration,
    type: 'warmup'
  };
}

/**
 * Crea un bloque de enfriamiento
 */
export function createCooldownBlock(duration = 300) {
  // 5 minutos de enfriamiento
  return {
    id: 'cooldown-block',
    name: 'Enfriamiento',
    exercises: cooldownExercises,
    duration: duration,
    type: 'cooldown'
  };
}
