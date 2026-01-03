/**
 * Utility functions for the app
 */

/**
 * Generate a unique ID for new players
 */
export function generateId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Sort players by score (ascending - lowest score is best)
 * Maintains stable sort order for equal scores
 */
export function sortPlayersByScore<T extends { score: number; id: string }>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    // Stable sort by ID for equal scores
    return a.id.localeCompare(b.id);
  });
}

/**
 * Get the next dealer seat index (counter-clockwise)
 * @param currentSeatIndex Current dealer's seat index
 * @param totalSeats Total number of seats (players)
 */
export function getNextDealerSeat(currentSeatIndex: number, totalSeats: number): number {
  if (totalSeats <= 0) return 0;
  // Counter-clockwise means going to lower seat numbers
  // If at seat 0, wrap to highest seat
  return (currentSeatIndex - 1 + totalSeats) % totalSeats;
}

/**
 * Format score for display
 */
export function formatScore(score: number): string {
  return score.toString();
}

/**
 * Debounce function to prevent rapid repeated calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
