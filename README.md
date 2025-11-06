# Tabata Training App

Aplicación completa de entrenamientos Tabata con algoritmo inteligente, sistema de progresión, audio y programas multi-semana.

## ✨ Características Principales

### 🏋️ Entrenamiento
- **17 ejercicios completos** (12 tren inferior + 5 combinados)
- **Sistema de frames visuales** para cada ejercicio (3-6 frames por ejercicio)
- **3 niveles de ratio Tabata**: Principiante (30s/30s), Clásico (40s/20s), Avanzado (50s/10s)
- **Timer en tiempo real** con progreso visual
- **Calentamiento y enfriamiento** incluidos
- **Sesión de entrenamiento completa** con control de pausas y saltos

### 🎯 Algoritmo Inteligente
- **Generación equilibrada** de bloques evitando repetición de grupos musculares
- **Balanceo por intensidad** cardio (alterna alta/baja intensidad)
- **Entrenamientos enfocados** en grupos musculares específicos
- **Validación automática** de bloques
- **Machine Learning** para evaluar combinaciones (WorkoutML)

### 📊 Progresión y Estadísticas
- **Sistema de niveles y experiencia** (XP)
- **Seguimiento de rachas** de entrenamientos
- **Logros y achievements** desbloqueables
- **Historial completo** de entrenamientos
- **Análisis de tendencias** de rendimiento
- **Estadísticas semanales y totales**
- **Recomendaciones inteligentes** de dificultad

### 🔊 Audio y Feedback
- **Instrucciones por voz** (expo-speech)
- **Sonidos de fase** (trabajo, descanso, completado)
- **Beep de cuenta regresiva** (3-2-1)
- **Feedback háptico** (vibraciones)
- **Anuncios automáticos** de ejercicios

### 📅 Programas Multi-Semana
- **"Tabata para Principiantes"** - 4 semanas
- **"Quema Grasa Avanzada"** - 6 semanas
- **"Fuerza y Resistencia"** - 8 semanas
- **Progresión automática** entre días y semanas
- **Días de descanso** programados

### 💾 Persistencia de Datos
- **AsyncStorage** para almacenamiento local
- **Exportar/Importar** datos completos
- **Sincronización automática** del progreso
- **Modo offline completo**

### 🤖 IA Generativa
- **Generación de ejercicios** personalizados (OpenAI/Anthropic)
- **Creación de variaciones** de ejercicios existentes
- **Sistema de fallback** si falla la API

## 📱 Pantallas

- **Home** - Dashboard principal con estadísticas
- **WorkoutGenerator** - Generador personalizable de entrenamientos
- **WorkoutSession** - Sesión en vivo con timer y frames
- **WorkoutComplete** - Resumen post-entrenamiento con calificación de esfuerzo
- **ExerciseCatalog** - Catálogo completo con búsqueda y filtros
- **ExerciseDetail** - Detalle completo de cada ejercicio
- **WorkoutHistory** - Historial de entrenamientos completados
- **Progress** - Progreso, niveles, logros y estadísticas
- **Settings** - Configuración de audio, notificaciones y preferencias

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en iOS
npm run ios

# Ejecutar en Android
npm run android

# Ejecutar en web
npm run web
```

## 📁 Estructura del Proyecto

```
/src
  /models
    - Exercise.js          - Modelo de ejercicios y frames
    - Block.js             - Bloques y entrenamientos Tabata
    - UserProgress.js      - Progresión del usuario
    - Program.js           - Programas multi-semana
    - WarmupCooldown.js    - Calentamiento y enfriamiento

  /services
    - WorkoutGenerator.js      - Algoritmo de generación de bloques
    - WorkoutML.js            - Machine Learning para evaluación
    - AIExerciseGenerator.js  - Generación con IA
    - ProgressService.js      - Servicio de progresión
    - StorageService.js       - Persistencia con AsyncStorage
    - AudioService.js         - Audio, voz y haptics

  /components
    - ExerciseCard.js         - Tarjeta de ejercicio
    - ExerciseFrameViewer.js  - Visualizador de frames
    - TabataTimer.js          - Timer Tabata

  /screens
    - HomeScreen.js               - Pantalla principal
    - WorkoutGeneratorScreen.js   - Generador de entrenamientos
    - WorkoutSessionScreen.js     - Sesión en vivo
    - WorkoutCompleteScreen.js    - Resumen post-entrenamiento
    - ExerciseCatalogScreen.js    - Catálogo de ejercicios
    - ExerciseDetailScreen.js     - Detalle de ejercicio
    - WorkoutHistoryScreen.js     - Historial
    - ProgressScreen.js           - Progreso y estadísticas
    - SettingsScreen.js           - Configuración

  /data
    - exerciseCatalog.js      - 17 ejercicios completos
    - trainingPrograms.js     - Programas multi-semana

  /navigation
    - AppNavigator.js         - Navegación principal
```

## 🎯 Funcionalidades Implementadas

### ✅ Todas las 7 Fases Completadas

1. ✅ **Concepto general e inicialización**
2. ✅ **Catálogo de ejercicios** (17 ejercicios completos)
3. ✅ **Representación visual y frames** (componentes completos)
4. ✅ **Algoritmo de organización de bloques** (múltiples estrategias)
5. ✅ **IA generativa para el catálogo** (OpenAI/Anthropic)
6. ✅ **Entrenamiento y aprendizaje automático** (WorkoutML)
7. ✅ **Integración completa en React Native** (navegación + persistencia)

### 🆕 Funcionalidades Adicionales

- ✅ Sistema de audio completo (voz + sonidos + haptics)
- ✅ Calentamiento y enfriamiento
- ✅ Programas multi-semana (3 programas)
- ✅ AsyncStorage para persistencia
- ✅ Sistema de navegación completo
- ✅ Modo offline completo
- ✅ Exportar/Importar datos

## 📊 Estadísticas del Proyecto

- **30+ archivos** de código
- **6,000+ líneas** de código
- **17 ejercicios** con frames completos
- **9 pantallas** principales
- **6 servicios** especializados
- **5 modelos** de datos
- **3 programas** multi-semana
- **100% funcional** offline

## 🎮 Uso

1. **Genera un entrenamiento** desde el generador personalizado
2. **Inicia la sesión** y sigue el timer en tiempo real
3. **Completa el entrenamiento** y califica tu esfuerzo
4. **Revisa tu progreso** y sube de nivel
5. **Explora el catálogo** y aprende nuevos ejercicios
6. **Únete a un programa** multi-semana para progresión estructurada

## 🔧 Tecnologías

- React Native + Expo
- React Navigation
- AsyncStorage
- Expo AV (Audio)
- Expo Speech (Voz)
- Expo Haptics (Vibraciones)
- Expo Notifications
- React Native Chart Kit (gráficas)
- React Native SVG

## 📝 Próximas Mejoras

- [ ] Gráficas con react-native-chart-kit
- [ ] Integración con wearables (Apple Health / Google Fit)
- [ ] Modo cámara con detección de postura (TensorFlow.js + PoseNet)
- [ ] Funcionalidades sociales (compartir, desafíos)
- [ ] Música de fondo integrada
