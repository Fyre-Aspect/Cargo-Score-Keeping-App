import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, TouchTarget } from '../constants/theme';
import { Player } from '../types';
import { useGame, useIsDealer } from '../context/GameContext';
import { ScoreEntryPanel } from './ScoreEntryPanel';
import { formatScore } from '../utils/helpers';

interface PlayerRowProps {
  player: Player;
  rank: number;
  isExpanded: boolean;
  pendingDelta: number;
}

function PlayerRowComponent({ player, rank, isExpanded, pendingDelta }: PlayerRowProps) {
  const { dispatch, addPendingScore } = useGame();
  const isDealer = useIsDealer(player.id);

  const handleQuickIncrement = () => {
    addPendingScore(player.id, 1);
  };

  const handleQuickDecrement = () => {
    addPendingScore(player.id, -1);
  };

  const handleExpandPanel = () => {
    dispatch({ type: 'EXPAND_PLAYER', playerId: isExpanded ? null : player.id });
  };

  const handleClosePanel = () => {
    dispatch({ type: 'EXPAND_PLAYER', playerId: null });
  };

  const isLeading = rank === 1;
  const hasPending = pendingDelta !== 0;

  return (
    <View style={styles.container}>
      {/* Main row */}
      <View style={styles.row}>
        {/* Pending score indicator OR Rank badge */}
        {hasPending ? (
          <View style={[styles.pendingBadge, pendingDelta > 0 ? styles.pendingPositive : styles.pendingNegative]}>
            <Text style={[styles.pendingText, pendingDelta > 0 ? styles.pendingTextPositive : styles.pendingTextNegative]}>
              {pendingDelta > 0 ? '+' : ''}{pendingDelta}
            </Text>
          </View>
        ) : (
          <View style={[styles.rankBadge, isLeading && styles.rankBadgeLeading]}>
            <Text style={[styles.rankText, isLeading && styles.rankTextLeading]}>
              {rank}
            </Text>
          </View>
        )}

        {/* Player info - tappable area for score panel */}
        <Pressable
          style={styles.playerInfo}
          onPress={handleExpandPanel}
          android_ripple={{ color: Colors.border, borderless: false }}
        >
          <View style={styles.nameRow}>
            <Text style={styles.playerName} numberOfLines={1}>
              {player.name}
            </Text>
            {isDealer && (
              <View style={styles.dealerBadge}>
                <Text style={styles.dealerText}>D</Text>
              </View>
            )}
          </View>
          <Text style={styles.tapHint}>Tap to edit score</Text>
        </Pressable>

        {/* Score display */}
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, isLeading && styles.scoreTextLeading]}>
            {formatScore(player.score)}
          </Text>
          {hasPending && (
            <Text style={styles.pendingPreview}>
              → {formatScore(player.score + pendingDelta)}
            </Text>
          )}
        </View>

        {/* Quick +/- buttons */}
        <View style={styles.quickButtons}>
          <TouchableOpacity
            style={[styles.quickButton, styles.decrementButton]}
            onPress={handleQuickDecrement}
            activeOpacity={0.7}
          >
            <Text style={styles.quickButtonText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickButton, styles.incrementButton]}
            onPress={handleQuickIncrement}
            activeOpacity={0.7}
          >
            <Text style={styles.quickButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Score entry panel (inline, not modal) */}
      {isExpanded && (
        <ScoreEntryPanel
          playerId={player.id}
          currentScore={player.score}
          onClose={handleClosePanel}
        />
      )}
    </View>
  );
}

// Memoize to prevent unnecessary re-renders
export const PlayerRow = memo(PlayerRowComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: 72,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.buttonNeutral,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rankBadgeLeading: {
    backgroundColor: Colors.rankFirst,
  },
  rankText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  rankTextLeading: {
    color: Colors.buttonText,
  },
  playerInfo: {
    flex: 1,
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playerName: {
    fontSize: FontSize.lg,
    fontWeight: '500',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  dealerBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.dealerBadge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealerText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.dealerBadgeText,
  },
  tapHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scoreContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
    marginRight: Spacing.md,
  },
  scoreText: {
    fontSize: FontSize.xxl,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  scoreTextLeading: {
    color: Colors.rankFirst,
  },
  pendingPreview: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    marginTop: 2,
  },
  pendingBadge: {
    minWidth: 36,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  pendingPositive: {
    backgroundColor: '#D1FAE5',
  },
  pendingNegative: {
    backgroundColor: '#FEE2E2',
  },
  pendingText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  pendingTextPositive: {
    color: '#059669',
  },
  pendingTextNegative: {
    color: '#DC2626',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  quickButton: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  incrementButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  quickButtonText: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
