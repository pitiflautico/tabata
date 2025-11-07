import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import ProgressService from '../services/ProgressService';
import { CustomAlert } from '../components/CustomAlert';

/**
 * Pantalla de configuración
 */
const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    voiceEnabled: true,
    vibrateEnabled: true,
    autoNext: true,
    showFrames: true,
    countdownBeep: true,
    darkMode: false
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleResetProgress = () => {
    CustomAlert.alert(
      'Resetear Progreso',
      '¿Estás seguro? Se borrarán todos tus datos, entrenamientos e historial. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: () => {
            ProgressService.resetProgress('default-user');
            CustomAlert.success('Completado', 'Tu progreso ha sido reseteado');
          }
        }
      ],
      { type: 'warning' }
    );
  };

  const settingsSections = [
    {
      title: 'Audio y Sonido',
      items: [
        {
          key: 'soundEnabled',
          label: 'Efectos de Sonido',
          description: 'Reproducir sonidos durante el entrenamiento',
          icon: '🔊'
        },
        {
          key: 'voiceEnabled',
          label: 'Instrucciones por Voz',
          description: 'Escuchar el nombre de los ejercicios',
          icon: '🗣️'
        },
        {
          key: 'countdownBeep',
          label: 'Beep de Cuenta Regresiva',
          description: 'Sonido 3-2-1 antes de cambiar de fase',
          icon: '⏱️'
        }
      ]
    },
    {
      title: 'Experiencia de Entrenamiento',
      items: [
        {
          key: 'vibrateEnabled',
          label: 'Vibración',
          description: 'Vibrar al cambiar de ejercicio',
          icon: '📳'
        },
        {
          key: 'autoNext',
          label: 'Auto-avance',
          description: 'Pasar automáticamente al siguiente ejercicio',
          icon: '⏭️'
        },
        {
          key: 'showFrames',
          label: 'Mostrar Frames',
          description: 'Ver animación de frames durante ejercicios',
          icon: '🎬'
        }
      ]
    },
    {
      title: 'Apariencia',
      items: [
        {
          key: 'darkMode',
          label: 'Modo Oscuro',
          description: 'Interfaz con colores oscuros',
          icon: '🌙'
        }
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
        <Text style={styles.headerSubtitle}>
          Personaliza tu experiencia
        </Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>

          {section.items.map((item) => (
            <View key={item.key} style={styles.settingCard}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>{item.icon}</Text>
              </View>

              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingDescription}>
                  {item.description}
                </Text>
              </View>

              <Switch
                value={settings[item.key]}
                onValueChange={() => toggleSetting(item.key)}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={settings[item.key] ? '#fff' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      ))}

      {/* Información de la App */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versión de la App</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ejercicios Disponibles</Text>
            <Text style={styles.infoValue}>17</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Programas de Entrenamiento</Text>
            <Text style={styles.infoValue}>3</Text>
          </View>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => CustomAlert.alert('Exportar', 'Funcionalidad próximamente')}
        >
          <Text style={styles.actionButtonIcon}>📤</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonLabel}>Exportar Datos</Text>
            <Text style={styles.actionButtonDescription}>
              Guarda una copia de tu progreso
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => CustomAlert.alert('Importar', 'Funcionalidad próximamente')}
        >
          <Text style={styles.actionButtonIcon}>📥</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonLabel}>Importar Datos</Text>
            <Text style={styles.actionButtonDescription}>
              Restaura tu progreso desde un archivo
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleResetProgress}
        >
          <Text style={styles.actionButtonIcon}>🗑️</Text>
          <View style={styles.actionButtonContent}>
            <Text style={[styles.actionButtonLabel, styles.dangerText]}>
              Resetear Todo
            </Text>
            <Text style={styles.actionButtonDescription}>
              Eliminar todo tu progreso y datos
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Acerca de */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Tabata Training App</Text>
          <Text style={styles.aboutText}>
            Aplicación de entrenamientos Tabata con algoritmo inteligente de
            organización de ejercicios. Diseñada para maximizar tu rendimiento
            con bloques personalizados y progresión adaptativa.
          </Text>

          <TouchableOpacity style={styles.aboutLink}>
            <Text style={styles.aboutLinkText}>Ver Tutorial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutLink}>
            <Text style={styles.aboutLinkText}>Reportar un Problema</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutLink}>
            <Text style={styles.aboutLinkText}>Política de Privacidad</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Hecho con ❤️ para mejorar tu entrenamiento
        </Text>
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
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#0f3460',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingEmoji: {
    fontSize: 24,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: '#666',
  },
  dangerButton: {
    borderWidth: 2,
    borderColor: '#F44336',
  },
  dangerText: {
    color: '#F44336',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutLink: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  aboutLinkText: {
    fontSize: 15,
    color: '#0f3460',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
