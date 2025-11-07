#!/usr/bin/env node
/**
 * Script para obtener imágenes de ejercicios desde Unsplash API
 *
 * Uso:
 * 1. Registrarse en https://unsplash.com/developers
 * 2. Crear una aplicación y obtener Access Key
 * 3. Ejecutar: UNSPLASH_ACCESS_KEY=tu_access_key node scripts/fetch-unsplash-images.js
 *
 * Esto generará un archivo exercise-images.json con las URLs de las imágenes
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuración
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const OUTPUT_FILE = path.join(__dirname, '..', 'exercise-images.json');
const RATE_LIMIT_DELAY = 150; // ms entre requests (para respetar límite de 50/hora)

// Validar Access Key
if (!UNSPLASH_ACCESS_KEY) {
  console.error('❌ Error: UNSPLASH_ACCESS_KEY no está configurado');
  console.error('\nUso:');
  console.error('  UNSPLASH_ACCESS_KEY=tu_access_key node scripts/fetch-unsplash-images.js');
  console.error('\nObtén tu Access Key en: https://unsplash.com/developers');
  process.exit(1);
}

// Importar ejercicios
let exerciseCatalog;
try {
  exerciseCatalog = require('../src/data/exerciseCatalog').exerciseCatalog;
} catch (error) {
  console.error('❌ Error cargando ejercicios:', error.message);
  process.exit(1);
}

/**
 * Realiza una búsqueda en Unsplash
 */
function searchUnsplash(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=1&orientation=landscape`;

    const options = {
      hostname: 'api.unsplash.com',
      path: `/search/photos?query=${encodedQuery}&per_page=1&orientation=landscape`,
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(new Error(`Error parsing JSON: ${error.message}`));
          }
        } else if (res.statusCode === 403) {
          reject(new Error('Rate limit exceeded. Espera una hora o usa otra API key.'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Genera query de búsqueda optimizado para fitness
 */
function generateSearchQuery(exercise) {
  // Mapeo de nombres en español a términos en inglés para mejor búsqueda
  const translations = {
    'salto': 'jump',
    'sentadilla': 'squat',
    'burpee': 'burpee',
    'plancha': 'plank',
    'flexion': 'push up',
    'flexión': 'push up',
    'dominada': 'pull up',
    'peso muerto': 'deadlift',
    'estocada': 'lunge',
    'zancada': 'lunge',
    'escalador': 'mountain climber',
    'abdominales': 'crunches',
    'kettlebell': 'kettlebell',
    'mancuerna': 'dumbbell',
    'press': 'press',
    'remo': 'row',
    'elevación': 'raise',
    'curl': 'curl',
    'tríceps': 'triceps',
    'bíceps': 'biceps',
  };

  let searchTerm = exercise.name.toLowerCase();

  // Traducir términos comunes
  for (const [spanish, english] of Object.entries(translations)) {
    if (searchTerm.includes(spanish)) {
      searchTerm = searchTerm.replace(spanish, english);
    }
  }

  // Agregar contexto de fitness
  return `fitness exercise ${searchTerm}`;
}

/**
 * Pausa la ejecución
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Procesa todos los ejercicios
 */
async function fetchAllImages() {
  console.log('🎯 Buscando imágenes para', exerciseCatalog.length, 'ejercicios...\n');

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < exerciseCatalog.length; i++) {
    const exercise = exerciseCatalog[i];
    const progress = `[${i + 1}/${exerciseCatalog.length}]`;

    try {
      const query = generateSearchQuery(exercise);
      console.log(`${progress} Buscando: "${exercise.name}" -> "${query}"`);

      const data = await searchUnsplash(query);

      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        const imageUrl = photo.urls.regular;

        results.push({
          id: exercise.id,
          name: exercise.name,
          imageUrl: imageUrl,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
          unsplashUrl: photo.links.html
        });

        console.log(`  ✅ Encontrada: ${imageUrl.substring(0, 60)}...`);
        successCount++;
      } else {
        console.log(`  ⚠️  No se encontró imagen`);
        results.push({
          id: exercise.id,
          name: exercise.name,
          imageUrl: null,
          error: 'No results'
        });
        failCount++;
      }

      // Rate limiting
      if (i < exerciseCatalog.length - 1) {
        await sleep(RATE_LIMIT_DELAY);
      }

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        id: exercise.id,
        name: exercise.name,
        imageUrl: null,
        error: error.message
      });
      failCount++;

      // Si es rate limit, esperar más tiempo
      if (error.message.includes('Rate limit')) {
        console.log('\n⏸️  Rate limit alcanzado. Esperando 60 segundos...\n');
        await sleep(60000);
      }
    }
  }

  // Guardar resultados
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('✨ Proceso completado!');
  console.log('='.repeat(60));
  console.log(`✅ Éxito: ${successCount} ejercicios`);
  console.log(`⚠️  Fallo: ${failCount} ejercicios`);
  console.log(`📄 Resultados guardados en: ${OUTPUT_FILE}`);
  console.log('\nPróximos pasos:');
  console.log('1. Revisa exercise-images.json');
  console.log('2. Actualiza src/data/exerciseCatalog.js con las URLs');
  console.log('3. O ejecuta: node scripts/update-exercise-catalog.js (si existe)');
}

// Ejecutar
fetchAllImages().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});
