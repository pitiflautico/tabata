import { TabataBlock, Workout, TabataRatio } from '../models/Block';

/**
 * Servicio WorkoutGenerator
 * Genera bloques de entrenamiento Tabata equilibrados
 */

class WorkoutGenerator {
  /**
   * Genera un bloque de entrenamiento equilibrado
   * @param {Array} availableExercises - Ejercicios disponibles
   * @param {number} exercisesPerBlock - Número de ejercicios por bloque (default: 4)
   * @param {Object} ratio - Ratio Tabata (default: CLASSIC)
   * @returns {TabataBlock}
   */
  generateBalancedBlock(
    availableExercises,
    exercisesPerBlock = 4,
    ratio = TabataRatio.CLASSIC,
    blockIndex = 0
  ) {
    if (availableExercises.length < exercisesPerBlock) {
      throw new Error('No hay suficientes ejercicios para crear el bloque');
    }

    const selectedExercises = [];
    const usedMuscleGroups = [];
    const availablePool = [...availableExercises];

    for (let i = 0; i < exercisesPerBlock; i++) {
      let candidate = null;
      let attempts = 0;
      const maxAttempts = 50;

      while (!candidate && attempts < maxAttempts) {
        const randomIndex = Math.floor(Math.random() * availablePool.length);
        const exercise = availablePool[randomIndex];

        // Verificar que no se repitan grupos musculares consecutivos
        if (i === 0) {
          candidate = exercise;
        } else {
          const previousMuscleGroups = selectedExercises[i - 1].muscleGroups;
          const hasOverlap = exercise.muscleGroups.some(mg =>
            previousMuscleGroups.includes(mg)
          );

          if (!hasOverlap) {
            candidate = exercise;
          }
        }

        attempts++;
      }

      if (!candidate) {
        // Si no encuentra candidato sin overlap, toma cualquiera
        const randomIndex = Math.floor(Math.random() * availablePool.length);
        candidate = availablePool[randomIndex];
      }

      selectedExercises.push(candidate);
      candidate.muscleGroups.forEach(mg => {
        if (!usedMuscleGroups.includes(mg)) {
          usedMuscleGroups.push(mg);
        }
      });

      // Remover el ejercicio seleccionado del pool
      const index = availablePool.findIndex(ex => ex.id === candidate.id);
      if (index > -1) {
        availablePool.splice(index, 1);
      }
    }

    return new TabataBlock({
      id: `block-${Date.now()}-${blockIndex}`,
      name: `Bloque ${selectedExercises.length} ejercicios`,
      exercises: selectedExercises,
      ratio: ratio,
      rounds: 1
    });
  }

  /**
   * Genera un bloque equilibrando intensidad cardio
   * Alterna entre ejercicios de alta y baja intensidad
   * @param {Array} availableExercises - Ejercicios disponibles
   * @param {number} exercisesPerBlock - Número de ejercicios por bloque
   * @param {Object} ratio - Ratio Tabata
   * @returns {TabataBlock}
   */
  generateIntensityBalancedBlock(
    availableExercises,
    exercisesPerBlock = 4,
    ratio = TabataRatio.CLASSIC,
    blockIndex = 0
  ) {
    const lowIntensity = availableExercises.filter(ex => ex.cardioIndex <= 2.5);
    const mediumIntensity = availableExercises.filter(ex => ex.cardioIndex > 2.5 && ex.cardioIndex <= 3.5);
    const highIntensity = availableExercises.filter(ex => ex.cardioIndex > 3.5);

    const selectedExercises = [];

    for (let i = 0; i < exercisesPerBlock; i++) {
      let pool;

      // Alternar intensidades: bajo, alto, medio, alto
      if (i % 2 === 0) {
        pool = i === 0 ? mediumIntensity : lowIntensity;
      } else {
        pool = highIntensity;
      }

      if (pool.length === 0) {
        pool = availableExercises; // Fallback si no hay ejercicios en esa categoría
      }

      // Filtrar ejercicios que no repitan grupos musculares
      let filteredPool = pool;
      if (selectedExercises.length > 0) {
        const lastMuscleGroups = selectedExercises[selectedExercises.length - 1].muscleGroups;
        filteredPool = pool.filter(ex => {
          return !ex.muscleGroups.some(mg => lastMuscleGroups.includes(mg));
        });

        if (filteredPool.length === 0) {
          filteredPool = pool; // Si no hay opciones, usar el pool original
        }
      }

      // Seleccionar ejercicio aleatorio del pool filtrado
      const randomIndex = Math.floor(Math.random() * filteredPool.length);
      const selected = filteredPool[randomIndex];
      selectedExercises.push(selected);

      // Remover ejercicio del pool original
      const removeFromPool = (arr, exercise) => {
        const idx = arr.findIndex(ex => ex.id === exercise.id);
        if (idx > -1) arr.splice(idx, 1);
      };

      removeFromPool(lowIntensity, selected);
      removeFromPool(mediumIntensity, selected);
      removeFromPool(highIntensity, selected);
    }

    return new TabataBlock({
      id: `block-${Date.now()}-${blockIndex}`,
      name: `Bloque Intensidad Balanceada`,
      exercises: selectedExercises,
      ratio: ratio,
      rounds: 1
    });
  }

