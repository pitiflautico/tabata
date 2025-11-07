# Scripts para Imágenes de Ejercicios

Este directorio contiene scripts automatizados para obtener y aplicar imágenes de ejercicios.

## 📋 Scripts Disponibles

### 1. `fetch-unsplash-images.js`
Busca y descarga URLs de imágenes desde Unsplash API.

**Requisitos:**
- Access Key de Unsplash (gratis en https://unsplash.com/developers)
- Node.js instalado

**Uso:**
```bash
UNSPLASH_ACCESS_KEY=tu_access_key node scripts/fetch-unsplash-images.js
```

**Resultado:**
- Genera `exercise-images.json` con URLs de todas las imágenes
- ~10-15 minutos para 82 ejercicios (con rate limiting de 50 requests/hora)

**Características:**
- Traduce automáticamente términos del español al inglés
- Respeta rate limits de Unsplash (50 requests/hora)
- Guarda información del fotógrafo para atribución
- Manejo robusto de errores

### 2. `update-exercise-catalog.js`
Actualiza automáticamente `src/data/exerciseCatalog.js` con las URLs.

**Requisitos:**
- Haber ejecutado `fetch-unsplash-images.js` primero
- Que exista `exercise-images.json`

**Uso:**
```bash
node scripts/update-exercise-catalog.js
```

**Resultado:**
- Actualiza ejercicios con `imageUrl: '...'`
- Crea backup automático en `exerciseCatalog.backup.js`
- Preserva toda la estructura y formato del código

## 🚀 Guía Rápida

### Paso a Paso Completo

1. **Registrarse en Unsplash:**
   ```bash
   # Ir a: https://unsplash.com/developers
   # Crear cuenta gratis
   # Crear nueva aplicación
   # Copiar "Access Key"
   ```

2. **Ejecutar búsqueda de imágenes:**
   ```bash
   UNSPLASH_ACCESS_KEY=abc123xyz node scripts/fetch-unsplash-images.js
   ```

   Verás algo como:
   ```
   🎯 Buscando imágenes para 82 ejercicios...

   [1/82] Buscando: "Salto en Sentadilla" -> "fitness exercise jump squat"
     ✅ Encontrada: https://images.unsplash.com/photo-...
   [2/82] Buscando: "Burpees" -> "fitness exercise burpee"
     ✅ Encontrada: https://images.unsplash.com/photo-...
   ...

   ✨ Proceso completado!
   ✅ Éxito: 78 ejercicios
   ⚠️  Fallo: 4 ejercicios
   ```

3. **Revisar resultados:**
   ```bash
   cat exercise-images.json | head -20
   ```

   Verás:
   ```json
   [
     {
       "id": "squat-jump",
       "name": "Salto en Sentadilla",
       "imageUrl": "https://images.unsplash.com/photo-...",
       "photographer": "John Doe",
       "photographerUrl": "https://unsplash.com/@johndoe"
     },
     ...
   ]
   ```

4. **Aplicar imágenes al catálogo:**
   ```bash
   node scripts/update-exercise-catalog.js
   ```

   Verás:
   ```
   📖 Cargando exercise-images.json...
   ✅ 78 imágenes válidas encontradas de 82 ejercicios

   📖 Leyendo exerciseCatalog.js...
   💾 Creando backup...
   🔄 Actualizando ejercicios con imágenes...

     ➕ Agregado: squat-jump
     ➕ Agregado: burpees
     ...

   ✨ Actualización completada!
   ✅ Ejercicios actualizados: 78
   ```

5. **Verificar en la app:**
   - Reiniciar Metro bundler si está corriendo
   - Abrir ExerciseDetailScreen de cualquier ejercicio
   - La imagen debería aparecer

## 📝 Ejemplo de Código Generado

**Antes:**
```javascript
new Exercise({
  id: 'squat-jump',
  name: 'Salto en Sentadilla',
  muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
  // ...
})
```

**Después:**
```javascript
new Exercise({
  id: 'squat-jump',
  name: 'Salto en Sentadilla',
  muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
  // ...
  imageUrl: 'https://images.unsplash.com/photo-1234567890/...'
})
```

## ⚠️ Limitaciones y Notas

### Rate Limits de Unsplash (Plan Gratuito)
- **50 requests por hora**
- El script incluye delays automáticos
- Si se alcanza el límite, espera 1 hora o usa otra API key

### Calidad de Imágenes
- Algunas búsquedas pueden no encontrar imágenes exactas
- Revisa `exercise-images.json` y ajusta manualmente si es necesario
- Para ejercicios sin imagen, considera:
  - Búsqueda manual en Unsplash
  - Generar con DALL-E (ver `EXERCISE_IMAGES_GUIDE.md`)
  - Usar ilustraciones personalizadas

### Backup
- Siempre se crea `exerciseCatalog.backup.js`
- Puedes revertir con: `cp src/data/exerciseCatalog.backup.js src/data/exerciseCatalog.js`

## 🔄 Actualizar Imágenes Específicas

Si quieres actualizar solo algunos ejercicios:

1. **Edita manualmente `exercise-images.json`:**
   ```json
   [
     {
       "id": "squat-jump",
       "imageUrl": "https://nueva-url.com/imagen.jpg"
     }
   ]
   ```

2. **Ejecuta el script de actualización:**
   ```bash
   node scripts/update-exercise-catalog.js
   ```

## 🆘 Troubleshooting

### "Rate limit exceeded"
- Espera 1 hora
- O crea otra aplicación en Unsplash con otra cuenta

### "No se encontró imagen"
- El término de búsqueda puede no ser óptimo
- Edita `exercise-images.json` manualmente con una URL válida

### "No encontrado en código"
- Verifica que el `id` en `exercise-images.json` coincida con el del catálogo
- Revisa formato del código en `exerciseCatalog.js`

## 💡 Alternativas

Si Unsplash no funciona bien:

### Opción 1: DALL-E (ver `EXERCISE_IMAGES_GUIDE.md`)
```bash
# Script similar pero usando OpenAI
OPENAI_API_KEY=xxx node scripts/generate-dalle-images.js
```

### Opción 2: Manual
1. Buscar imágenes manualmente
2. Editar `exercise-images.json`
3. Ejecutar `update-exercise-catalog.js`

### Opción 3: URLs directas
```javascript
// En exerciseCatalog.js
new Exercise({
  ...
  imageUrl: 'https://mi-servidor.com/images/squat-jump.jpg'
})
```

## 📚 Recursos

- **Unsplash API Docs:** https://unsplash.com/documentation
- **Guía completa de imágenes:** `../EXERCISE_IMAGES_GUIDE.md`
- **Issue Tracker:** Si encuentras problemas, repórtalos en GitHub

---

¿Dudas? Revisa `EXERCISE_IMAGES_GUIDE.md` para opciones alternativas.
