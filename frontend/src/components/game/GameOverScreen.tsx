/**
 * Game Over Screen Component
 * 
 * Displays the end game results with:
 * - Winner celebration with crown
 * - Final scoreboard with medals
 * - Game stats
 * - Play Again / Home buttons
 * - Share score functionality
 */

import { useEffect, useState } from 'react';
import { soundService } from '../../services/soundService';
import { hapticService } from '../../services/hapticService';

// =============================================================================
// TYPES
// =============================================================================

interface GameOverScreenProps {
  winner: {
    playerId: string;
    name: string;
    score: number;
  } | null;
  finalScores: Array<{
    playerId: string;
    name: string;
    score: number;
    isEliminated?: boolean;
  }>;
  currentPlayerId: string;
  roundsPlayed: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  gameCode: string;
}

// =============================================================================
// CONFETTI COMPONENT
// =============================================================================

const Confetti: React.FC = () => {
  // Neon arcade colors for confetti
  const colors = [
    'hsl(330, 100%, 60%)', // neon-pink
    'hsl(185, 100%, 50%)', // neon-cyan
    'hsl(120, 100%, 50%)', // neon-lime
    'hsl(35, 100%, 55%)',  // neon-amber
    'hsl(280, 100%, 60%)', // neon-purple
    '#ffd93d',
  ];
  
  // More confetti pieces for bigger celebration
  const confettiPieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 8,
    shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.5 ? 'square' : 'star',
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.shape !== 'star' ? piece.color : 'transparent',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: piece.shape === 'circle' ? '50%' : '0',
            boxShadow: `0 0 ${piece.size / 2}px ${piece.color}`,
            ...(piece.shape === 'star' ? {
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              backgroundColor: piece.color,
            } : {}),
          }}
        />
      ))}
    </div>
  );
};

