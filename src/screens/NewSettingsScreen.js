import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  Vibration,
  Switch,
} from 'react-native';
import { AppTheme, CommonStyles } from '../theme/AppTheme';
import Card from '../components/Card';
import Button from '../components/Button';
import CircularButton from '../components/CircularButton';
import { useApp } from '../context/AppContext';
import { CustomAlert } from '../components/CustomAlert';

const NewSettingsScreen = ({ navigation }) => {
  const { config: globalConfig, updateConfig, settings, updateSettings } = useApp();
  const [config, setConfig] = useState(globalConfig);

  // Update local state when global config changes
  useEffect(() => {
    setConfig(globalConfig);
  }, [globalConfig]);

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState(0);

  const settingsGroups = [
    {
      title: 'Intervals',
      items: [
        {
          key: 'prepareTime',
          label: 'Prepare',
          description: 'Get ready time',
          value: config.prepareTime,
          unit: 'sec',
          color: AppTheme.colors.prepare,
          min: 5,
          max: 30,
          step: 5,
        },
        {
          key: 'workTime',
          label: 'Work',
          description: 'Exercise time',
          value: config.workTime,
          unit: 'sec',
          color: AppTheme.colors.work,
          min: 10,
          max: 60,
          step: 5,
        },
        {
          key: 'restTime',
          label: 'Rest',
          description: 'Rest between sets',
          value: config.restTime,
          unit: 'sec',
          color: AppTheme.colors.rest,
          min: 5,
          max: 30,
          step: 5,
        },
      ],
    },
    {
      title: 'Structure',
      items: [
        {
          key: 'rounds',
          label: 'Rounds',
          description: 'One round is work + rest',
          value: config.rounds,
          unit: '',
          color: AppTheme.colors.primary,
          min: 1,
          max: 20,
          step: 1,
        },
        {
          key: 'cycles',
          label: 'Cycles',
          description: 'One cycle is 4 rounds',
          value: config.cycles,
          unit: '',
          color: AppTheme.colors.secondary,
          min: 1,
          max: 10,
          step: 1,
        },
        {
          key: 'restBetweenCycles',
          label: 'Rest Between Cycles',
          description: 'Recovery interval',
          value: config.restBetweenCycles,
          unit: 'sec',
          color: AppTheme.colors.accent1,
          min: 30,
          max: 180,
          step: 15,
        },
      ],
    },
  ];

  const handleEdit = (item) => {
    setEditingField(item);
    setTempValue(item.value);
  };

  const handleSave = () => {
    if (editingField) {
      const newConfig = {
        ...config,
        [editingField.key]: tempValue,
      };
      setConfig(newConfig);
      updateConfig(newConfig);

      // Haptic feedback
      Vibration.vibrate(50);

      // Close modal first for smooth UX
      setEditingField(null);

      // Show success message briefly
      setTimeout(() => {
        CustomAlert.success('Guardado', 'Configuración actualizada correctamente');
      }, 200);
    } else {
      setEditingField(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue(0);
  };

  const applyPreset = (presetConfig) => {
    setConfig(presetConfig);
    updateConfig(presetConfig);
  };

  const adjustValue = (delta) => {
    if (editingField) {
      const newValue = Math.max(
        editingField.min,
        Math.min(editingField.max, tempValue + delta)
      );
      setTempValue(newValue);
    }
  };

  const calculateTotalTime = () => {
    const timePerRound = config.workTime + config.restTime;
    const timePerCycle = timePerRound * config.rounds;
    const totalRest = (config.cycles - 1) * config.restBetweenCycles;
    const total = timePerCycle * config.cycles + totalRest + config.prepareTime;
    return Math.ceil(total / 60);
  };

  return (
    <View style={CommonStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <CircularButton
          icon="arrow-back"
          size="medium"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Settings</Text>
        <CircularButton
          icon="refresh-outline"
          size="medium"
          onPress={() => {
            applyPreset({
              prepareTime: 10,
              workTime: 30,
              restTime: 10,
              rounds: 8,
              cycles: 3,
              restBetweenCycles: 60,
            });
          }}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Time Card */}
        <Card style={styles.totalTimeCard}>
          <Text style={styles.totalTimeLabel}>Total Workout Time</Text>
          <Text style={styles.totalTimeValue}>{calculateTotalTime()} min</Text>
          <Text style={styles.totalTimeBreakdown}>
            {config.rounds} rounds × {config.cycles} cycles
          </Text>
        </Card>

        {/* Audio & Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio & Notificaciones</Text>

          <Card>
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Text style={styles.switchLabel}>Sonidos</Text>
                <Text style={styles.switchDescription}>
                  Reproducir sonidos durante entrenamientos
                </Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => {
                  updateSettings({ soundEnabled: value });
                  if (value) Vibration.vibrate(50);
                }}
                trackColor={{
                  false: AppTheme.colors.backgroundCardLight,
                  true: AppTheme.colors.primary + '50',
                }}
                thumbColor={settings.soundEnabled ? AppTheme.colors.primary : AppTheme.colors.textTertiary}
                ios_backgroundColor={AppTheme.colors.backgroundCardLight}
              />
            </View>
          </Card>

          <Card style={styles.cardSpacing}>
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Text style={styles.switchLabel}>Vibración</Text>
                <Text style={styles.switchDescription}>
                  Vibrar en transiciones de fase
                </Text>
              </View>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(value) => {
                  updateSettings({ vibrationEnabled: value });
                  if (value) Vibration.vibrate(50);
                }}
                trackColor={{
                  false: AppTheme.colors.backgroundCardLight,
                  true: AppTheme.colors.primary + '50',
                }}
                thumbColor={settings.vibrationEnabled ? AppTheme.colors.primary : AppTheme.colors.textTertiary}
                ios_backgroundColor={AppTheme.colors.backgroundCardLight}
              />
            </View>
          </Card>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>

            {group.items.map((item, itemIndex) => (
              <Card
                key={item.key}
                style={itemIndex > 0 ? styles.cardSpacing : null}
                onPress={() => handleEdit(item)}
              >
                <View style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      <Text style={styles.settingDescription}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    <Text style={styles.settingValue}>
                      {item.value}
                      {item.unit && (
                        <Text style={styles.settingUnit}> {item.unit}</Text>
                      )}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ))}

        {/* Preset Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preset Templates</Text>

          <Button
            title="Classic Tabata (4 min)"
            variant="outline"
            fullWidth
            onPress={() => {
              applyPreset({
                prepareTime: 10,
                workTime: 20,
                restTime: 10,
                rounds: 8,
                cycles: 1,
                restBetweenCycles: 0,
              });
            }}
          />

          <Button
            title="Advanced Tabata (12 min)"
            variant="outline"
            fullWidth
            style={styles.presetButton}
            onPress={() => {
              applyPreset({
                prepareTime: 10,
                workTime: 30,
                restTime: 10,
                rounds: 8,
                cycles: 3,
                restBetweenCycles: 60,
              });
            }}
          />

          <Button
            title="Beginner (8 min)"
            variant="outline"
            fullWidth
            style={styles.presetButton}
            onPress={() => {
              applyPreset({
                prepareTime: 10,
                workTime: 20,
                restTime: 20,
                rounds: 6,
                cycles: 2,
                restBetweenCycles: 90,
              });
            }}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editingField !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {editingField && (
              <>
                <Text style={styles.modalTitle}>{editingField.label}</Text>
                <Text style={styles.modalDescription}>
                  {editingField.description}
                </Text>

                <View style={styles.valueEditor}>
                  <CircularButton
                    icon="remove"
                    size="large"
                    color={AppTheme.colors.backgroundCard}
                    onPress={() => adjustValue(-editingField.step)}
                  />

                  <View style={styles.valueDisplay}>
                    <Text style={[styles.valueText, { color: editingField.color }]}>
                      {tempValue}
                    </Text>
                    {editingField.unit && (
                      <Text style={styles.valueUnit}>{editingField.unit}</Text>
                    )}
                  </View>

                  <CircularButton
                    icon="add"
                    size="large"
                    color={editingField.color}
                    iconColor={AppTheme.colors.background}
                    onPress={() => adjustValue(editingField.step)}
                  />
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title="Cancel"
                    variant="ghost"
                    onPress={handleCancel}
                    style={styles.modalButton}
                  />
                  <Button
                    title="Save"
                    onPress={handleSave}
                    style={styles.modalButton}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50,
    paddingBottom: AppTheme.spacing.lg,
  },
  headerTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  totalTimeCard: {
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.xl,
    marginBottom: AppTheme.spacing.lg,
  },
  totalTimeLabel: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.sm,
  },
  totalTimeValue: {
    fontSize: AppTheme.typography.fontSize.giant,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.primary,
    lineHeight: AppTheme.typography.fontSize.giant * 1.1,
  },
  totalTimeBreakdown: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.sm,
  },
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLeft: {
    flex: 1,
    marginRight: AppTheme.spacing.md,
  },
  switchLabel: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: AppTheme.borderRadius.xs,
    marginRight: AppTheme.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
  },
  settingRight: {
    marginLeft: AppTheme.spacing.md,
  },
  settingValue: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
  },
  settingUnit: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    fontWeight: AppTheme.typography.fontWeight.medium,
  },
  cardSpacing: {
    marginTop: AppTheme.spacing.md,
  },
  presetButton: {
    marginTop: AppTheme.spacing.md,
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AppTheme.layout.screenPadding,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.xl,
  },
  modalTitle: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.xs,
  },
  modalDescription: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.xl,
  },
  valueEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AppTheme.spacing.xl,
  },
  valueDisplay: {
    alignItems: 'center',
  },
  valueText: {
    fontSize: AppTheme.typography.fontSize.giant,
    fontWeight: AppTheme.typography.fontWeight.bold,
    lineHeight: AppTheme.typography.fontSize.giant * 1.1,
  },
  valueUnit: {
    fontSize: AppTheme.typography.fontSize.md,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: AppTheme.spacing.xs,
  },
});

export default NewSettingsScreen;
