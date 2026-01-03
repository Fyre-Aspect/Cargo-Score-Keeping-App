import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GameAction, Player, STORAGE_KEY, ONBOARDING_KEY } from '../types';
import { generateId, sortPlayersByScore, getNextDealerSeat } from '../utils/helpers';

/**
 * Initial state for a new game
 */
const initialState: GameState = {
  players: [],
  dealerSeatIndex: 0,
  expandedPlayerId: null,
  pendingScores: {},
  hasSeenOnboarding: false,
  isGameStarted: false,
};

/**
 * Reducer for game state management
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const newPlayer: Player = {
        id: generateId(),
        name: action.name.trim() || `Player ${state.players.length + 1}`,
        score: 0,
        seatIndex: state.players.length, // Assign next available seat
      };
      return {
        ...state,
        players: sortPlayersByScore([...state.players, newPlayer]),
      };
    }

    case 'ADD_PLAYERS_BATCH': {
      const newPlayers = action.names.map((name, index) => ({
        id: generateId(),
        name: name.trim() || `Player ${state.players.length + index + 1}`,
        score: 0,
        seatIndex: state.players.length + index,
      }));
      return {
        ...state,
        players: sortPlayersByScore([...state.players, ...newPlayers]),
      };
    }

    case 'REMOVE_PLAYER': {
      const remainingPlayers = state.players.filter(p => p.id !== action.playerId);
      // Reassign seat indices to maintain continuous order
      const reindexedPlayers = remainingPlayers.map((player, index) => ({
        ...player,
        seatIndex: index,
      }));
      // Adjust dealer seat if needed
      let newDealerSeat = state.dealerSeatIndex;
      if (reindexedPlayers.length === 0) {
        newDealerSeat = 0;
      } else if (newDealerSeat >= reindexedPlayers.length) {
        newDealerSeat = reindexedPlayers.length - 1;
      }
      // Remove pending score for this player
      const { [action.playerId]: removed, ...remainingPending } = state.pendingScores;
      return {
        ...state,
        players: sortPlayersByScore(reindexedPlayers),
        dealerSeatIndex: newDealerSeat,
        expandedPlayerId: state.expandedPlayerId === action.playerId ? null : state.expandedPlayerId,
        pendingScores: remainingPending,
      };
    }

    case 'RENAME_PLAYER': {
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId ? { ...p, name: action.name.trim() || p.name } : p
        ),
      };
    }

    case 'ADD_PENDING_SCORE': {
      const currentPending = state.pendingScores[action.playerId] || 0;
      return {
        ...state,
        pendingScores: {
          ...state.pendingScores,
          [action.playerId]: currentPending + action.delta,
        },
      };
    }

    case 'COMMIT_PENDING_SCORE': {
      const pendingDelta = state.pendingScores[action.playerId];
      if (pendingDelta === undefined || pendingDelta === 0) {
        // Nothing to commit, just clear
        const { [action.playerId]: removed, ...rest } = state.pendingScores;
        return { ...state, pendingScores: rest };
      }
      const updatedPlayers = state.players.map(p =>
        p.id === action.playerId ? { ...p, score: p.score + pendingDelta } : p
      );
      const { [action.playerId]: removed, ...remainingPending } = state.pendingScores;
      return {
        ...state,
        players: sortPlayersByScore(updatedPlayers),
        pendingScores: remainingPending,
      };
    }

    case 'UPDATE_SCORE': {
      const updatedPlayers = state.players.map(p =>
        p.id === action.playerId ? { ...p, score: p.score + action.delta } : p
      );
      return {
        ...state,
        players: sortPlayersByScore(updatedPlayers),
        expandedPlayerId: null, // Close panel after score update
      };
    }

    case 'SET_SCORE': {
      const updatedPlayers = state.players.map(p =>
        p.id === action.playerId ? { ...p, score: action.score } : p
      );
      return {
        ...state,
        players: sortPlayersByScore(updatedPlayers),
        expandedPlayerId: null,
      };
    }

    case 'NEXT_DEALER': {
      return {
        ...state,
        dealerSeatIndex: getNextDealerSeat(state.dealerSeatIndex, state.players.length),
      };
    }

    case 'RESET_SCORES': {
      return {
        ...state,
        players: state.players.map(p => ({ ...p, score: 0 })),
        pendingScores: {},
        expandedPlayerId: null,
      };
    }

    case 'EXPAND_PLAYER': {
      return {
        ...state,
        expandedPlayerId: action.playerId,
      };
    }

    case 'LOAD_STATE': {
      return {
        ...action.state,
        players: sortPlayersByScore(action.state.players),
        pendingScores: action.state.pendingScores || {},
        hasSeenOnboarding: action.state.hasSeenOnboarding || false,
        isGameStarted: action.state.isGameStarted || false,
      };
    }

    case 'SET_ONBOARDING_SEEN': {
      return {
        ...state,
        hasSeenOnboarding: true,
      };
    }

    case 'START_GAME': {
      return {
        ...state,
        isGameStarted: true,
      };
    }

    default:
      return state;
  }
}

/**
 * Context type definition
 */
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isLoading: boolean;
  addPendingScore: (playerId: string, delta: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Store for pending score commit timeouts (outside component to persist across renders)
const pendingTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};

/**
 * Provider component for game state
 */
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);

  // Function to add a pending score with auto-commit after delay
  const addPendingScore = useCallback((playerId: string, delta: number) => {
    // Clear existing timeout for this player
    if (pendingTimeouts[playerId]) {
      clearTimeout(pendingTimeouts[playerId]);
    }

    // Add to pending score
    dispatch({ type: 'ADD_PENDING_SCORE', playerId, delta });

    // Set new timeout to commit after 1.2 seconds of inactivity
    pendingTimeouts[playerId] = setTimeout(() => {
      dispatch({ type: 'COMMIT_PENDING_SCORE', playerId });
      delete pendingTimeouts[playerId];
    }, 1200);
  }, []);

  // Load state from storage on mount
  useEffect(() => {
    async function loadState() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState = JSON.parse(stored) as GameState;
          // Validate the loaded state has required properties
          if (parsedState.players && Array.isArray(parsedState.players)) {
            dispatch({ type: 'LOAD_STATE', state: parsedState });
          }
        }
      } catch (error) {
        console.warn('Failed to load saved state:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadState();
  }, []);

  // Save state to storage on changes (debounced)
  useEffect(() => {
    if (isLoading) return; // Don't save while loading

    const saveState = async () => {
      try {
        // Don't persist expandedPlayerId or pendingScores - those are UI state
        const stateToSave: GameState = {
          ...state,
          expandedPlayerId: null,
          pendingScores: {},
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Failed to save state:', error);
      }
    };

    const timeoutId = setTimeout(saveState, 300);
    return () => clearTimeout(timeoutId);
  }, [state, isLoading]);

  const value = React.useMemo(() => ({ state, dispatch, isLoading, addPendingScore }), [state, isLoading, addPendingScore]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook to access game state and dispatch
 */
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

/**
 * Hook to get the current dealer player
 */
export function useDealer(): Player | undefined {
  const { state } = useGame();
  return state.players.find(p => p.seatIndex === state.dealerSeatIndex);
}

/**
 * Hook to check if a player is the dealer
 */
export function useIsDealer(playerId: string): boolean {
  const { state } = useGame();
  const player = state.players.find(p => p.id === playerId);
  return player ? player.seatIndex === state.dealerSeatIndex : false;
}
