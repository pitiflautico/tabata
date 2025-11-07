import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';
import Button from './Button';

/**
 * Modal para guardar workout con nombre personalizado
 */
const SaveWorkoutModal = ({ visible, onClose, onSave, defaultName = '' }) => {
  const [name, setName] = useState(defaultName);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    onSave({
      name: name.trim(),
      saveAsTemplate,
      description: description.trim(),
    });

    // Reset
    setName(defaultName);
    setSaveAsTemplate(false);
    setDescription('');
  };

  const handleClose = () => {
    setName(defaultName);
    setSaveAsTemplate(false);
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="save-outline" size={32} color={AppTheme.colors.primary} />
            <Text style={styles.title}>Guardar Entrenamiento</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={AppTheme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej: Mi Entrenamiento Favorito"
              placeholderTextColor={AppTheme.colors.textTertiary}
              autoFocus
            />
          </View>

          {/* Template Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setSaveAsTemplate(!saveAsTemplate)}
          >
            <View
              style={[
                styles.checkbox,
                saveAsTemplate && styles.checkboxChecked,
              ]}
            >
              {saveAsTemplate && (
                <Ionicons name="checkmark" size={18} color={AppTheme.colors.background} />
              )}
            </View>
            <View style={styles.checkboxText}>
              <Text style={styles.checkboxLabel}>Guardar como plantilla</Text>
              <Text style={styles.checkboxHint}>
                Podrás reutilizar este workout en el futuro
              </Text>
            </View>
          </TouchableOpacity>

          {/* Description (if template) */}
          {saveAsTemplate && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Ej: Perfecto para días intensos"
                placeholderTextColor={AppTheme.colors.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={handleClose}
              style={styles.actionButton}
            />
            <Button
              title="Guardar"
              onPress={handleSave}
              disabled={!name.trim()}
              style={styles.actionButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.xl,
    ...AppTheme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.xl,
  },
  title: {
    flex: 1,
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: AppTheme.typography.fontWeight.bold,
    color: AppTheme.colors.text,
    marginLeft: AppTheme.spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: AppTheme.spacing.lg,
  },
  label: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.sm,
  },
  input: {
    backgroundColor: AppTheme.colors.backgroundCardLight,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.base,
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.text,
    borderWidth: 1,
    borderColor: AppTheme.colors.backgroundCardLight,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: AppTheme.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  checkboxChecked: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  checkboxText: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: AppTheme.typography.fontWeight.medium,
    color: AppTheme.colors.text,
    marginBottom: 2,
  },
  checkboxHint: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

export default SaveWorkoutModal;
