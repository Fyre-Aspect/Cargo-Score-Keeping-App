/**
 * Core data types for the Score Keeper App
 */

export interface Player {
  id: string;
  name: string;
  score: number;
  seatIndex: number; // Fixed seating order for dealer rotation
}

export interface PendingScore {
  playerId: string;
  delta: number;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

export interface GameState {
  players: Player[];
  dealerSeatIndex: number; // Which seat is the dealer
  expandedPlayerId: string | null; // Which player has the score panel open
  pendingScores: Record<string, number>; // Accumulated deltas per player before commit
  hasSeenOnboarding: boolean; // Whether user has seen the tutorial
  isGameStarted: boolean; // Whether initial player setup is complete
}

// Action types for the reducer
export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'ADD_PLAYERS_BATCH'; names: string[] }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'RENAME_PLAYER'; playerId: string; name: string }
  | { type: 'UPDATE_SCORE'; playerId: string; delta: number }
  | { type: 'ADD_PENDING_SCORE'; playerId: string; delta: number }
  | { type: 'COMMIT_PENDING_SCORE'; playerId: string }
  | { type: 'SET_SCORE'; playerId: string; score: number }
  | { type: 'NEXT_DEALER' }
  | { type: 'RESET_SCORES' }
  | { type: 'EXPAND_PLAYER'; playerId: string | null }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'SET_ONBOARDING_SEEN' }
  | { type: 'START_GAME' };

// Storage keys for AsyncStorage
export const STORAGE_KEY = '@cargo_score_keeper_state';
export const ONBOARDING_KEY = '@cargo_score_keeper_onboarding';
