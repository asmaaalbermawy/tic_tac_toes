'use client';

import { useSearchParams } from 'next/navigation';

const players = {
  X: { name: 'Player X', avatar: '/father_robot.jpg' },
  O: { name: 'Player O', avatar: '/asmaa_robot.jpg' },
};

export default function PDFPage() {
  const params = useSearchParams();
  const x = params.get('x');
  const o = params.get('o');
  const winner = params.get('winner');

  const winnerImage = winner && winner !== 'draw' ? players[winner as 'X' | 'O'].avatar : null;
  const winnerName = winner === 'X' ? 'Player X' : winner === 'O' ? 'Player O' : 'Draw';

  return (
    <div
      className="relative text-black w-full min-h-screen flex flex-col items-center justify-center p-10"
      style={{
        backgroundImage: winnerImage ? `url(${winnerImage})` : 'none',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-md shadow-xl w-full max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Tic-tac-toe Results 🎉</h1>
        <p className="text-lg mb-2"><strong>Player X(X):</strong> {x}</p>
        <p className="text-lg mb-2"><strong>Player O(O):</strong> {o}</p>
        <p className="text-xl font-semibold mt-4">
          {winner === 'draw'
            ? '😅 The game ended in a draw!'
            : `🏆 ${winnerName} wins!`}
        </p>
        <p className="mt-10 text-gray-500 text-sm">Auto-exported </p>
      </div>
    </div>
  );
}
