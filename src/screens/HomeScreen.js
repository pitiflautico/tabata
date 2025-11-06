import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

/**
 * Pantalla principal de la app
 */
const HomeScreen = ({ navigation }) => {
  const menuOptions = [
    {
      id: '1',
      title: 'Nuevo Entrenamiento',
      description: 'Genera un entrenamiento personalizado',
      icon: '🏋️',
      route: 'WorkoutGenerator',
      color: '#4CAF50'
    },
    {
      id: '2',
      title: 'Catálogo de Ejercicios',
      description: 'Explora todos los ejercicios disponibles',
      icon: '📚',
      route: 'ExerciseCatalog',
      color: '#2196F3'
    },
    {
      id: '3',
      title: 'Mis Entrenamientos',
      description: 'Historial de entrenamientos realizados',
      icon: '📊',
      route: 'WorkoutHistory',
      color: '#FF9800'
    },
    {
      id: '4',
      title: 'Mi Progreso',
      description: 'Seguimiento de tu evolución',
      icon: '📈',
      route: 'Progress',
      color: '#9C27B0'
    },
    {
      id: '5',
      title: 'Configuración',
      description: 'Ajusta tus preferencias',
      icon: '⚙️',
      route: 'Settings',
      color: '#607D8B'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tabata Training</Text>
        <Text style={styles.headerSubtitle}>
          Entrena inteligentemente con bloques personalizados
        </Text>
      </View>

      <View style={styles.menuContainer}>
        {menuOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[styles.menuCard, { borderLeftColor: option.color }]}
            onPress={() => navigation.navigate(option.route)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>{option.icon}</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{option.title}</Text>
              <Text style={styles.menuDescription}>{option.description}</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Resumen de esta semana</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>120</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>Calorías</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#0f3460',
    opacity: 0.9,
  },
  menuContainer: {
    padding: 16,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  statsContainer: {
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f3460',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;
