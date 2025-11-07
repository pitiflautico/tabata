/**
 * Configuraciones de Tabata basadas en investigación científica
 *
 * Referencias:
 * - Tabata et al. (1996) - Protocolo original
 * - Journal of Physiological Sciences (2019)
 * - Applied Physiology, Nutrition, and Metabolism (2025)
 */

/**
 * Configuración de protocolo Tabata
 */
export class TabataConfig {
  constructor({
    id,
    name,
    nameES,
    description,
    workDuration,      // segundos de trabajo
    restDuration,      // segundos de descanso
    intervalsPerBlock, // número de intervalos por bloque (usualmente 8)
    blockRestDuration, // segundos de descanso entre bloques
    targetIntensity,   // % de frecuencia cardíaca máxima o RPE
    level,             // BEGINNER, INTERMEDIATE, ADVANCED
    scientificBasis    // Breve descripción científica
  }) {
    this.id = id;
    this.name = name;
    this.nameES = nameES;
    this.description = description;
    this.workDuration = workDuration;
    this.restDuration = restDuration;
    this.intervalsPerBlock = intervalsPerBlock;
    this.blockRestDuration = blockRestDuration;
    this.targetIntensity = targetIntensity;
    this.level = level;
    this.scientificBasis = scientificBasis;
  }

  // Ratio trabajo:descanso
  getWorkRestRatio() {
    return `${this.workDuration}:${this.restDuration}`;
  }

  // Duración total de un bloque (sin el descanso entre bloques)
  getBlockDuration() {
    return (this.workDuration + this.restDuration) * this.intervalsPerBlock;
  }

  // Duración de un bloque en minutos
  getBlockDurationMinutes() {
    return this.getBlockDuration() / 60;
  }

  // Duración total incluyendo descanso entre bloques
  getTotalDurationWithRest(numberOfBlocks) {
    const blocksDuration = this.getBlockDuration() * numberOfBlocks;
    const restBetweenBlocks = this.blockRestDuration * (numberOfBlocks - 1);
    return blocksDuration + restBetweenBlocks;
  }

  getTotalDurationMinutes(numberOfBlocks) {
    return this.getTotalDurationWithRest(numberOfBlocks) / 60;
  }
}

// ============================================================================
// CONFIGURACIONES PREDEFINIDAS BASADAS EN INVESTIGACIÓN
// ============================================================================

/**
 * Protocolo Original de Tabata (1996)
 * 20s trabajo / 10s descanso / 8 intervalos
 * Intensidad: 170% VO2max (~90-92% FC max)
 */
export const TABATA_CLASSIC = new TabataConfig({
  id: 'tabata-classic',
  name: 'Classic Tabata',
  nameES: 'Tabata Clásico',
  description: 'Original Tabata protocol from 1996 research',
  workDuration: 20,
  restDuration: 10,
  intervalsPerBlock: 8,
  blockRestDuration: 60, // 1 minuto entre bloques
  targetIntensity: '90-92% HR max',
  level: 'ADVANCED',
  scientificBasis: 'Tabata et al. (1996): Demostró mejora del 28% en capacidad anaeróbica y 14% en VO2max en 6 semanas'
});

/**
 * Tabata Modificado para Principiantes
 * 20s trabajo / 20s descanso / 8 intervalos
 * Intensidad: 75-80% FC max
 *
 * Basado en: Research showing 30s:30s work-rest ratios effective
 * Adaptado a 20s:20s para principiantes
 */
export const TABATA_BEGINNER = new TabataConfig({
  id: 'tabata-beginner',
  name: 'Beginner Tabata',
  nameES: 'Tabata Principiante',
  description: 'Modified protocol for beginners with equal work-rest ratio',
  workDuration: 20,
  restDuration: 20,
  intervalsPerBlock: 8,
  blockRestDuration: 90, // 1.5 minutos entre bloques
  targetIntensity: '75-80% HR max',
  level: 'BEGINNER',
  scientificBasis: 'Estudios 2025: Ratios iguales trabajo-descanso (1:1) efectivos para principiantes manteniendo beneficios HIIT'
});

/**
 * Tabata Intermedio
 * 30s trabajo / 15s descanso / 8 intervalos
 * Intensidad: 80-85% FC max
 */
export const TABATA_INTERMEDIATE = new TabataConfig({
  id: 'tabata-intermediate',
  name: 'Intermediate Tabata',
  nameES: 'Tabata Intermedio',
  description: 'Extended work periods for intermediate fitness levels',
  workDuration: 30,
  restDuration: 15,
  intervalsPerBlock: 8,
  blockRestDuration: 75, // 1.25 minutos
  targetIntensity: '80-85% HR max',
  level: 'INTERMEDIATE',
  scientificBasis: 'Mantiene ratio 2:1 con duración extendida, estudiado como efectivo para mejora aeróbica y anaeróbica'
});

/**
 * Tabata Sprint Avanzado
 * 30s trabajo / 30s descanso / 6-8 intervalos
 * Intensidad: 85-90% FC max
 *
 * Basado en protocolos de sprints con descanso activo
 */