// =============================================================================
// GAME OVER SCREEN COMPONENT
// =============================================================================

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  finalScores,
  currentPlayerId,
  roundsPlayed,
  onPlayAgain,
  onGoHome,
  gameCode,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const isWinner = winner?.playerId === currentPlayerId;
  const isSoloGame = finalScores.length === 1;

  // Animate score count-up
  useEffect(() => {
    if (!winner) return;
    
    const targetScore = winner.score;
    const duration = 1500; // 1.5 seconds
    const steps = 30;
    const increment = targetScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [winner]);

  // Play victory sound and haptics on mount
  useEffect(() => {
    soundService.playVictory();
    hapticService.victory();
    
    // Hide confetti after 6 seconds (longer celebration)
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Get medal emoji based on rank
  const getMedal = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  };

  // Share score functionality
  const handleShare = async () => {
    const myScore = finalScores.find(s => s.playerId === currentPlayerId)?.score || 0;
    const rank = finalScores.findIndex(s => s.playerId === currentPlayerId) + 1;
    
    const shareText = isSoloGame
      ? `🎮 I reached Round ${roundsPlayed} in Simon Says with ${myScore} points! Can you beat my score?`
      : `🏆 I finished #${rank} in Simon Says with ${myScore} points! ${isWinner ? '👑 WINNER!' : ''}`;
    
    const shareUrl = `${window.location.origin}/?join=${gameCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Simon Says Score',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error - fallback to copy
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(shareText + '\n' + shareUrl);
        }
      }
    } else {
      copyToClipboard(shareText + '\n' + shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden grid-pattern" style={{ background: 'hsl(var(--background))' }}>
      {/* Confetti */}
      {showConfetti && <Confetti />}
      
      <div className="relative z-10 w-full max-w-md">
        {/* Game Over Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold neon-text-pink pulse-neon mb-2">
            🎉 GAME OVER 🎉
          </h1>
        </div>

        {/* Winner Section - Elite Celebration */}
        {winner && (
          <div className="arcade-frame p-6 mb-4 text-center relative overflow-hidden neon-border-amber animate-pop-in">
            {/* Animated glow rings */}
            <div className="absolute inset-0 bg-neon-amber/10 animate-pulse-glow" />
            <div className="absolute inset-2 rounded-lg border border-neon-amber/30 animate-pulse-glow" style={{ animationDelay: '200ms' }} />
            
            <div className="relative z-10">
              {/* Crown with elite float animation */}
              <div className="text-6xl mb-3 animate-crown-float">👑</div>
              
              <h2 className="text-2xl font-orbitron font-bold neon-text-amber mb-2 animate-victory-bounce">
                {isSoloGame ? 'GREAT JOB!' : '🏆 WINNER! 🏆'}
              </h2>
              
              <div className="text-xl font-space font-semibold mb-2 animate-fade-in" style={{ color: 'hsl(var(--foreground))', animationDelay: '300ms' }}>
                {winner.name}
              </div>
              
              {/* Animated score counter */}
              <div className="text-5xl font-orbitron font-bold neon-text-amber animate-score-count">
                {animatedScore} <span className="text-lg">points</span>
              </div>
              
              {isWinner && !isSoloGame && (
                <div className="mt-3 neon-text-lime text-sm font-space font-semibold animate-pulse-scale">
                  ✨ That's YOU! ✨
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scoreboard (Multiplayer only) */}
        {!isSoloGame && finalScores.length > 0 && (
          <div className="arcade-frame p-4 mb-4 neon-border-cyan">
            <h3 className="font-orbitron font-bold text-center mb-3 text-sm uppercase tracking-wide neon-text-cyan">
              Final Standings
            </h3>
            
            <div className="space-y-2">
              {finalScores.map((player, index) => {
                const isCurrentPlayer = player.playerId === currentPlayerId;
                const rank = index + 1;
                
                return (
                  <div
                    key={player.playerId}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                      isCurrentPlayer
                        ? 'bg-neon-cyan/30 scale-105 neon-border-cyan'
                        : rank <= 3
                          ? 'bg-muted'
                          : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl w-8 text-center">
                        {getMedal(rank)}
                      </span>
                      <span className={`font-space font-medium ${isCurrentPlayer ? 'neon-text-cyan' : 'text-foreground'}`}>
                        {player.name}
                        {isCurrentPlayer && <span className="text-xs ml-1 neon-text-cyan">(you)</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-orbitron font-bold ${isCurrentPlayer ? 'neon-text-cyan' : 'text-foreground'}`}>
                        {player.score} pts
                      </span>
                      {player.isEliminated && (
                        <span className="neon-text-pink text-xs">💀</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Game Stats */}
        <div className="arcade-frame p-4 mb-6 neon-border-purple">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-orbitron font-bold neon-text-purple">{roundsPlayed}</div>
              <div className="text-xs font-space" style={{ color: 'hsl(var(--muted-foreground))' }}>Rounds</div>
            </div>
            <div className="border-l border-border" />
            <div>
              <div className="text-2xl font-orbitron font-bold neon-text-cyan">
                {finalScores.find(s => s.playerId === currentPlayerId)?.score || 0}
              </div>
              <div className="text-muted-foreground text-xs font-space">Your Score</div>
            </div>
            {!isSoloGame && (
              <>
                <div className="border-l border-border" />
                <div>
                  <div className="text-2xl font-orbitron font-bold neon-text-amber">
                    #{finalScores.findIndex(s => s.playerId === currentPlayerId) + 1}
                  </div>
                  <div className="text-muted-foreground text-xs font-space">Your Rank</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons - Elite Touch Feedback */}
        <div className="space-y-3">
          {/* Play Again Button - Primary Action */}
          <button
            onClick={() => {
              hapticService.buttonPress();
              onPlayAgain();
            }}
            className="w-full bg-neon-lime hover:brightness-110 text-background font-arcade py-4 px-6 rounded-xl text-lg flex items-center justify-center gap-2 neon-border-lime animate-pulse-glow btn-glow-press"
            style={{ touchAction: 'manipulation' }}
          >
            🔄 PLAY AGAIN
          </button>

          {/* Home Button */}
          <button
            onClick={() => {
              hapticService.light();
              onGoHome();
            }}
            className="w-full hover:brightness-110 font-arcade py-4 px-6 rounded-xl text-lg flex items-center justify-center gap-2 neon-border btn-press"
            style={{
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
              touchAction: 'manipulation'
            }}
          >
            🏠 HOME
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              hapticService.medium();
              handleShare();
            }}
            className="w-full hover:brightness-110 font-arcade py-3 px-6 rounded-xl flex items-center justify-center gap-2 neon-border-cyan animate-pulse-glow btn-glow-press"
            style={{
              backgroundColor: 'hsl(var(--neon-cyan))',
              color: 'hsl(var(--background))',
              touchAction: 'manipulation'
            }}
          >
            📤 SHARE SCORE
          </button>
        </div>
      </div>

      {/* CSS animations are now in elite-animations.css */}
    </div>
  );
};

export default GameOverScreen;
