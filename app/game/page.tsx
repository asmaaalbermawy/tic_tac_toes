'use client';

import GameBoard from '@/components/GameBoard';
import '@/styles/globals.css';

export default function GamePage() {
  return (
    <div className="bg-confetti-pattern flex items-center justify-center min-h-screen">
      <GameBoard />
    </div>
  );
}
