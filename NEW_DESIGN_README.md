# Tabata Timer App - Rediseño Completo

## 🎨 Nuevo Sistema de Diseño

Este proyecto ha sido completamente rediseñado con un sistema de diseño moderno, inspirado en apps de fitness de alta calidad. El diseño se centra en la legibilidad, accesibilidad y una experiencia de usuario premium.

### Paleta de Colores

- **Primary**: `#BDFF00` (Verde neón) - Color principal para acciones y elementos destacados
- **Secondary**: `#0080FF` (Azul eléctrico) - Color secundario para información
- **Accent**:
  - `#00FFB8` (Verde agua)
  - `#FF006B` (Rosa/magenta)
  - `#FFB800` (Naranja/amarillo)
  - `#8B5CF6` (Púrpura)

- **Fondos**:
  - Background: `#0A0A0A` (Negro profundo)
  - Background Elevated: `#151515`
  - Background Card: `#1C1C1E`
  - Background Card Light: `#2C2C2E`

### Estados del Workout
- **Work**: Verde neón (#BDFF00)
- **Rest**: Azul (#0080FF)
- **Prepare**: Naranja/Amarillo (#FFB800)

## 📱 Estructura de la App

### Componentes Creados

#### Components Base
1. **Card** - Tarjeta base reutilizable con sombras y bordes redondeados
2. **MetricCard** - Tarjeta para mostrar métricas con iconos y tendencias
3. **Button** - Sistema completo de botones (primary, secondary, outline, ghost, dark)
4. **CircularButton** - Botones circulares para acciones rápidas
5. **BarChart** - Gráfico de barras personalizado
6. **CircularProgress** - Indicador de progreso circular con SVG
7. **TimerDisplay** - Display de tiempo formateado
8. **StateSection** - Sección para mostrar estados del workout (WORK, REST, PREPARE)
9. **Counter** - Contador visual con etiqueta
10. **ConfigItem** - Item de configuración con indicador de color
11. **AppHeader** - Header reutilizable con botones
12. **TabBar** - Barra de navegación inferior personalizada

### Pantallas Principales

#### 1. NewHomeScreen
**Ubicación**: `src/screens/NewHomeScreen.js`

Pantalla principal con:
- Métricas del día actual (workouts, calorías, tiempo, racha)
- Botón destacado para iniciar workout
- Gráfico de actividad semanal
- Estadísticas rápidas
- Navegación a otras secciones

**Datos conectados**: Stats del día actual desde Context, datos históricos para gráficos

#### 2. TimerScreen
**Ubicación**: `src/screens/TimerScreen.js`

Timer Tabata completo con:
- Progreso circular visual
- Fases: PREPARE → WORK → REST → CYCLE_REST → COMPLETE
- Control de reprodución (play/pause/stop)
- Visualización de rounds y cycles restantes
- Vibración al cambiar de fase
- Guardado automático de workout completado
- Cálculo de calorías quemadas

**Datos conectados**: Lee config del Context, guarda workout al completar

#### 3. StatsScreen
**Ubicación**: `src/screens/StatsScreen.js`

Estadísticas completas con:
- Progreso de meta semanal (circular progress)
- Selector de período (semana/mes/año)
- Gráfico de calorías por día/semana
- Métricas totales (workouts, calorías, tiempo)
- Logros y rachas
- Consistencia

**Datos conectados**: Lee todas las stats y workouts del Context

#### 4. NewSettingsScreen
**Ubicación**: `src/screens/NewSettingsScreen.js`

Configuración del timer con:
- Visualización de tiempo total del workout
- Configuración de intervalos (prepare, work, rest)
- Configuración de estructura (rounds, cycles, rest entre cycles)
- Indicadores de color para cada configuración
- Modal para editar valores con +/-
- Presets predefinidos (Classic, Advanced, Beginner)
- Guardado automático en Context

**Datos conectados**: Lee y actualiza config en Context

## 🔄 Sistema de Estado (Context API)

### AppContext
**Ubicación**: `src/context/AppContext.js`

Maneja el estado global de la app:

#### Estado
- `config`: Configuración del timer Tabata
- `workoutHistory`: Historial de workouts completados
- `stats`: Estadísticas globales (total workouts, calorías, tiempo, rachas)
- `goals`: Metas del usuario (workouts semanales, calorías diarias)

#### Funciones Disponibles
- `updateConfig(newConfig)`: Actualiza la configuración del timer
- `addWorkout(workout)`: Añade un workout al historial
- `getWorkoutsForPeriod(period)`: Obtiene workouts filtrados por período
- `getTodayWorkouts()`: Obtiene workouts del día actual
- `getWeeklyStats()`: Calcula estadísticas de la semana
- `resetAllData()`: Reinicia todos los datos (para testing)

#### Persistencia
Todos los datos se guardan automáticamente en AsyncStorage y se cargan al iniciar la app.

## 🚀 Navegación

### MainNavigator
**Ubicación**: `src/navigation/MainNavigator.js`

Navegación por tabs:
1. **Home** (HomeStack con subnav igación)
   - HomeMain
   - Timer
   - Stats
   - Settings
2. **TimerTab** - Acceso directo al timer
3. **StatsTab** - Acceso directo a estadísticas
4. **SettingsTab** - Acceso directo a configuración

### NewApp.js
**Ubicación**: `NewApp.js`

App principal que envuelve todo en:
- SafeAreaProvider
- AppProvider (Context)
- NavigationContainer

## 🎯 Características Implementadas

### Timer Tabata Completo
- ✅ Fases: Prepare, Work, Rest, Rest entre cycles
- ✅ Progreso visual circular
- ✅ Control completo (play, pause, stop, restart)
- ✅ Vibración al cambiar fase
- ✅ Contador de rounds y cycles
- ✅ Guardado automático al completar

### Estadísticas y Métricas
- ✅ Dashboard con métricas del día
- ✅ Gráficos de actividad semanal/mensual
- ✅ Seguimiento de rachas
- ✅ Metas semanales con progreso visual
- ✅ Historial de workouts

### Configuración
- ✅ Configuración completa de intervalos
- ✅ Presets predefinidos
- ✅ Visualización de tiempo total
- ✅ Guardado automático
- ✅ Indicadores visuales de cada parámetro

### Experiencia de Usuario
- ✅ Diseño dark mode moderno
- ✅ Animaciones fluidas
- ✅ Feedback visual en todas las acciones
- ✅ Persistencia de datos
- ✅ Navegación intuitiva

## 📦 Archivos Clave Creados

### Theme
- `src/theme/AppTheme.js` - Sistema de diseño completo

### Components
- `src/components/Card.js`
- `src/components/MetricCard.js`
- `src/components/Button.js`
- `src/components/CircularButton.js`
- `src/components/BarChart.js`
- `src/components/CircularProgress.js`
- `src/components/TimerDisplay.js`
- `src/components/StateSection.js`
- `src/components/Counter.js`
- `src/components/ConfigItem.js`
- `src/components/AppHeader.js`
- `src/components/TabBar.js`

### Screens
- `src/screens/NewHomeScreen.js`
- `src/screens/TimerScreen.js`
- `src/screens/StatsScreen.js`
- `src/screens/NewSettingsScreen.js`

### Context & Navigation
- `src/context/AppContext.js`
- `src/navigation/MainNavigator.js`
- `NewApp.js`

## 🔧 Uso

### Ejecutar la app con el nuevo diseño

1. Reemplazar App.js actual con NewApp.js:
```bash
cp NewApp.js App.js
```

2. Ejecutar la app:
```bash
npm start
```

### Flujo de Usuario

1. **Home** → Ver métricas del día y acceder a las funciones principales
2. **Start Workout** → Inicia un workout con la configuración actual
3. **Timer** → Completa el workout siguiendo las fases
4. **Complete** → Workout se guarda automáticamente con calorías calculadas
5. **Stats** → Ver progreso, gráficos y logros
6. **Settings** → Ajustar configuración del timer o usar presets

## 🎨 UX/UI Destacado

- **Legibilidad Premium**: Números gigantes, contraste alto, jerarquía clara
- **Feedback Visual**: Colores cambian según fase del workout
- **Progreso Claro**: Circular progress, contadores, barra de progreso
- **Acciones Rápidas**: Botones circulares, navegación por tabs
- **Dark Mode**: Diseño oscuro premium que reduce fatiga visual
- **Datos Reales**: Toda la información conectada al Context, sin mock data

## 📊 Métricas Calculadas

- **Calorías**: ~8.5 cal/min durante HIIT (cálculo aproximado)
- **Tiempo Total**: Suma de todas las fases (prepare + work*rounds*cycles + rest*(rounds-1)*cycles + rest_between_cycles*(cycles-1))
- **Racha**: Días consecutivos con al menos 1 workout
- **Promedio**: Métricas promediadas por workout o por período

## 🔮 Mejoras Futuras Sugeridas

- [ ] Animaciones avanzadas (Reanimated)
- [ ] Sonidos personalizados por fase
- [ ] Modo landscape optimizado para timer
- [ ] Personalización de temas/colores
- [ ] Integración con HealthKit/Google Fit
- [ ] Notificaciones push para recordatorios
- [ ] Social features (compartir workouts)
- [ ] Exportar datos a CSV/PDF

---

**Diseñado y desarrollado con atención al detalle UX/UI 🎯**
