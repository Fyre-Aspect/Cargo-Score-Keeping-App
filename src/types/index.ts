/**
 * Core data types for the Score Keeper App
 */

export interface Player {
  id: string;
  name: string;
  score: number;
  seatIndex: number; // Fixed seating order for dealer rotation
}

export interface GameState {
  players: Player[];
  dealerSeatIndex: number; // Which seat is the dealer
  expandedPlayerId: string | null; // Which player has the score panel open
}

// Action types for the reducer
export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'RENAME_PLAYER'; playerId: string; name: string }
  | { type: 'UPDATE_SCORE'; playerId: string; delta: number }
  | { type: 'SET_SCORE'; playerId: string; score: number }
  | { type: 'NEXT_DEALER' }
  | { type: 'RESET_SCORES' }
  | { type: 'EXPAND_PLAYER'; playerId: string | null }
  | { type: 'LOAD_STATE'; state: GameState };

// Storage key for AsyncStorage
export const STORAGE_KEY = '@cargo_score_keeper_state';
