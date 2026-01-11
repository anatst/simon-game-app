/**
 * Game Page
 * 
 * Main game screen that shows the Simon board with a Start button overlay
 * when the game hasn't started yet.
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSimonStore } from '../store/simonStore';
import { socketService } from '../services/socketService';
import { soundService } from '../services/soundService';
import { CircularSimonBoard } from '../components/game/CircularSimonBoard';
import { GameOverScreen } from '../components/game/GameOverScreen';
import { Toast } from '../components/ui/Toast';
import { MuteButton } from '../components/ui/MuteButton';

export function GamePage() {
  const navigate = useNavigate();
  const { session, clearSession } = useAuthStore();
  const gameCode = session?.gameCode;
  const playerId = session?.playerId;
  
  const { 
    isGameActive, 
    currentSequence, 
    currentRound, 
    isShowingSequence,
    isInputPhase,
    playerSequence,
    canSubmit,
    lastResult,
    message,
    secondsRemaining,
    timerColor,
    isTimerPulsing,
    isEliminated,
    scores,
    submittedPlayers,
    isGameOver,
    gameWinner,
    finalScores,
    initializeListeners,
    cleanup,
    addColorToSequence,
    submitSequence,
    resetGame,
  } = useSimonStore();
  
  const [roomStatus, setRoomStatus] = useState<'waiting' | 'countdown' | 'active'>('waiting');
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [isHost, setIsHost] = useState(session?.isHost || false);
  const [players, setPlayers] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const lastCountdownValue = useRef<number | null>(null);
  
  // Redirect to entry if no session
  useEffect(() => {
    if (!session) {
      navigate('/entry');
    }
  }, [session, navigate]);
  
  // Initialize on mount
  useEffect(() => {
    if (!gameCode || !playerId) return;
    
    console.log('🎮 GamePage mounted');
    
    // CRITICAL FIX: Connect socket FIRST, then initialize listeners
    const socket = socketService.connect();
    console.log('✅ Socket connected:', socket.connected);
    
    // Initialize Simon listeners AFTER socket is connected
    initializeListeners();
    
    // Join room via socket
    if (gameCode && playerId) {
      socket.emit('join_room_socket', { gameCode, playerId });
    }
    
    // Listen for initial room state (ONCE to avoid race condition)
    socket.once('room_state', (room: any) => {
      console.log('📦 Initial room state:', room);
      setPlayers(room.players || []);
      setRoomStatus(room.status);
      
      // Check if we're the host
      const me = room.players?.find((p: any) => p.id === playerId);
      const isHostPlayer = me?.isHost || false;
      console.log('🎮 isHost check:', { playerId, me, isHostPlayer });
      setIsHost(isHostPlayer);
    });
    
    // Listen for room state updates (when players join/leave)
    socket.on('room_state_update', (room: any) => {
      console.log('🔄 Room state updated:', room);
      setPlayers(room.players || []);
      setRoomStatus(room.status);
      
      // Check if we're the host
      const me = room.players?.find((p: any) => p.id === playerId);
      setIsHost(me?.isHost || false);
    });
    
    // Listen for errors
    socket.on('error', (data: { message: string }) => {
      console.error('❌ Server error:', data.message);
      setToast({ message: data.message, type: 'error' });
    });
    
    // Listen for countdown
    socket.on('countdown', (data: { count: number }) => {
      console.log('⏳ Countdown:', data.count);
      setRoomStatus('countdown');
      setCountdownValue(data.count);
      
      // 🔊 Play countdown beep (only once per second)
      if (lastCountdownValue.current !== data.count) {
        soundService.playCountdown(data.count);
        lastCountdownValue.current = data.count;
      }
      
      if (data.count === 0) {
        setRoomStatus('active');
        setCountdownValue(null);
        lastCountdownValue.current = null;
      }
    });
    
    // Listen for player joined (for real-time feedback)
    socket.on('player_joined', (player: any) => {
      console.log('👋 Player joined:', player);
    });
    
    // Listen for player left
    socket.on('player_left', (data: { playerId: string }) => {
      console.log('👋 Player left:', data.playerId);
      setPlayers(prev => prev.filter(p => p.id !== data.playerId));
    });
    
    // Listen for game restarted (Play Again)
    socket.on('game_restarted', (data: { gameCode: string }) => {
      console.log('🔄 Game restarted:', data.gameCode);
      // Reset local state to waiting room
      resetGame();
      setRoomStatus('waiting');
      lastCountdownValue.current = null;
    });
    
    // Cleanup on unmount
    return () => {
      cleanup();
      socket.off('room_state');
      socket.off('room_state_update');
      socket.off('error');
      socket.off('countdown');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('game_restarted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode, playerId]);
  
  // Handle start game (host only)
  const handleStartGame = async () => {
    console.log('🎮 DEBUG: handleStartGame called');
    console.log('🎮 DEBUG: gameCode:', gameCode);
    console.log('🎮 DEBUG: playerId:', playerId);
    console.log('🎮 DEBUG: isHost:', isHost);
    
    // 🔊 Initialize sound on user interaction
    await soundService.init();
    
    const socket = socketService.getSocket();
    console.log('🎮 DEBUG: socket exists:', !!socket);
    console.log('🎮 DEBUG: socket connected:', socket?.connected);
    
    if (!socket) {
      console.error('❌ No socket connection');
      setToast({ message: 'No connection to server', type: 'error' });
      return;
    }
    
    if (!gameCode || !playerId) {
      console.error('❌ Missing gameCode or playerId');
      setToast({ message: 'Missing game info', type: 'error' });
      return;
    }
    
    console.log('📤 Emitting start_game:', { gameCode, playerId });
    socket.emit('start_game', { gameCode, playerId });
  };
  
  // Handle Play Again
  const handlePlayAgain = () => {
    // Reset local game state
    resetGame();
    setRoomStatus('waiting');
    
    // Emit restart_game to reset room on server
    const socket = socketService.getSocket();
    if (socket && gameCode && playerId) {
      console.log('🔄 Restarting game:', { gameCode, playerId });
      socket.emit('restart_game', { gameCode, playerId });
    }
  };

  // Handle Go Home
  const handleGoHome = () => {
    cleanup();
    clearSession();
    navigate('/entry');
  };
  
  // Render Game Over screen
  if (isGameOver) {
    return (
      <>
        <MuteButton />
        <GameOverScreen
          winner={gameWinner}
          finalScores={finalScores}
          currentPlayerId={playerId || ''}
          roundsPlayed={currentRound}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
          gameCode={gameCode || ''}
        />
      </>
    );
  }

  // Render countdown
  if (roomStatus === 'countdown' && countdownValue !== null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold text-gray-800 mb-4">{countdownValue}</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-800">Get ready!</p>
        </div>
      </div>
    );
  }

  // Render game board (always visible, with start overlay when waiting)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4 relative">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Mute Button */}
      <MuteButton />
      
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Scoreboard - only show when game is active */}
        {isGameActive && Object.keys(scores).length > 0 && (
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-2 sm:p-3 mb-3 w-full">
            <div className="space-y-1">
              {players.map((player) => {
                const score = scores[player.id] || 0;
                const hasSubmitted = submittedPlayers.includes(player.id);
                const isCurrentPlayer = player.id === playerId;
                
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded ${
                      isCurrentPlayer ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    <span className="text-white text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                      <span>{player.avatar}</span>
                      <span>{player.displayName}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs sm:text-sm font-bold">
                        {score} pts
                      </span>
                      {hasSubmitted && isInputPhase && (
                        <span className="text-green-400 text-xs">✓</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Eliminated Message */}
        {isEliminated && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl sm:rounded-2xl p-3 mb-3 text-center w-full">
            <div className="text-3xl mb-1">💀</div>
            <div className="text-white text-base sm:text-lg font-bold">
              Eliminated!
            </div>
          </div>
        )}
        
        {/* Game Board Container - always visible */}
        <div className="relative w-full">
          <CircularSimonBoard
            sequence={currentSequence}
            round={currentRound}
            isShowingSequence={isShowingSequence}
            isInputPhase={isInputPhase}
            playerSequence={playerSequence}
            canSubmit={canSubmit}
            lastResult={lastResult}
            onColorClick={addColorToSequence}
            onSubmit={() => {
              if (gameCode && playerId) {
                submitSequence(gameCode, playerId);
              }
            }}
            disabled={isEliminated || roomStatus === 'waiting'}
            secondsRemaining={secondsRemaining}
            timerColor={timerColor}
            isTimerPulsing={isTimerPulsing}
          />
          
          {/* Start Button Overlay - shown when game is waiting */}
          {roomStatus === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm rounded-full p-6 shadow-2xl pointer-events-auto">
                <button
                  onClick={handleStartGame}
                  disabled={!isHost && players.length > 1}
                  className={`
                    bg-green-500 hover:bg-green-600 active:bg-green-700 
                    text-white font-bold py-4 px-8 rounded-full 
                    transition-all duration-200 text-xl sm:text-2xl
                    min-h-[80px] min-w-[200px]
                    ${!isHost && players.length > 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'shadow-lg active:scale-95'
                    }
                  `}
                  style={{ touchAction: 'manipulation' }}
                >
                  {!isHost && players.length > 1 ? (
                    'Waiting for host...'
                  ) : (
                    '▶️ START'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Display */}
        {roomStatus === 'active' && (
          <div className="mt-6 text-center">
            <p className="text-gray-800 text-lg font-medium">{message}</p>
          </div>
        )}
        
        {/* Players Status - only show when waiting */}
        {roomStatus === 'waiting' && players.length > 0 && (
          <div className="mt-8 bg-gray-100 rounded-2xl p-4 w-full">
            <h3 className="text-gray-800 font-bold mb-2 text-center">
              Players ({players.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {players.map(player => (
                <div key={player.id} className="text-gray-700 text-sm text-center">
                  {player.avatar} {player.displayName} {player.isHost && '👑'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

