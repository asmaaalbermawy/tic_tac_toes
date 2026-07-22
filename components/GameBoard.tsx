'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/globals.css';

type Player = 'X' | 'O' | null;

const players = {
  X: { name: 'Player X', avatar: '/father_robot.jpg' },
  O: { name: 'Play O', avatar: '/asmaa_robot.jpg' },
};

export default function BirthdayGame() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });

  const startGame = () => setShowStartScreen(false);

  const checkWinner = (squares: Player[]): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(Boolean) ? 'draw' : null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      if (result !== 'draw') {
        setScore(prev => ({ ...prev, [result]: prev[result] + 1 }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const openPDF = () => {
    const url = `/pdf?x=${score.X}&o=${score.O}&winner=${winner ?? 'draw'}`;
    window.open(url, '_blank');
  };

  const renderCell = (cell: Player, index: number) => (
    <motion.button
      key={index}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleClick(index)}
      className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] bg-white rounded-md shadow-md overflow-hidden relative"
    >
      {cell && (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={players[cell].avatar}
            alt={players[cell].name}
            fill
            className="object-cover"
          />
        </motion.div>
      )}
    </motion.button>
  );

  return (
    <div className="relative bg-confetti-pattern flex flex-col items-center justify-center min-h-screen overflow-hidden p-4">
      {/* Start Screen */}
      <AnimatePresence>
        {showStartScreen && (
          <motion.div
            className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h1
              className="text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-[0_0_12px_rgba(255,255,0,0.8)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              🎮 Ready Player!
            </motion.h1>

            {/* Floating Avatars */}
            <div className="relative w-full h-[220px] mb-10">
              {(['X', 'O'] as Player[]).map((p, i) => (
                <motion.div
                  key={p}
                  animate={{ y: [0, -40, 0] }}
                  transition={{ repeat: Infinity, duration: 2 + i, ease: 'easeInOut' }}
                  className={`absolute ${i === 0 ? 'left-1/4' : 'right-1/4'} top-0 flex flex-col items-center`}
                >
                  <div className="rounded-full overflow-hidden border-4 border-yellow-300 shadow-lg">
                    <Image
                      src={players[p].avatar}
                      alt={players[p].name}
                      width={120}
                      height={120}
                      className="object-cover w-[120px] h-[120px]"
                    />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">{players[p].name}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-4 bg-yellow-400 text-black rounded-xl font-extrabold text-xl shadow-lg hover:bg-yellow-500 transition"
            >
              ✨ Start Game
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Board */}
      {!showStartScreen && (
        <>
          {/* Score Display */}
          <div className="mb-4 text-white text-lg font-semibold flex gap-8 items-center justify-center">
            {(['X', 'O'] as Player[]).map(p => (
              <div key={p} className="flex items-center gap-2">
                <Image src={players[p].avatar} alt={players[p].name} width={36} height={36} className="rounded-full" />
                <span>{players[p].name}: {score[p]}</span>
              </div>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-yellow-400 mb-4 drop-shadow-[0_0_6px_rgba(255,255,0,0.8)]">
            Tic-tac-toe
          </h1>

          {/* Game Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            {board.map((cell, index) => renderCell(cell, index))}
          </div>

          {/* Status Message */}
          <div className="text-lg text-amber-300 font-semibold text-center mb-2 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]">
            {winner && winner !== 'draw'
              ? `🏆 ${players[winner].name} wins!`
              : winner === 'draw'
              ? '😅 It\'s a draw!'
              : `🤖 Turn: ${players[currentPlayer!].name}`}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={resetGame}
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              🔁 Restart Game
            </button>
            <button
              onClick={openPDF}
              className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              🖨️ Show the result
            </button>
          </div>
        </>
      )}
    </div>
  );
}
