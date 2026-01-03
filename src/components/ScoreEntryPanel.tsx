import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, TouchTarget } from '../constants/theme';
import { useGame } from '../context/GameContext';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ScoreEntryPanelProps {
  playerId: string;
  currentScore: number;
  onClose: () => void;
}

export function ScoreEntryPanel({ playerId, currentScore, onClose }: ScoreEntryPanelProps) {
  const { dispatch } = useGame();
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(true); // true = add, false = subtract
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

    // Focus input after a short delay
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const applyScoreChange = (delta: number) => {
    if (delta !== 0) {
      dispatch({ type: 'UPDATE_SCORE', playerId, delta });
    }
    onClose();
  };

  const handleApply = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue !== 0) {
      const delta = isAdding ? numValue : -numValue;
      applyScoreChange(delta);
    }
  };

  const handleQuickAction = (value: number) => {
    applyScoreChange(value);
  };

  const quickActions = [
    { label: '−20', value: -20 },
    { label: '−10', value: -10 },
    { label: '+40', value: 40 },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Custom score input row */}
      <View style={styles.inputRow}>
        {/* +/- Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              styles.toggleLeft,
              !isAdding && styles.toggleActive,
            ]}
            onPress={() => setIsAdding(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, !isAdding && styles.toggleTextActive]}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              styles.toggleRight,
              isAdding && styles.toggleActive,
            ]}
            onPress={() => setIsAdding(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, isAdding && styles.toggleTextActive]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Numeric input */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={Colors.textMuted}
          maxLength={5}
          selectTextOnFocus
        />

        {/* Apply button */}
        <TouchableOpacity
          style={[
            styles.applyButton,
            (!inputValue || inputValue === '0') && styles.applyButtonDisabled,
          ]}
          onPress={handleApply}
          activeOpacity={0.7}
          disabled={!inputValue || inputValue === '0'}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Quick action buttons */}
      <View style={styles.quickActionsRow}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[
              styles.quickButton,
              action.value < 0 ? styles.quickButtonNegative : styles.quickButtonPositive,
            ]}
            onPress={() => handleQuickAction(action.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.quickButtonText,
                action.value < 0 ? styles.quickButtonTextNegative : styles.quickButtonTextPositive,
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
        <Text style={styles.closeButtonText}>Cancel</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.panelBackground,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleButton: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
  },
  toggleLeft: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  toggleRight: {},
  toggleActive: {
    backgroundColor: Colors.accent,
  },
  toggleText: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
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
    textAlign: 'center',
  },
  applyButton: {
    height: TouchTarget.minimum,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: Colors.buttonNeutral,
  },
  applyButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  quickButton: {
    flex: 1,
    height: TouchTarget.minimum,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  quickButtonNegative: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  quickButtonPositive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  quickButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  quickButtonTextNegative: {
    color: Colors.buttonNegative,
  },
  quickButtonTextPositive: {
    color: Colors.buttonPositive,
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  closeButtonText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
