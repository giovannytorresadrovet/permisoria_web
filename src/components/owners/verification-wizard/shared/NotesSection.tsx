'use client';

import React from 'react';
import { Warning } from 'phosphor-react';

interface NotesSectionProps {
  title?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  warning?: string | null;
  label?: string;
}

export default function NotesSection({
  title = 'Notes',
  value,
  onChange,
  placeholder = 'Add notes...',
  rows = 4,
  warning = null,
  label
}: NotesSectionProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-gray-700 mb-4">
      {title && (
        <h3 className="text-gray-200 font-medium mb-2">{title}</h3>
      )}
      
      {label && (
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
      )}
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
      />
      
      {warning && (
        <div className="mt-2 p-2 bg-amber-900/30 border border-amber-700/50 rounded flex items-start">
          <Warning size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-amber-300 text-sm">{warning}</span>
        </div>
      )}
      
      <div className="mt-2 flex justify-end">
        <span className="text-xs text-gray-500">
          {value.length} characters
        </span>
      </div>
    </div>
  );
} 