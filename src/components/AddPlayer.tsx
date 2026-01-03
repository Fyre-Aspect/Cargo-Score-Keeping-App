import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, TouchTarget } from '../constants/theme';
import { useGame } from '../context/GameContext';

interface AddPlayerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddPlayerModal({ visible, onClose }: AddPlayerModalProps) {
  const { dispatch } = useGame();
  const [playerName, setPlayerName] = useState('');

  const handleAdd = () => {
    const trimmedName = playerName.trim();
    dispatch({ type: 'ADD_PLAYER', name: trimmedName });
    setPlayerName('');
    onClose();
  };

  const handleClose = () => {
    setPlayerName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>Add Player</Text>

            <TextInput
              style={styles.input}
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Player name"
              placeholderTextColor={Colors.textMuted}
              autoFocus
              maxLength={30}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAdd}
                activeOpacity={0.7}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

interface AddPlayerFABProps {
  onPress: () => void;
}

export function AddPlayerFAB({ onPress }: AddPlayerFABProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );
}

interface PlayerManagementProps {
  playerId: string;
  playerName: string;
  onClose: () => void;
}

export function PlayerManagementSheet({ playerId, playerName, onClose }: PlayerManagementProps) {
  const { dispatch } = useGame();
  const [name, setName] = useState(playerName);

  const handleRename = () => {
    if (name.trim() !== playerName) {
      dispatch({ type: 'RENAME_PLAYER', playerId, name: name.trim() });
    }
    onClose();
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Player',
      `Are you sure you want to remove ${playerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'REMOVE_PLAYER', playerId });
            onClose();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.sheetContainer}>
      <Text style={styles.sheetTitle}>Edit Player</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Player name"
        placeholderTextColor={Colors.textMuted}
        autoFocus
        maxLength={30}
        selectTextOnFocus
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.removeButton]}
          onPress={handleRemove}
          activeOpacity={0.7}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleRename}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.closeLink} onPress={onClose}>
        <Text style={styles.closeLinkText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    height: TouchTarget.minimum,
    backgroundColor: Colors.panelBackground,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    height: TouchTarget.minimum,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.buttonNeutral,
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  addButton: {
    backgroundColor: Colors.accent,
  },
  addButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fabText: {
    fontSize: 28,
    fontWeight: '400',
    color: Colors.buttonText,
    marginTop: -2,
  },
  sheetContainer: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.xl,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  sheetTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removeButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.buttonNegative,
  },
  saveButton: {
    backgroundColor: Colors.accent,
  },
  saveButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  closeLink: {
    alignSelf: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  closeLinkText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
