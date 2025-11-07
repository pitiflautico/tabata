# Guía: Cómo Agregar Imágenes a los Ejercicios

## 📌 Resumen

La app ya está preparada para mostrar imágenes de ejercicios. El modelo `Exercise` tiene un campo `imageUrl` que puedes usar para agregar imágenes. Esta guía explica las diferentes opciones para agregar imágenes a tus 82 ejercicios.

## 🖼️ Opciones para Obtener/Generar Imágenes

### Opción 1: Imágenes Locales (Recomendado para Producción)

**Ventajas:** Rápido, funciona offline, no requiere conexión a internet
**Desventajas:** Requiere almacenar archivos en el proyecto

#### Pasos:

1. **Crear carpeta de imágenes:**
   ```
   mkdir -p src/assets/exercises
   ```

2. **Agregar imágenes al proyecto:**
   - Coloca archivos JPG/PNG en `src/assets/exercises/`
   - Nomenclatura sugerida: `exercise-{id}.jpg` (ej: `exercise-squat-jump.jpg`)

3. **Actualizar los ejercicios en `exerciseCatalog.js`:**
   ```javascript
   import squatJumpImg from '../assets/exercises/exercise-squat-jump.jpg';

   const ejercicio = new Exercise({
     id: 'squat-jump',
     name: 'Salto en Sentadilla',
     // ... otros campos
     imageUrl: squatJumpImg,  // Referencia local
   });
   ```

### Opción 2: URLs Externas (Rápido para Prototipos)

**Ventajas:** No requiere almacenar archivos localmente
**Desventajas:** Requiere conexión a internet, puede ser lento

#### Servicios gratuitos de imágenes de fitness:

1. **Unsplash API** (https://unsplash.com/developers)
   - Búsqueda: fitness, workout, exercise
   - Gratis hasta 50 requests/hora

2. **Pexels API** (https://www.pexels.com/api/)
   - Similar a Unsplash
   - Gratis sin límite de requests

3. **Ejemplo de uso:**
   ```javascript
   const ejercicio = new Exercise({
     id: 'squat-jump',
     name: 'Salto en Sentadilla',
     // ... otros campos
     imageUrl: 'https://images.unsplash.com/photo-xxx',
   });
   ```

### Opción 3: Generar Imágenes con AI

**Servicios para generar imágenes de ejercicios:**

#### A) DALL-E (OpenAI)
```bash
# Instalar: npm install openai

# Script para generar imágenes:
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: 'tu-api-key' });

async function generateExerciseImage(exerciseName, description) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Professional fitness illustration of ${exerciseName}: ${description}. Clean, instructional style, white background, person performing exercise.`,
    size: "1024x1024",
    quality: "standard",
    n: 1,
  });

  return response.data[0].url;
}

// Uso:
const imageUrl = await generateExerciseImage(
  'Salto en Sentadilla',
  'Persona realizando un salto explosivo desde posición de sentadilla'
);
```

#### B) Stable Diffusion (Gratuito)
- Usa https://huggingface.co/spaces/stabilityai/stable-diffusion
- Prompt ejemplo: "fitness exercise illustration, person doing squat jump, instructional diagram, clean background"

#### C) Midjourney (De pago)
- Mejor calidad
- Prompt: `/imagine fitness instruction diagram, squat jump exercise, professional illustration`

### Opción 4: Ilustraciones SVG con react-native-svg

**Ventajas:** Escalables, ligeras, personalizables
**Desventajas:** Requiere diseño manual o conversión

#### Ejemplo de componente SVG:

```javascript
import Svg, { Circle, Line, Path } from 'react-native-svg';

const SquatJumpIllustration = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    {/* Dibujar stick figure realizando squat jump */}
    <Circle cx="100" cy="40" r="20" fill="#BDFF00" />
    <Line x1="100" y1="60" x2="100" y2="120" stroke="#BDFF00" strokeWidth="4" />
    {/* ... más elementos */}
  </Svg>
);
```

### Opción 5: Avatares 3D (Avanzado)

**Usando React Native Skia para animaciones 3D:**

```bash
npm install @shopify/react-native-skia
```

Permite crear representaciones 3D animadas de ejercicios (similar a apps como Nike Training Club).

## 🔧 Implementación Práctica

### Script Automatizado para Agregar Imágenes

Crea un script `scripts/add-exercise-images.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Lista de ejercicios (importar desde exerciseCatalog.js)
const exercises = [
  { id: 'squat-jump', name: 'Salto en Sentadilla' },
  { id: 'burpees', name: 'Burpees' },
  // ... todos los ejercicios
];

// Opción 1: Generar con DALL-E
async function generateImagesWithAI() {
  for (const exercise of exercises) {
    const imageUrl = await generateExerciseImage(exercise.name, exercise.description);

    // Descargar imagen
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // Guardar localmente
    fs.writeFileSync(
      `src/assets/exercises/${exercise.id}.jpg`,
      buffer
    );

    console.log(`✓ Generated image for ${exercise.name}`);
  }
}