  /**
   * Genera un entrenamiento completo con múltiples bloques
   * @param {Array} availableExercises - Ejercicios disponibles
   * @param {number} numberOfBlocks - Número de bloques (default: 3)
   * @param {number} exercisesPerBlock - Ejercicios por bloque (default: 4)
   * @param {Object} ratio - Ratio Tabata
   * @returns {Workout}
   */
  generateWorkout(
    availableExercises,
    numberOfBlocks = 3,
    exercisesPerBlock = 4,
    ratio = TabataRatio.CLASSIC
  ) {
    const blocks = [];
    const usedExercises = new Set();
    const availablePool = [...availableExercises];

    for (let i = 0; i < numberOfBlocks; i++) {
      // Filtrar ejercicios no usados
      const unusedExercises = availablePool.filter(ex => !usedExercises.has(ex.id));

      if (unusedExercises.length < exercisesPerBlock) {
        // Si no hay suficientes ejercicios no usados, resetear
        usedExercises.clear();
      }

      const block = this.generateIntensityBalancedBlock(
        unusedExercises.length > 0 ? unusedExercises : availablePool,
        exercisesPerBlock,
        ratio,
        i
      );

      // Marcar ejercicios como usados
      block.exercises.forEach(ex => usedExercises.add(ex.id));

      blocks.push(block);
    }

    return new Workout({
      id: `workout-${Date.now()}`,
      name: `Entrenamiento Tabata - ${new Date().toLocaleDateString()}`,
      blocks: blocks,
      date: new Date()
    });
  }

  /**
   * Genera un entrenamiento enfocado en un grupo muscular
   * @param {Array} availableExercises - Ejercicios disponibles
   * @param {string} targetMuscleGroup - Grupo muscular objetivo
   * @param {number} numberOfBlocks - Número de bloques
   * @param {Object} ratio - Ratio Tabata
   * @returns {Workout}
   */
  generateFocusedWorkout(
    availableExercises,
    targetMuscleGroup,
    numberOfBlocks = 3,
    ratio = TabataRatio.CLASSIC
  ) {
    // Filtrar ejercicios que trabajen el grupo muscular objetivo
    const focusedExercises = availableExercises.filter(ex =>
      ex.worksMuscleGroup(targetMuscleGroup)
    );

    // Complementar con ejercicios generales
    const complementaryExercises = availableExercises.filter(ex =>
      !ex.worksMuscleGroup(targetMuscleGroup)
    );

    const blocks = [];

    for (let i = 0; i < numberOfBlocks; i++) {
      const blockExercises = [];

      // 50% ejercicios enfocados, 50% complementarios
      const focusedCount = 2;
      const complementaryCount = 2;

      // Seleccionar ejercicios enfocados
      for (let j = 0; j < focusedCount && focusedExercises.length > 0; j++) {
        const randomIndex = Math.floor(Math.random() * focusedExercises.length);
        blockExercises.push(focusedExercises[randomIndex]);
      }

      // Seleccionar ejercicios complementarios
      for (let j = 0; j < complementaryCount && complementaryExercises.length > 0; j++) {
        const randomIndex = Math.floor(Math.random() * complementaryExercises.length);
        blockExercises.push(complementaryExercises[randomIndex]);
      }

      // Mezclar el orden
      blockExercises.sort(() => Math.random() - 0.5);

      blocks.push(new TabataBlock({
        id: `block-${Date.now()}-${i}`,
        name: `Bloque ${i + 1} - Enfoque ${targetMuscleGroup}`,
        exercises: blockExercises,
        ratio: ratio,
        rounds: 1
      }));
    }

    return new Workout({
      id: `workout-${Date.now()}`,
      name: `Entrenamiento Enfocado - ${targetMuscleGroup}`,
      blocks: blocks,
      date: new Date()
    });
  }

  /**
   * Valida que un bloque sea equilibrado
   * @param {TabataBlock} block - Bloque a validar
   * @returns {Object} - { isValid, issues }
   */
  validateBlock(block) {
    const issues = [];

    // Verificar que no haya repetición de grupos musculares consecutivos
    if (!block.isBalanced()) {
      issues.push('El bloque tiene grupos musculares repetidos consecutivamente');
    }

    // Verificar que no sea demasiado intenso
    const avgCardio = block.getAverageCardioIndex();
    if (avgCardio > 4) {
      issues.push('El bloque puede ser demasiado intenso (promedio cardio > 4)');
    }

    // Verificar que tenga suficiente variedad
    const uniqueMuscleGroups = new Set();
    block.exercises.forEach(ex => {
      ex.muscleGroups.forEach(mg => uniqueMuscleGroups.add(mg));
    });

    if (uniqueMuscleGroups.size < 2) {
      issues.push('El bloque carece de variedad muscular');
    }

    return {
      isValid: issues.length === 0,
      issues: issues,
      averageCardioIndex: avgCardio,
      uniqueMuscleGroups: uniqueMuscleGroups.size
    };
  }
}

export default new WorkoutGenerator();
