import { Exercise, ExerciseFrame, MuscleGroup, ExerciseType } from '../models/Exercise';

/**
 * Servicio AIExerciseGenerator
 * Genera ejercicios usando IA (OpenAI, Anthropic, etc.)
 */

class AIExerciseGenerator {
  constructor(apiKey = null, provider = 'openai') {
    this.apiKey = apiKey;
    this.provider = provider;
    this.apiEndpoint = this.getApiEndpoint(provider);
  }

  getApiEndpoint(provider) {
    const endpoints = {
      'openai': 'https://api.openai.com/v1/chat/completions',
      'anthropic': 'https://api.anthropic.com/v1/messages',
    };
    return endpoints[provider] || endpoints['openai'];
  }

  /**
   * Genera un nuevo ejercicio usando IA
   * @param {Object} params - Parámetros del ejercicio a generar
   * @returns {Promise<Exercise>}
   */
  async generateExercise({
    muscleGroup,
    equipmentAvailable = [],
    difficultyLevel = 'medium',
    isCombo = false
  }) {
    const prompt = this.buildPrompt(muscleGroup, equipmentAvailable, difficultyLevel, isCombo);

    try {
      const response = await this.callAI(prompt);
      const exerciseData = this.parseAIResponse(response);
      return this.createExerciseFromData(exerciseData);
    } catch (error) {
      console.error('Error generando ejercicio con IA:', error);
      return this.generateFallbackExercise(muscleGroup);
    }
  }

  /**
   * Construye el prompt para la IA
   */
  buildPrompt(muscleGroup, equipment, difficulty, isCombo) {
    return `
Genera un ejercicio de entrenamiento Tabata con las siguientes características:
- Grupo muscular: ${muscleGroup}
- Equipamiento disponible: ${equipment.length > 0 ? equipment.join(', ') : 'peso corporal'}
- Nivel de dificultad: ${difficulty}
- Es ejercicio combinado (tren superior + inferior): ${isCombo ? 'Sí' : 'No'}

Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "name": "Nombre del ejercicio",
  "description": "Descripción detallada de cómo realizar el ejercicio",
  "muscleGroups": ["grupo1", "grupo2"],
  "type": "peso corporal | kettlebell | mancuernas | banco | combinado",
  "cardioIndex": 1-5,
  "intensityLevel": 1-5,
  "equipment": ["equipamiento necesario"],
  "variations": ["variación 1", "variación 2"],
  "frames": [
    {
      "title": "Nombre de la etapa",
      "description": "Descripción de la etapa",
      "duration": 1-3
    }
  ]
}

Asegúrate de que:
1. El ejercicio sea seguro y efectivo
2. Las instrucciones sean claras y precisas
3. Los frames describan todas las etapas del movimiento
4. El cardioIndex refleje la intensidad cardiovascular (1=baja, 5=alta)
`;
  }

