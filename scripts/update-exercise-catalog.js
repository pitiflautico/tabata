#!/usr/bin/env node
/**
 * Script para actualizar exerciseCatalog.js con las URLs de imágenes
 * desde exercise-images.json
 *
 * Uso:
 *   node scripts/update-exercise-catalog.js
 *
 * Requiere que exista exercise-images.json (generado por fetch-unsplash-images.js)
 */

const fs = require('fs');
const path = require('path');

const IMAGES_FILE = path.join(__dirname, '..', 'exercise-images.json');
const CATALOG_FILE = path.join(__dirname, '..', 'src', 'data', 'exerciseCatalog.js');
const BACKUP_FILE = path.join(__dirname, '..', 'src', 'data', 'exerciseCatalog.backup.js');

// Validar que existe el archivo de imágenes
if (!fs.existsSync(IMAGES_FILE)) {
  console.error('❌ Error: exercise-images.json no encontrado');
  console.error('\nPrimero ejecuta:');
  console.error('  UNSPLASH_ACCESS_KEY=tu_key node scripts/fetch-unsplash-images.js');
  process.exit(1);
}

// Cargar imágenes
console.log('📖 Cargando exercise-images.json...');
const imagesData = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));

// Crear mapa de ID -> URL
const imageMap = {};
let validImages = 0;

imagesData.forEach(item => {
  if (item.imageUrl) {
    imageMap[item.id] = item.imageUrl;
    validImages++;
  }
});

console.log(`✅ ${validImages} imágenes válidas encontradas de ${imagesData.length} ejercicios\n`);

// Leer archivo actual del catálogo
console.log('📖 Leyendo exerciseCatalog.js...');
let catalogContent = fs.readFileSync(CATALOG_FILE, 'utf8');

// Crear backup
console.log('💾 Creando backup...');
fs.writeFileSync(BACKUP_FILE, catalogContent);
console.log(`   Backup guardado en: ${BACKUP_FILE}\n`);

// Actualizar cada ejercicio
console.log('🔄 Actualizando ejercicios con imágenes...\n');

let updatedCount = 0;
let notFoundCount = 0;

for (const [exerciseId, imageUrl] of Object.entries(imageMap)) {
  // Buscar el ejercicio en el código
  const regex = new RegExp(
    `(new Exercise\\({[^}]*id:\\s*['"]${exerciseId}['"][^}]*)(}\\))`,
    's'
  );

  const match = catalogContent.match(regex);

  if (match) {
    const exerciseDef = match[1];

    // Verificar si ya tiene imageUrl
    if (exerciseDef.includes('imageUrl:')) {
      // Reemplazar imageUrl existente
      const updatedDef = exerciseDef.replace(
        /imageUrl:\s*[^,}]*/,
        `imageUrl: '${imageUrl}'`
      );
      catalogContent = catalogContent.replace(exerciseDef, updatedDef);
      console.log(`  ✏️  Actualizado: ${exerciseId}`);
    } else {
      // Agregar imageUrl antes del cierre
      const updatedDef = exerciseDef + `,\n    imageUrl: '${imageUrl}'`;
      catalogContent = catalogContent.replace(exerciseDef, updatedDef);
      console.log(`  ➕ Agregado: ${exerciseId}`);
    }

    updatedCount++;
  } else {
    console.log(`  ⚠️  No encontrado en código: ${exerciseId}`);
    notFoundCount++;
  }
}

// Guardar archivo actualizado
console.log('\n💾 Guardando exerciseCatalog.js actualizado...');
fs.writeFileSync(CATALOG_FILE, catalogContent);

console.log('\n' + '='.repeat(60));
console.log('✨ Actualización completada!');
console.log('='.repeat(60));
console.log(`✅ Ejercicios actualizados: ${updatedCount}`);
if (notFoundCount > 0) {
  console.log(`⚠️  No encontrados: ${notFoundCount}`);
}
console.log(`\n📁 Archivo actualizado: ${CATALOG_FILE}`);
console.log(`📁 Backup disponible: ${BACKUP_FILE}`);
console.log('\nPrueba la app para verificar que las imágenes se muestran correctamente!');