export const TABATA_SPRINT = new TabataConfig({
  id: 'tabata-sprint',
  name: 'Sprint Tabata',
  nameES: 'Tabata Sprint',
  description: 'Sprint-based protocol with longer recovery',
  workDuration: 30,
  restDuration: 30,
  intervalsPerBlock: 6,
  blockRestDuration: 120, // 2 minutos entre bloques
  targetIntensity: '85-90% HR max',
  level: 'ADVANCED',
  scientificBasis: 'Sprints máximos 30s con descanso igual estudiados para potencia y velocidad (2019-2025 research)'
});

/**
 * Tabata Resistencia
 * 40s trabajo / 20s descanso / 6 intervalos
 * Intensidad: 75-85% FC max
 */
export const TABATA_ENDURANCE = new TabataConfig({
  id: 'tabata-endurance',
  name: 'Endurance Tabata',
  nameES: 'Tabata Resistencia',
  description: 'Longer work periods focused on muscular endurance',
  workDuration: 40,
  restDuration: 20,
  intervalsPerBlock: 6,
  blockRestDuration: 60,
  targetIntensity: '75-85% HR max',
  level: 'INTERMEDIATE',
  scientificBasis: 'Períodos extendidos 40s mantienen intensidad moderada-alta, efectivos para resistencia muscular'
});

/**
 * Tabata Explosivo
 * 15s trabajo / 15s descanso / 10 intervalos
 * Intensidad: 90-95% esfuerzo máximo
 */
export const TABATA_EXPLOSIVE = new TabataConfig({
  id: 'tabata-explosive',
  name: 'Explosive Tabata',
  nameES: 'Tabata Explosivo',
  description: 'Short bursts for power and explosiveness',
  workDuration: 15,
  restDuration: 15,
  intervalsPerBlock: 10,
  blockRestDuration: 90,
  targetIntensity: '90-95% max effort',
  level: 'ADVANCED',
  scientificBasis: 'Intervalos cortos (<20s) óptimos para desarrollo de potencia anaeróbica aláctica'
});

/**
 * Tabata Metabólico
 * 20s trabajo / 40s descanso / 8 intervalos
 * Intensidad: 85-90% FC max
 * Ratio 1:2 (más descanso que trabajo)
 */
export const TABATA_METABOLIC = new TabataConfig({
  id: 'tabata-metabolic',
  name: 'Metabolic Tabata',
  nameES: 'Tabata Metabólico',
  description: 'High intensity with extended rest for metabolic conditioning',
  workDuration: 20,
  restDuration: 40,
  intervalsPerBlock: 8,
  blockRestDuration: 120,
  targetIntensity: '85-90% HR max',
  level: 'INTERMEDIATE',
  scientificBasis: 'Ratio 1:2 permite recuperación parcial, maximizando calidad de cada intervalo'
});

// Array con todas las configuraciones
export const ALL_TABATA_CONFIGS = [
  TABATA_CLASSIC,
  TABATA_BEGINNER,
  TABATA_INTERMEDIATE,
  TABATA_SPRINT,
  TABATA_ENDURANCE,
  TABATA_EXPLOSIVE,
  TABATA_METABOLIC
];

// Helper para obtener configuración por nivel
export function getConfigsByLevel(level) {
  return ALL_TABATA_CONFIGS.filter(config => config.level === level);
}

// Helper para obtener configuración por ID
export function getConfigById(id) {
  return ALL_TABATA_CONFIGS.find(config => config.id === id);
}

// Recomendaciones basadas en objetivos
export const TABATA_RECOMMENDATIONS = {
  FAT_LOSS: {
    configs: [TABATA_CLASSIC, TABATA_SPRINT, TABATA_EXPLOSIVE],
    description: 'Alta intensidad para máxima quema calórica y EPOC'
  },
  ENDURANCE: {
    configs: [TABATA_ENDURANCE, TABATA_INTERMEDIATE],
    description: 'Períodos de trabajo más largos para resistencia muscular'
  },
  POWER: {
    configs: [TABATA_EXPLOSIVE, TABATA_SPRINT],
    description: 'Intervalos cortos e intensos para potencia explosiva'
  },
  GENERAL_FITNESS: {
    configs: [TABATA_BEGINNER, TABATA_INTERMEDIATE, TABATA_CLASSIC],
    description: 'Progresión equilibrada para fitness general'
  },
  METABOLIC_CONDITIONING: {
    configs: [TABATA_METABOLIC, TABATA_CLASSIC],
    description: 'Mejora de sistemas energéticos aeróbico y anaeróbico'
  }
};

export default {
  TabataConfig,
  TABATA_CLASSIC,
  TABATA_BEGINNER,
  TABATA_INTERMEDIATE,
  TABATA_SPRINT,
  TABATA_ENDURANCE,
  TABATA_EXPLOSIVE,
  TABATA_METABOLIC,
  ALL_TABATA_CONFIGS,
  getConfigsByLevel,
  getConfigById,
  TABATA_RECOMMENDATIONS
};
