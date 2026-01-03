import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import { 
  Header, 
  PlayerList, 
  AddPlayerModal, 
  AddPlayerFAB,
  OnboardingModal,
  GameSetupModal,
} from './src/components';
import { Colors } from './src/constants/theme';

function MainScreen() {
  const { state, dispatch, isLoading } = useGame();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGameSetup, setShowGameSetup] = useState(false);

  // Show onboarding on first launch, then game setup if no game started
  useEffect(() => {
    if (!isLoading) {
      if (!state.hasSeenOnboarding) {
        setShowOnboarding(true);
      } else if (!state.isGameStarted && state.players.length === 0) {
        setShowGameSetup(true);
      }
    }
  }, [isLoading, state.hasSeenOnboarding, state.isGameStarted, state.players.length]);

  const handleOnboardingClose = () => {
    dispatch({ type: 'SET_ONBOARDING_SEEN' });
    setShowOnboarding(false);
    // Show game setup after onboarding if no game started
    if (!state.isGameStarted && state.players.length === 0) {
      setShowGameSetup(true);
    }
  };

  const handleGameSetupComplete = () => {
    setShowGameSetup(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <PlayerList />
      <AddPlayerFAB onPress={() => setShowAddModal(true)} />
      <AddPlayerModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <OnboardingModal
        visible={showOnboarding}
        onClose={handleOnboardingClose}
      />
      <GameSetupModal
        visible={showGameSetup}
        onComplete={handleGameSetupComplete}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={Colors.cardBackground} />
      <GameProvider>
        <MainScreen />
      </GameProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