// Opción 2: Buscar en Unsplash
async function findImagesFromUnsplash() {
  const ACCESS_KEY = 'tu-unsplash-access-key';

  for (const exercise of exercises) {
    const searchQuery = `fitness ${exercise.name}`;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${ACCESS_KEY}` }
    });

    const data = await response.json();
    if (data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      console.log(`${exercise.id}: ${imageUrl}`);
    }
  }
}
```

### Actualizar Ejercicios en Masa

```javascript
// En exerciseCatalog.js, crear un helper:

const exerciseImages = {
  'squat-jump': require('../assets/exercises/squat-jump.jpg'),
  'burpees': require('../assets/exercises/burpees.jpg'),
  // ... todos los ejercicios
};

// Luego al crear ejercicios:
const ejercicios = rawExerciseData.map(data => new Exercise({
  ...data,
  imageUrl: exerciseImages[data.id] || null
}));
```

## 🎨 Recomendaciones de Diseño

### Para imágenes de ejercicios:
- **Fondo:** Preferiblemente blanco o transparente
- **Estilo:** Ilustración limpia o foto profesional
- **Ángulo:** Vista lateral o 3/4 que muestre el movimiento
- **Resolución:** Mínimo 800x800px
- **Formato:** JPG para fotos, PNG para ilustraciones con transparencia

### Prompt para AI (DALL-E/Midjourney):
```
"Professional fitness instruction illustration, [EXERCISE_NAME],
clean white background, person in athletic wear performing exercise,
instructional diagram style, side view, detailed form,
digital art, high quality"
```

## 💰 Comparación de Costos

| Método | Costo | Tiempo | Calidad |
|--------|-------|--------|---------|
| Imágenes de stock gratis | $0 | Rápido | Media |
| Unsplash/Pexels API | $0 | Rápido | Alta |
| DALL-E (OpenAI) | ~$0.04/imagen | Medio | Alta |
| Midjourney | $10/mes | Medio | Muy Alta |
| Ilustrador profesional | $5-20/imagen | Lento | Muy Alta |
| DIY con SVG | $0 | Muy Lento | Variable |

## 🚀 Opción Recomendada (Más Rápida)

### Usar Unsplash API para obtener imágenes de calidad gratis:

1. **Registrarse en Unsplash Developers** (https://unsplash.com/developers)
2. **Obtener Access Key**
3. **Ejecutar script:**

```javascript
// scripts/fetch-unsplash-images.js
const fetch = require('node-fetch');
const fs = require('fs');

const UNSPLASH_ACCESS_KEY = 'TU_ACCESS_KEY';
const exercises = require('../src/data/exerciseCatalog').exerciseCatalog;

async function fetchImages() {
  const results = [];

  for (const exercise of exercises) {
    // Buscar imagen
    const searchQuery = `fitness exercise ${exercise.name}`;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      results.push({
        id: exercise.id,
        name: exercise.name,
        imageUrl: imageUrl
      });

      console.log(`✓ Found image for ${exercise.name}`);
    } else {
      console.log(`✗ No image found for ${exercise.name}`);
    }

    // Rate limiting: esperar 100ms entre requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Guardar resultados en JSON
  fs.writeFileSync(
    'exercise-images.json',
    JSON.stringify(results, null, 2)
  );

  console.log(`\n✓ Completed! Found ${results.length} images`);
}

fetchImages();
```

4. **Ejecutar:** `node scripts/fetch-unsplash-images.js`
5. **Actualizar exerciseCatalog.js** con las URLs generadas

## 📝 Estado Actual

✅ **Completado:**
- Modelo `Exercise` tiene campo `imageUrl`
- Modelo `ExerciseFrame` tiene campo `imageUrl` para imágenes paso a paso
- `ExerciseDetailScreen` muestra imagen si está disponible
- Placeholder cuando no hay imagen

⏳ **Pendiente:**
- Agregar imágenes a los 82 ejercicios del catálogo
- (Opcional) Agregar imágenes a cada frame de los ejercicios

## 🎯 Próximos Pasos Sugeridos

1. **Opción rápida (30 minutos):**
   - Usar script de Unsplash para obtener URLs
   - Actualizar `exerciseCatalog.js` con las URLs

2. **Opción de calidad (2-3 horas):**
   - Generar imágenes con DALL-E para todos los ejercicios
   - Descargar y guardar localmente
   - Actualizar referencias en el código

3. **Opción profesional (varios días):**
   - Contratar ilustrador para crear set completo
   - Ilustraciones consistentes y de marca
   - Incluir variaciones y frames animados

---

**¿Necesitas ayuda implementando alguna de estas opciones?** Puedo ayudarte con:
- Scripts de automatización
- Integración con APIs
- Configuración de assets locales
- Optimización de imágenes
