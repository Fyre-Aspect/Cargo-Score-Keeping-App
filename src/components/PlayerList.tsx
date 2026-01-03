import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Colors, Spacing, FontSize } from '../constants/theme';
import { useGame } from '../context/GameContext';
import { PlayerRow } from './PlayerRow';
import { Player } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function PlayerList() {
  const { state } = useGame();
  const prevPlayersRef = useRef<string>('');

  // Configure layout animation for smooth reordering (sliding effect)
  const configureAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.85,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  };

  // Trigger animation when player order changes
  useEffect(() => {
    const currentOrder = state.players.map(p => p.id).join(',');
    if (prevPlayersRef.current && prevPlayersRef.current !== currentOrder) {
      configureAnimation();
    }
    prevPlayersRef.current = currentOrder;
  }, [state.players]);

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    const pendingDelta = state.pendingScores[item.id] || 0;
    return (
      <PlayerRow
        player={item}
        rank={index + 1}
        isExpanded={state.expandedPlayerId === item.id}
        pendingDelta={pendingDelta}
      />
    );
  };

  const keyExtractor = (item: Player) => item.id;

  if (state.players.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Players Yet</Text>
        <Text style={styles.emptySubtitle}>
          Add players to start tracking scores
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={state.players}
      renderItem={renderPlayer}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      // Performance optimizations
      removeClippedSubviews={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      // Keyboard behavior
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      // Extra data to trigger re-render when pending scores change
      extraData={state.pendingScores}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: 100, // Extra space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