  /**
   * Llama a la API de IA
   * @param {string} prompt - Prompt para la IA
   * @returns {Promise<string>}
   */
  async callAI(prompt) {
    if (!this.apiKey) {
      throw new Error('API Key no configurada');
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    let body;

    if (this.provider === 'openai') {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      body = JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Eres un experto en entrenamiento físico y ejercicios Tabata.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      });
    } else if (this.provider === 'anthropic') {
      headers['x-api-key'] = this.apiKey;
      headers['anthropic-version'] = '2023-06-01';
      body = JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      });
    }

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      throw new Error(`Error en API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (this.provider === 'openai') {
      return data.choices[0].message.content;
    } else if (this.provider === 'anthropic') {
      return data.content[0].text;
    }

    throw new Error('Proveedor de IA no soportado');
  }

  /**
   * Parsea la respuesta de la IA
   * @param {string} response - Respuesta de la IA
   * @returns {Object}
   */
  parseAIResponse(response) {
    try {
      // Intentar extraer JSON de la respuesta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parseando respuesta de IA:', error);
      throw error;
    }
  }

  /**
   * Crea un objeto Exercise a partir de los datos de la IA
   * @param {Object} data - Datos del ejercicio
   * @returns {Exercise}
   */
  createExerciseFromData(data) {
    const frames = data.frames.map((frame, index) => {
      return new ExerciseFrame({
        id: `ai-frame-${Date.now()}-${index}`,
        exerciseId: `ai-exercise-${Date.now()}`,
        order: index + 1,
        title: frame.title,
        description: frame.description,
        duration: frame.duration || 2
      });
    });

    return new Exercise({
      id: `ai-exercise-${Date.now()}`,
      name: data.name,
      description: data.description,
      muscleGroups: data.muscleGroups,
      type: data.type,
      cardioIndex: data.cardioIndex,
      intensityLevel: data.intensityLevel,
      equipment: data.equipment || [],
      variations: data.variations || [],
      frames: frames,
      isCombo: data.type === 'combinado' || data.type === ExerciseType.COMBINED
    });
  }

  /**
   * Genera un ejercicio de respaldo si falla la IA
   */
  generateFallbackExercise(muscleGroup) {
    return new Exercise({
      id: `fallback-${Date.now()}`,
      name: `Ejercicio de ${muscleGroup}`,
      description: 'Ejercicio básico generado automáticamente',
      muscleGroups: [muscleGroup],
      type: ExerciseType.BODYWEIGHT,
      cardioIndex: 3,
      intensityLevel: 3,
      equipment: [],
      variations: [],
      frames: [
        new ExerciseFrame({
          id: `fallback-frame-1`,
          exerciseId: `fallback-${Date.now()}`,
          order: 1,
          title: 'Posición inicial',
          description: 'Prepárate para el ejercicio',
          duration: 1
        }),
        new ExerciseFrame({
          id: `fallback-frame-2`,
          exerciseId: `fallback-${Date.now()}`,
          order: 2,
          title: 'Ejecución',
          description: 'Realiza el movimiento',
          duration: 2
        }),
        new ExerciseFrame({
          id: `fallback-frame-3`,
          exerciseId: `fallback-${Date.now()}`,
          order: 3,
          title: 'Retorno',
          description: 'Vuelve a la posición inicial',
          duration: 1
        })
      ]
    });
  }

  /**
   * Genera múltiples ejercicios en lote
   * @param {Array} exerciseSpecs - Array de especificaciones de ejercicios
   * @returns {Promise<Array<Exercise>>}
   */
  async generateMultipleExercises(exerciseSpecs) {
    const promises = exerciseSpecs.map(spec => this.generateExercise(spec));
    return Promise.all(promises);
  }

  /**
   * Genera variaciones de un ejercicio existente
   * @param {Exercise} baseExercise - Ejercicio base
   * @param {number} numberOfVariations - Número de variaciones a generar
   * @returns {Promise<Array<Exercise>>}
   */
  async generateVariations(baseExercise, numberOfVariations = 3) {
    const prompt = `
Genera ${numberOfVariations} variaciones del siguiente ejercicio:

Ejercicio base:
- Nombre: ${baseExercise.name}
- Descripción: ${baseExercise.description}
- Grupos musculares: ${baseExercise.muscleGroups.join(', ')}

Las variaciones deben:
1. Trabajar los mismos grupos musculares
2. Tener diferentes niveles de dificultad
3. Poder usar diferente equipamiento

Devuelve las variaciones en formato JSON array con la misma estructura que antes.
`;

    try {
      const response = await this.callAI(prompt);
      const variationsData = this.parseAIResponse(response);

      if (Array.isArray(variationsData)) {
        return variationsData.map(data => this.createExerciseFromData(data));
      } else {
        return [this.createExerciseFromData(variationsData)];
      }
    } catch (error) {
      console.error('Error generando variaciones:', error);
      return [];
    }
  }

  /**
   * Configura la API key
   * @param {string} apiKey - API key del proveedor
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Configura el proveedor de IA
   * @param {string} provider - 'openai' o 'anthropic'
   */
  setProvider(provider) {
    this.provider = provider;
    this.apiEndpoint = this.getApiEndpoint(provider);
  }
}

export default new AIExerciseGenerator();
