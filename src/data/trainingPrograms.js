import { TrainingProgram, ProgramWeek, ProgramDay } from '../models/Program';
import { TabataRatio } from '../models/Block';

/**
 * Programa: Tabata para Principiantes (4 semanas)
 */
export const beginnerProgram = new TrainingProgram({
  id: 'program-beginner',
  name: 'Tabata para Principiantes',
  description: 'Programa de 4 semanas diseñado para personas que comienzan con entrenamientos Tabata. Aumenta gradualmente la intensidad y duración.',
  durationWeeks: 4,
  level: 'beginner',
  weeks: [
    // Semana 1
    new ProgramWeek({
      number: 1,
      focus: 'Adaptación al método Tabata',
      restDays: [3, 6, 7],
      days: [
        new ProgramDay({
          dayNumber: 1,
          name: 'Introducción',
          description: 'Primer contacto con Tabata',
          workoutConfig: {
            numberOfBlocks: 2,
            exercisesPerBlock: 3,
            ratio: TabataRatio.BEGINNER,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 2,
          name: 'Tren Inferior',
          description: 'Enfoque en piernas y glúteos',
          workoutConfig: {
            numberOfBlocks: 2,
            exercisesPerBlock: 3,
            ratio: TabataRatio.BEGINNER,
            focusMuscleGroup: 'piernas',
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 4,
          name: 'Cuerpo Completo',
          description: 'Ejercicios combinados',
          workoutConfig: {
            numberOfBlocks: 2,
            exercisesPerBlock: 4,
            ratio: TabataRatio.BEGINNER,
            includeCombo: true,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 5,
          name: 'Revisión',
          description: 'Repaso de la semana',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 3,
            ratio: TabataRatio.BEGINNER,
            includeWarmup: true,
            includeCooldown: true
          }
        })
      ]
    }),

    // Semana 2
    new ProgramWeek({
      number: 2,
      focus: 'Incremento de volumen',
      restDays: [3, 7],
      days: [
        new ProgramDay({
          dayNumber: 1,
          name: 'Progresión',
          description: 'Más bloques de entrenamiento',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 3,
            ratio: TabataRatio.BEGINNER,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 2,
          name: 'Tren Inferior Intenso',
          description: 'Más intensidad en piernas',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 4,
            ratio: TabataRatio.BEGINNER,
            focusMuscleGroup: 'piernas',
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 4,
          name: 'Ejercicios Combinados',
          description: 'Más ejercicios de cuerpo completo',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 4,
            ratio: TabataRatio.BEGINNER,
            includeCombo: true,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 5,
          name: 'Variedad',
          description: 'Mix de todos los ejercicios',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 4,
            ratio: TabataRatio.BEGINNER,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 6,
          name: 'Desafío Semanal',
          description: 'El entrenamiento más largo hasta ahora',
          workoutConfig: {
            numberOfBlocks: 4,
            exercisesPerBlock: 4,
            ratio: TabataRatio.BEGINNER,
            includeWarmup: true,
            includeCooldown: true
          }
        })
      ]
    }),

    // Semana 3
    new ProgramWeek({
      number: 3,
      focus: 'Transición a ratio clásico',
      restDays: [7],
      days: [
        new ProgramDay({
          dayNumber: 1,
          name: 'Ratio Clásico - Introducción',
          description: 'Primer día con ratio 40/20',
          workoutConfig: {
            numberOfBlocks: 2,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 2,
          name: 'Adaptación',
          description: 'Seguimos con ratio clásico',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 3,
          name: 'Tren Inferior Clásico',
          description: 'Piernas con ratio clásico',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            focusMuscleGroup: 'piernas',
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 4,
          name: 'Recuperación Activa',
          description: 'Día más ligero',
          workoutConfig: {
            numberOfBlocks: 2,
            exercisesPerBlock: 3,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 5,
          name: 'Intensidad Media',
          description: 'Vuelta a la intensidad',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 6,
          name: 'Desafío de la Semana',
          description: 'El entrenamiento más completo',
          workoutConfig: {
            numberOfBlocks: 4,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        })
      ]
    }),

    // Semana 4
    new ProgramWeek({
      number: 4,
      focus: 'Consolidación y evaluación',
      restDays: [4, 7],
      days: [
        new ProgramDay({
          dayNumber: 1,
          name: 'Revisión General',
          description: 'Repaso de todo lo aprendido',
          workoutConfig: {
            numberOfBlocks: 3,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 2,
          name: 'Alta Intensidad',
          description: 'Ponte a prueba',
          workoutConfig: {
            numberOfBlocks: 4,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 3,
          name: 'Cuerpo Completo',
          description: 'Ejercicios combinados',
          workoutConfig: {
            numberOfBlocks: 4,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeCombo: true,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 5,
          name: 'Evaluación Final - Parte 1',
          description: 'Demuestra tu progreso',
          workoutConfig: {
            numberOfBlocks: 4,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        }),
        new ProgramDay({
          dayNumber: 6,
          name: 'Evaluación Final - Parte 2',
          description: 'El desafío final',
          workoutConfig: {
            numberOfBlocks: 5,
            exercisesPerBlock: 4,
            ratio: TabataRatio.CLASSIC,
            includeWarmup: true,
            includeCooldown: true
          }
        })
      ]
    })
  ]
});

/**
 * Programa: Quema Grasa Avanzada (6 semanas)
 */
export const fatBurnProgram = new TrainingProgram({
  id: 'program-fatburn',
  name: 'Quema Grasa Avanzada',
  description: 'Programa intensivo de 6 semanas enfocado en maximizar la quema de calorías y grasa corporal.',
  durationWeeks: 6,
  level: 'intermediate',
  weeks: [
    // Simplificado - Estructura similar al beginnerProgram pero con más intensidad
    new ProgramWeek({
      number: 1,
      focus: 'Activación metabólica',
      restDays: [7],
      days: Array.from({ length: 6 }, (_, i) => new ProgramDay({
        dayNumber: i + 1,
        name: `Día ${i + 1}`,
        description: 'Entrenamiento de alta intensidad',
        workoutConfig: {
          numberOfBlocks: 3 + Math.floor(i / 2),
          exercisesPerBlock: 4,
          ratio: TabataRatio.CLASSIC,
          includeWarmup: true,
          includeCooldown: true
        }
      }))
    })
    // ... más semanas
  ]
});

/**
 * Programa: Fuerza y Resistencia (8 semanas)
 */
export const strengthProgram = new TrainingProgram({
  id: 'program-strength',
  name: 'Fuerza y Resistencia',
  description: 'Programa de 8 semanas para desarrollar fuerza muscular y resistencia cardiovascular.',
  durationWeeks: 8,
  level: 'advanced',
  weeks: [
    new ProgramWeek({
      number: 1,
      focus: 'Fundamentos de fuerza',
      restDays: [7],
      days: Array.from({ length: 6 }, (_, i) => new ProgramDay({
        dayNumber: i + 1,
        name: `Día ${i + 1}`,
        description: 'Entrenamiento de fuerza',
        workoutConfig: {
          numberOfBlocks: 4,
          exercisesPerBlock: 4,
          ratio: TabataRatio.CLASSIC,
          includeWarmup: true,
          includeCooldown: true
        }
      }))
    })
    // ... más semanas
  ]
});

/**
 * Catálogo de programas
 */
export const programCatalog = [
  beginnerProgram,
  fatBurnProgram,
  strengthProgram
];
