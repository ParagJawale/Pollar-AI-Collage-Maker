
import React from 'react';
import { PolarBearIcon } from './icons';

export default function Header() {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-3">
        <PolarBearIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 text-transparent bg-clip-text">
          Pollar AI Collage Maker
        </h1>
      </div>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        Turn your photos into stunning, dynamic collages with the power of AI.
      </p>
    </header>
  );
}