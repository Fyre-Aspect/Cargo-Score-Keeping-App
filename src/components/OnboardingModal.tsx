import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, TouchTarget } from '../constants/theme';

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

export function OnboardingModal({ visible, onClose }: OnboardingModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Welcome to Score Keeper</Text>
          <Text style={styles.subtitle}>A simple way to track card game scores</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Scoring</Text>
            <Text style={styles.sectionText}>
              • Lower score is better — the player with the least points wins
            </Text>
            <Text style={styles.sectionText}>
              • Use the <Text style={styles.highlight}>+</Text> and <Text style={styles.highlight}>−</Text> buttons for quick adjustments
            </Text>
            <Text style={styles.sectionText}>
              • Tap a player's name to enter a custom score
            </Text>
            <Text style={styles.sectionText}>
              • Quick buttons let you add common values like +40, −10, −20
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Fast Scoring</Text>
            <Text style={styles.sectionText}>
              • When you tap +/− quickly, scores accumulate
            </Text>
            <Text style={styles.sectionText}>
              • A pending badge shows the total being added
            </Text>
            <Text style={styles.sectionText}>
              • After you stop, the score updates and the leaderboard re-sorts
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎴 Dealer Tracking</Text>
            <Text style={styles.sectionText}>
              • The current dealer is marked with a <Text style={styles.dealerBadge}>D</Text> badge
            </Text>
            <Text style={styles.sectionText}>
              • Tap "Next Dealer" to rotate counter-clockwise
            </Text>
            <Text style={styles.sectionText}>
              • Dealer order follows seating, not scores
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎮 Game Controls</Text>
            <Text style={styles.sectionText}>
              • Tap the <Text style={styles.highlight}>+</Text> button to add players
            </Text>
            <Text style={styles.sectionText}>
              • "New Game" resets all scores but keeps players
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 100,
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
    marginBottom: Spacing.xxl,
  },
  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sectionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  highlight: {
    color: Colors.accent,
    fontWeight: '600',
  },
  dealerBadge: {
    color: Colors.dealerBadge,
    fontWeight: '700',
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
  startButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.buttonText,
  },
});
