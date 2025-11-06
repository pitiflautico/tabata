import { Exercise, ExerciseFrame, MuscleGroup, ExerciseType, IntensityLevel } from '../models/Exercise';

/**
 * Catálogo de ejercicios - Tren Inferior
 */
export const lowerBodyExercises = [
  new Exercise({
    id: 'lower-001',
    name: 'Sentadillas',
    description: 'Ejercicio fundamental para piernas y glúteos. De pie con pies al ancho de hombros, baja flexionando rodillas y caderas manteniendo la espalda recta.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 2.5,
    intensityLevel: IntensityLevel.MEDIUM,
    equipment: [],
    variations: ['Sentadilla con salto', 'Sentadilla isométrica', 'Sentadilla con peso'],
    frames: [
      new ExerciseFrame({
        id: 'lower-001-f1',
        exerciseId: 'lower-001',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, pies al ancho de hombros, brazos al frente',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-001-f2',
        exerciseId: 'lower-001',
        order: 2,
        title: 'Bajada controlada',
        description: 'Flexiona rodillas y caderas, baja hasta 90 grados',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-001-f3',
        exerciseId: 'lower-001',
        order: 3,
        title: 'Subida explosiva',
        description: 'Extiende piernas y vuelve a posición inicial',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-002',
    name: 'Zancadas (Lunges)',
    description: 'Da un paso largo hacia adelante y baja la rodilla trasera hacia el suelo. Alterna las piernas.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM,
    equipment: [],
    variations: ['Zancadas caminando', 'Zancadas inversas', 'Zancadas laterales'],
    frames: [
      new ExerciseFrame({
        id: 'lower-002-f1',
        exerciseId: 'lower-002',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, pies juntos, manos en la cintura',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-002-f2',
        exerciseId: 'lower-002',
        order: 2,
        title: 'Paso adelante',
        description: 'Da un paso largo hacia adelante',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-002-f3',
        exerciseId: 'lower-002',
        order: 3,
        title: 'Descenso',
        description: 'Baja la rodilla trasera hacia el suelo',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-002-f4',
        exerciseId: 'lower-002',
        order: 4,
        title: 'Retorno',
        description: 'Empuja con la pierna delantera y vuelve al inicio',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-003',
    name: 'Elevaciones de talones',
    description: 'De pie, eleva los talones lo más alto posible contrayendo los gemelos.',
    muscleGroups: [MuscleGroup.CALVES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 2,
    intensityLevel: IntensityLevel.LOW,
    equipment: [],
    variations: ['Elevaciones a una pierna', 'Elevaciones en escalón'],
    frames: [
      new ExerciseFrame({
        id: 'lower-003-f1',
        exerciseId: 'lower-003',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, pies paralelos al ancho de hombros',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-003-f2',
        exerciseId: 'lower-003',
        order: 2,
        title: 'Elevación',
        description: 'Eleva los talones contrayendo gemelos',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-003-f3',
        exerciseId: 'lower-003',
        order: 3,
        title: 'Descenso controlado',
        description: 'Baja lentamente los talones al suelo',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-004',
    name: 'Puente de glúteos',
    description: 'Tumbado boca arriba con rodillas flexionadas, eleva las caderas contrayendo glúteos.',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 2,
    intensityLevel: IntensityLevel.MEDIUM_LOW,
    equipment: [],
    variations: ['Puente a una pierna', 'Puente con banda elástica'],
    frames: [
      new ExerciseFrame({
        id: 'lower-004-f1',
        exerciseId: 'lower-004',
        order: 1,
        title: 'Posición inicial',
        description: 'Tumbado boca arriba, rodillas flexionadas, pies en el suelo',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-004-f2',
        exerciseId: 'lower-004',
        order: 2,
        title: 'Elevación de cadera',
        description: 'Eleva caderas contrayendo glúteos hasta formar línea recta',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-004-f3',
        exerciseId: 'lower-004',
        order: 3,
        title: 'Descenso',
        description: 'Baja controladamente sin tocar el suelo',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-005',
    name: 'Step-ups',
    description: 'Sube y baja de un banco o escalón alternando las piernas.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
    type: ExerciseType.BENCH,
    cardioIndex: 4,
    intensityLevel: IntensityLevel.MEDIUM_HIGH,
    equipment: ['banco', 'escalón'],
    variations: ['Step-ups con salto', 'Step-ups laterales'],
    frames: [
      new ExerciseFrame({
        id: 'lower-005-f1',
        exerciseId: 'lower-005',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie frente al banco',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-005-f2',
        exerciseId: 'lower-005',
        order: 2,
        title: 'Subida',
        description: 'Coloca un pie en el banco y empuja hacia arriba',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-005-f3',
        exerciseId: 'lower-005',
        order: 3,
        title: 'Posición superior',
        description: 'Ambos pies en el banco, cuerpo erguido',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-005-f4',
        exerciseId: 'lower-005',
        order: 4,
        title: 'Descenso',
        description: 'Baja controladamente alternando las piernas',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-006',
    name: 'Sentadilla búlgara',
    description: 'Con un pie elevado detrás en un banco, realiza sentadilla con la pierna delantera.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
    type: ExerciseType.BENCH,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM_HIGH,
    equipment: ['banco'],
    variations: ['Con mancuernas', 'Con salto'],
    frames: [
      new ExerciseFrame({
        id: 'lower-006-f1',
        exerciseId: 'lower-006',
        order: 1,
        title: 'Posición inicial',
        description: 'Pie trasero elevado en banco, pierna delantera adelante',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-006-f2',
        exerciseId: 'lower-006',
        order: 2,
        title: 'Descenso',
        description: 'Baja flexionando la rodilla delantera',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-006-f3',
        exerciseId: 'lower-006',
        order: 3,
        title: 'Ascenso',
        description: 'Empuja con la pierna delantera para subir',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-007',
    name: 'Peso muerto a una pierna',
    description: 'De pie en una pierna, inclínate hacia adelante manteniendo la espalda recta y la pierna libre extendida atrás.',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM,
    equipment: [],
    variations: ['Con mancuernas', 'Con kettlebell'],
    frames: [
      new ExerciseFrame({
        id: 'lower-007-f1',
        exerciseId: 'lower-007',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie en una pierna, ligera flexión de rodilla',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-007-f2',
        exerciseId: 'lower-007',
        order: 2,
        title: 'Inclinación',
        description: 'Inclínate hacia adelante, pierna libre extendida atrás',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-007-f3',
        exerciseId: 'lower-007',
        order: 3,
        title: 'Retorno',
        description: 'Vuelve a posición vertical contrayendo glúteos',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-008',
    name: 'Sentadilla sumo',
    description: 'Sentadilla con pies más separados que el ancho de hombros y puntas hacia afuera, trabaja aductores.',
    muscleGroups: [MuscleGroup.ADDUCTORS, MuscleGroup.LEGS, MuscleGroup.GLUTES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM,
    equipment: [],
    variations: ['Con mancuerna', 'Con kettlebell'],
    frames: [
      new ExerciseFrame({
        id: 'lower-008-f1',
        exerciseId: 'lower-008',
        order: 1,
        title: 'Posición inicial',
        description: 'Pies separados, puntas hacia fuera 45 grados',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-008-f2',
        exerciseId: 'lower-008',
        order: 2,
        title: 'Descenso',
        description: 'Baja manteniendo rodillas alineadas con pies',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-008-f3',
        exerciseId: 'lower-008',
        order: 3,
        title: 'Ascenso',
        description: 'Empuja desde los talones para subir',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-009',
    name: 'Saltos al banco',
    description: 'Salta explosivamente sobre un banco y baja controladamente.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
    type: ExerciseType.BENCH,
    cardioIndex: 5,
    intensityLevel: IntensityLevel.HIGH,
    equipment: ['banco'],
    variations: ['Saltos al suelo', 'Box jumps'],
    frames: [
      new ExerciseFrame({
        id: 'lower-009-f1',
        exerciseId: 'lower-009',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie frente al banco, pies al ancho de hombros',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-009-f2',
        exerciseId: 'lower-009',
        order: 2,
        title: 'Impulso',
        description: 'Flexiona y balancea brazos hacia atrás',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-009-f3',
        exerciseId: 'lower-009',
        order: 3,
        title: 'Salto',
        description: 'Salta explosivamente hacia el banco',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-009-f4',
        exerciseId: 'lower-009',
        order: 4,
        title: 'Aterrizaje',
        description: 'Aterriza suavemente en el banco',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-009-f5',
        exerciseId: 'lower-009',
        order: 5,
        title: 'Descenso',
        description: 'Baja controladamente del banco',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'lower-010',
    name: 'Patada de glúteo',
    description: 'En cuadrupedia, extiende una pierna hacia atrás contrayendo el glúteo.',
    muscleGroups: [MuscleGroup.GLUTES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 2,
    intensityLevel: IntensityLevel.LOW,
    equipment: [],
    variations: ['Con banda elástica', 'Con tobillera lastrada'],
    frames: [
      new ExerciseFrame({
        id: 'lower-010-f1',
        exerciseId: 'lower-010',
        order: 1,
        title: 'Posición inicial',
        description: 'En cuadrupedia, manos y rodillas en el suelo',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-010-f2',
        exerciseId: 'lower-010',
        order: 2,
        title: 'Extensión',
        description: 'Extiende una pierna hacia atrás y arriba',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-010-f3',
        exerciseId: 'lower-010',
        order: 3,
        title: 'Contracción',
        description: 'Contrae el glúteo en la posición máxima',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-010-f4',
        exerciseId: 'lower-010',
        order: 4,
        title: 'Retorno',
        description: 'Vuelve a posición inicial',
        duration: 1
      })
    ]
  }),

  new Exercise({
    id: 'lower-011',
    name: 'Desplazamiento lateral',
    description: 'Da pasos laterales amplios manteniendo posición semi-agachada.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM,
    equipment: [],
    variations: ['Con banda elástica', 'Con toque al suelo'],
    frames: [
      new ExerciseFrame({
        id: 'lower-011-f1',
        exerciseId: 'lower-011',
        order: 1,
        title: 'Posición inicial',
        description: 'Semi-agachado, pies al ancho de hombros',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-011-f2',
        exerciseId: 'lower-011',
        order: 2,
        title: 'Desplazamiento',
        description: 'Da un paso lateral amplio manteniendo la postura',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-011-f3',
        exerciseId: 'lower-011',
        order: 3,
        title: 'Junta pies',
        description: 'Acerca el otro pie sin levantarte',
        duration: 1
      })
    ]
  }),

  new Exercise({
    id: 'lower-012',
    name: 'Elevación de cadera a una pierna',
    description: 'Puente de glúteos con una sola pierna apoyada en el suelo.',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM,
    equipment: [],
    variations: ['Con pie elevado', 'Con banda elástica'],
    frames: [
      new ExerciseFrame({
        id: 'lower-012-f1',
        exerciseId: 'lower-012',
        order: 1,
        title: 'Posición inicial',
        description: 'Tumbado, una pierna flexionada, otra extendida',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'lower-012-f2',
        exerciseId: 'lower-012',
        order: 2,
        title: 'Elevación',
        description: 'Eleva cadera contrayendo glúteo de la pierna apoyada',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'lower-012-f3',
        exerciseId: 'lower-012',
        order: 3,
        title: 'Descenso',
        description: 'Baja controladamente sin tocar el suelo',
        duration: 2
      })
    ]
  })
];

/**
 * Catálogo de ejercicios combinados - Tren Superior + Inferior
 */
export const comboExercises = [
  new Exercise({
    id: 'combo-001',
    name: 'Sentadilla + Press de hombros',
    description: 'Realiza una sentadilla y al subir presiona las mancuernas sobre tu cabeza.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES, MuscleGroup.SHOULDERS],
    type: ExerciseType.DUMBBELL,
    cardioIndex: 4,
    intensityLevel: IntensityLevel.MEDIUM_HIGH,
    equipment: ['mancuernas'],
    variations: ['Con kettlebell', 'Con barra'],
    isCombo: true,
    frames: [
      new ExerciseFrame({
        id: 'combo-001-f1',
        exerciseId: 'combo-001',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, mancuernas a la altura de hombros',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-001-f2',
        exerciseId: 'combo-001',
        order: 2,
        title: 'Sentadilla',
        description: 'Baja en sentadilla manteniendo mancuernas en hombros',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'combo-001-f3',
        exerciseId: 'combo-001',
        order: 3,
        title: 'Subida',
        description: 'Sube de la sentadilla',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-001-f4',
        exerciseId: 'combo-001',
        order: 4,
        title: 'Press',
        description: 'Presiona mancuernas sobre la cabeza',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'combo-001-f5',
        exerciseId: 'combo-001',
        order: 5,
        title: 'Retorno',
        description: 'Baja mancuernas a hombros',
        duration: 1
      })
    ]
  }),

  new Exercise({
    id: 'combo-002',
    name: 'Zancada + Curl de bíceps',
    description: 'Realiza una zancada y simultáneamente un curl de bíceps con mancuernas.',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES, MuscleGroup.ARMS],
    type: ExerciseType.DUMBBELL,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM,
    equipment: ['mancuernas'],
    variations: ['Con kettlebells', 'Zancada inversa + curl'],
    isCombo: true,
    frames: [
      new ExerciseFrame({
        id: 'combo-002-f1',
        exerciseId: 'combo-002',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, mancuernas a los lados',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-002-f2',
        exerciseId: 'combo-002',
        order: 2,
        title: 'Zancada',
        description: 'Da paso adelante en zancada',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-002-f3',
        exerciseId: 'combo-002',
        order: 3,
        title: 'Curl',
        description: 'Realiza curl de bíceps mientras mantienes la zancada',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'combo-002-f4',
        exerciseId: 'combo-002',
        order: 4,
        title: 'Retorno',
        description: 'Vuelve a posición inicial',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'combo-003',
    name: 'Peso muerto + Remo',
    description: 'Realiza un peso muerto y en la posición inclinada haz un remo con mancuernas.',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK],
    type: ExerciseType.DUMBBELL,
    cardioIndex: 3,
    intensityLevel: IntensityLevel.MEDIUM_HIGH,
    equipment: ['mancuernas'],
    variations: ['Con barra', 'Con kettlebells'],
    isCombo: true,
    frames: [
      new ExerciseFrame({
        id: 'combo-003-f1',
        exerciseId: 'combo-003',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie, mancuernas frente a muslos',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-003-f2',
        exerciseId: 'combo-003',
        order: 2,
        title: 'Peso muerto',
        description: 'Inclínate hacia adelante con espalda recta',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'combo-003-f3',
        exerciseId: 'combo-003',
        order: 3,
        title: 'Remo',
        description: 'En posición inclinada, haz remo llevando codos atrás',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'combo-003-f4',
        exerciseId: 'combo-003',
        order: 4,
        title: 'Retorno',
        description: 'Vuelve a posición vertical',
        duration: 2
      })
    ]
  }),

  new Exercise({
    id: 'combo-004',
    name: 'Burpee con flexión',
    description: 'Burpee completo incluyendo una flexión de pecho en el suelo.',
    muscleGroups: [MuscleGroup.FULL_BODY],
    type: ExerciseType.BODYWEIGHT,
    cardioIndex: 5,
    intensityLevel: IntensityLevel.HIGH,
    equipment: [],
    variations: ['Sin flexión', 'Con salto al final'],
    isCombo: true,
    frames: [
      new ExerciseFrame({
        id: 'combo-004-f1',
        exerciseId: 'combo-004',
        order: 1,
        title: 'Posición inicial',
        description: 'De pie',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-004-f2',
        exerciseId: 'combo-004',
        order: 2,
        title: 'Bajada',
        description: 'Agáchate y apoya manos en el suelo',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-004-f3',
        exerciseId: 'combo-004',
        order: 3,
        title: 'Plancha',
        description: 'Salta con pies atrás a posición de plancha',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-004-f4',
        exerciseId: 'combo-004',
        order: 4,
        title: 'Flexión',
        description: 'Realiza una flexión completa',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'combo-004-f5',
        exerciseId: 'combo-004',
        order: 5,
        title: 'Recogida',
        description: 'Salta con pies hacia las manos',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-004-f6',
        exerciseId: 'combo-004',
        order: 6,
        title: 'Salto',
        description: 'Salta hacia arriba con brazos extendidos',
        duration: 1
      })
    ]
  }),

  new Exercise({
    id: 'combo-005',
    name: 'Thruster',
    description: 'Sentadilla frontal seguida de press de hombros en un movimiento fluido.',
    muscleGroups: [MuscleGroup.FULL_BODY],
    type: ExerciseType.DUMBBELL,
    cardioIndex: 5,
    intensityLevel: IntensityLevel.HIGH,
    equipment: ['mancuernas', 'kettlebell'],
    variations: ['Con barra', 'Con kettlebell'],
    isCombo: true,
    frames: [
      new ExerciseFrame({
        id: 'combo-005-f1',
        exerciseId: 'combo-005',
        order: 1,
        title: 'Posición inicial',
        description: 'Mancuernas en hombros, pies al ancho de hombros',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-005-f2',
        exerciseId: 'combo-005',
        order: 2,
        title: 'Sentadilla',
        description: 'Baja en sentadilla profunda',
        duration: 2
      }),
      new ExerciseFrame({
        id: 'combo-005-f3',
        exerciseId: 'combo-005',
        order: 3,
        title: 'Explosión',
        description: 'Sube explosivamente de la sentadilla',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-005-f4',
        exerciseId: 'combo-005',
        order: 4,
        title: 'Press',
        description: 'Continúa el movimiento presionando mancuernas arriba',
        duration: 1
      }),
      new ExerciseFrame({
        id: 'combo-005-f5',
        exerciseId: 'combo-005',
        order: 5,
        title: 'Retorno',
        description: 'Baja mancuernas a hombros',
        duration: 1
      })
    ]
  })
];

/**
 * Catálogo completo de ejercicios
 */
export const exerciseCatalog = [...lowerBodyExercises, ...comboExercises];

/**
 * Obtener ejercicio por ID
 */
export const getExerciseById = (id) => {
  return exerciseCatalog.find(ex => ex.id === id);
};

/**
 * Filtrar ejercicios por grupo muscular
 */
export const getExercisesByMuscleGroup = (muscleGroup) => {
  return exerciseCatalog.filter(ex => ex.worksMuscleGroup(muscleGroup));
};

/**
 * Filtrar ejercicios por tipo
 */
export const getExercisesByType = (type) => {
  return exerciseCatalog.filter(ex => ex.type === type);
};

/**
 * Filtrar ejercicios por intensidad cardio
 */
export const getExercisesByCardioIntensity = (minIndex, maxIndex) => {
  return exerciseCatalog.filter(ex =>
    ex.cardioIndex >= minIndex && ex.cardioIndex <= maxIndex
  );
};

/**
 * Obtener ejercicios combinados
 */
export const getComboExercises = () => {
  return comboExercises;
};

/**
 * Obtener ejercicios de tren inferior
 */
export const getLowerBodyExercises = () => {
  return lowerBodyExercises;
};
