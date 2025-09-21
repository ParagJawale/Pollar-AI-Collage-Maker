
import React from 'react';
import { SparklesIcon } from './icons';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-gentle-pulse-spin">
        <SparklesIcon className="h-16 w-16 text-indigo-400" />
      </div>
    </div>
  );
}