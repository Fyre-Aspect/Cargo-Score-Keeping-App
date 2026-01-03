import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, TouchTarget } from '../constants/theme';
import { useGame } from '../context/GameContext';

interface GameSetupModalProps {
  visible: boolean;
  onComplete: () => void;
}

interface PlayerInput {
  id: number;
  name: string;
}

export function GameSetupModal({ visible, onComplete }: GameSetupModalProps) {
  const { dispatch } = useGame();
  const [players, setPlayers] = useState<PlayerInput[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
    { id: 3, name: '' },
    { id: 4, name: '' },
  ]);

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, name } : p)));
  };

  const addPlayer = () => {
    const nextId = Math.max(...players.map(p => p.id)) + 1;
    setPlayers(prev => [...prev, { id: nextId, name: '' }]);
  };

  const removePlayer = (id: number) => {
    if (players.length <= 2) return; // Minimum 2 players
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handleStartGame = () => {
    // Filter out empty names and create players
    const validNames = players
      .map((p, index) => p.name.trim() || `Player ${index + 1}`)
      .filter(Boolean);

    if (validNames.length >= 2) {
      dispatch({ type: 'ADD_PLAYERS_BATCH', names: validNames });
      dispatch({ type: 'START_GAME' });
      onComplete();
    }
  };

  const canStart = players.length >= 2;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => {}}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Set Up Players</Text>
            <Text style={styles.subtitle}>
              Add players in counter-clockwise seating order, starting with the first dealer
            </Text>

            <View style={styles.diagram}>
              <Text style={styles.diagramText}>↺ Counter-clockwise</Text>
              <Text style={styles.diagramHint}>
                Player 1 is the first dealer. The dealer rotates to Player 2, then 3, etc.
              </Text>
            </View>

            <View style={styles.playerList}>
              {players.map((player, index) => (
                <View key={player.id} style={styles.playerInputRow}>
                  <View style={styles.seatBadge}>
                    <Text style={styles.seatText}>{index + 1}</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={player.name}
                    onChangeText={(text) => updatePlayerName(player.id, text)}
                    placeholder={`Player ${index + 1}`}
                    placeholderTextColor={Colors.textMuted}
                    maxLength={20}
                  />
                  {players.length > 2 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePlayer(player.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={addPlayer}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+ Add Another Player</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.startButton, !canStart && styles.startButtonDisabled]}
              onPress={handleStartGame}
              activeOpacity={0.8}
              disabled={!canStart}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  diagram: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  diagramText: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.accent,
    marginBottom: Spacing.sm,
  },
  diagramHint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  playerList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  seatBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  input: {
    flex: 1,
    height: TouchTarget.minimum,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  removeButton: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
  addButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.accent,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  startButton: {
    height: 56,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: Colors.buttonNeutral,
  },
  startButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.buttonText,
  },
});
