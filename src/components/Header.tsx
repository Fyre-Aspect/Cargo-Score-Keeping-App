import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, TouchTarget } from '../constants/theme';
import { useGame, useDealer } from '../context/GameContext';

export function Header() {
  const { state, dispatch } = useGame();
  const dealer = useDealer();

  const handleNextDealer = () => {
    if (state.players.length === 0) {
      return;
    }
    dispatch({ type: 'NEXT_DEALER' });
  };

  const handleResetGame = () => {
    if (state.players.length === 0) {
      return;
    }
    Alert.alert(
      'Reset Game?',
      'This will remove all players and reset scores. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Game',
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_GAME' }),
        },
      ]
    );
  };

  const playerCount = state.players.length;

  return (
    <View style={styles.container}>
      {/* Title row */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Score Keeper</Text>
        <Text style={styles.playerCount}>
          {playerCount} {playerCount === 1 ? 'player' : 'players'}
        </Text>
      </View>

      {/* Dealer info */}
      {playerCount > 0 && dealer && (
        <View style={styles.dealerRow}>
          <Text style={styles.dealerLabel}>Dealer:</Text>
          <Text style={styles.dealerName}>{dealer.name}</Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, playerCount === 0 && styles.actionButtonDisabled]}
          onPress={handleNextDealer}
          activeOpacity={0.7}
          disabled={playerCount === 0}
        >
          <Text style={[styles.actionButtonText, playerCount === 0 && styles.actionButtonTextDisabled]}>
            ↻ Next Dealer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton, playerCount === 0 && styles.actionButtonDisabled]}
          onPress={handleResetGame}
          activeOpacity={0.7}
          disabled={playerCount === 0}
        >
          <Text style={[styles.actionButtonText, playerCount === 0 && styles.actionButtonTextDisabled]}>
            Reset Game
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  playerCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  dealerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  dealerLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  dealerName: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.dealerBadge,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: TouchTarget.minimum,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.buttonNeutral,
    borderColor: Colors.border,
  },
  resetButton: {
    backgroundColor: Colors.panelBackground,
    borderColor: Colors.border,
  },
  actionButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.accent,
  },
  actionButtonTextDisabled: {
    color: Colors.textMuted,
  },
});
