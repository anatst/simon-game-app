/**
 * Haptic Feedback Service
 * 
 * Based on Elite Mobile Game UX Design System
 * Provides tactile feedback for all interactions using the Vibration API
 */

// =============================================================================
// HAPTIC PATTERNS
// =============================================================================

interface HapticPattern {
  pattern: number | number[];
  description: string;
}

const HAPTIC_PATTERNS: Record<string, HapticPattern> = {
  // Light feedback - UI interactions
  light: {
    pattern: 10,
    description: 'Light tap for UI feedback',
  },
  
  // Medium feedback - Confirmations
  medium: {
    pattern: 30,
    description: 'Medium tap for confirmations',
  },
  
  // Heavy feedback - Important actions
  heavy: {
    pattern: 50,
    description: 'Heavy tap for important actions',
  },
  
  // Success - Satisfying pattern (Candy Crush style)
  success: {
    pattern: [30, 50, 30],
    description: 'Success celebration pattern',
  },
  
  // Error - Jarring pattern
  error: {
    pattern: [50, 30, 50, 30, 50],
    description: 'Error/failure pattern',
  },
  
  // Warning - Attention pattern
  warning: {
    pattern: [20, 50, 20],
    description: 'Warning/attention pattern',
  },
  
  // Countdown tick
  tick: {
    pattern: 15,
    description: 'Countdown tick',
  },
  
  // Button press
  buttonPress: {
    pattern: 8,
    description: 'Quick button press feedback',
  },
  
  // Color button tap (Simon)
  colorTap: {
    pattern: 25,
    description: 'Simon color button tap',
  },
  
  // Sequence show (Simon)
  sequenceShow: {
    pattern: 40,
    description: 'Sequence color showing',
  },
  
  // Round complete
  roundComplete: {
    pattern: [20, 30, 20, 30, 50],
    description: 'Round completion celebration',
  },
  
  // Game over
  gameOver: {
    pattern: [100, 50, 100],
    description: 'Game over pattern',
  },
  
  // Victory
  victory: {
    pattern: [30, 30, 30, 50, 100, 50, 100],
    description: 'Victory celebration',
  },
  
  // Elimination
  elimination: {
    pattern: [80, 40, 80, 40, 80],
    description: 'Player elimination',
  },
  
  // Timer warning (urgent)
  timerWarning: {
    pattern: [30, 20, 30],
    description: 'Timer urgency warning',
  },
  
  // Double tap
  doubleTap: {
    pattern: [10, 30, 10],
    description: 'Double tap confirmation',
  },
};

// =============================================================================
// HAPTIC SERVICE CLASS
// =============================================================================

class HapticService {
  private isSupported: boolean;
  private isEnabled: boolean;

  constructor() {
    this.isSupported = 'vibrate' in navigator;
    
    // Load preference from localStorage
    const savedPref = localStorage.getItem('simon-haptic-enabled');
    this.isEnabled = savedPref !== 'false'; // Default to enabled
  }

  /**
   * Check if haptic feedback is supported
   */
  getSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if haptic feedback is enabled
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Toggle haptic feedback on/off
   */
  toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('simon-haptic-enabled', String(this.isEnabled));
    return this.isEnabled;
  }

  /**
   * Set haptic feedback state explicitly
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('simon-haptic-enabled', String(enabled));
  }

  /**
   * Execute a haptic pattern
   */
  private vibrate(pattern: number | number[]): void {
    if (!this.isSupported || !this.isEnabled) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail - haptics are non-critical
      console.debug('Haptic vibration failed:', error);
    }
  }

  /**
   * Stop any ongoing vibration
   */
  stop(): void {
    if (!this.isSupported) return;
    
    try {
      navigator.vibrate(0);
    } catch (error) {
      // Silently fail
    }
  }

  // =========================================================================
  // PUBLIC METHODS - Named haptic patterns
  // =========================================================================

  /** Light tap for UI interactions */
  light(): void {
    this.vibrate(HAPTIC_PATTERNS.light.pattern);
  }

  /** Medium tap for confirmations */
  medium(): void {
    this.vibrate(HAPTIC_PATTERNS.medium.pattern);
  }

  /** Heavy tap for important actions */
  heavy(): void {
    this.vibrate(HAPTIC_PATTERNS.heavy.pattern);
  }

  /** Success celebration pattern */
  success(): void {
    this.vibrate(HAPTIC_PATTERNS.success.pattern);
  }

  /** Error/failure pattern */
  error(): void {
    this.vibrate(HAPTIC_PATTERNS.error.pattern);
  }

  /** Warning/attention pattern */
  warning(): void {
    this.vibrate(HAPTIC_PATTERNS.warning.pattern);
  }

  /** Countdown tick */
  tick(): void {
    this.vibrate(HAPTIC_PATTERNS.tick.pattern);
  }

  /** Quick button press */
  buttonPress(): void {
    this.vibrate(HAPTIC_PATTERNS.buttonPress.pattern);
  }

  /** Simon color button tap */
  colorTap(): void {
    this.vibrate(HAPTIC_PATTERNS.colorTap.pattern);
  }

  /** Sequence color showing */
  sequenceShow(): void {
    this.vibrate(HAPTIC_PATTERNS.sequenceShow.pattern);
  }

  /** Round completion celebration */
  roundComplete(): void {
    this.vibrate(HAPTIC_PATTERNS.roundComplete.pattern);
  }

  /** Game over pattern */
  gameOver(): void {
    this.vibrate(HAPTIC_PATTERNS.gameOver.pattern);
  }

  /** Victory celebration */
  victory(): void {
    this.vibrate(HAPTIC_PATTERNS.victory.pattern);
  }

  /** Player elimination */
  elimination(): void {
    this.vibrate(HAPTIC_PATTERNS.elimination.pattern);
  }

  /** Timer urgency warning */
  timerWarning(): void {
    this.vibrate(HAPTIC_PATTERNS.timerWarning.pattern);
  }

  /** Double tap confirmation */
  doubleTap(): void {
    this.vibrate(HAPTIC_PATTERNS.doubleTap.pattern);
  }

  /**
   * Custom pattern - for advanced use cases
   */
  custom(pattern: number | number[]): void {
    this.vibrate(pattern);
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const hapticService = new HapticService();

export default hapticService;

