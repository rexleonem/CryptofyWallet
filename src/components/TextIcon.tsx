import React from 'react';

import CryptofyIcon, { CryptofyIconName } from './icons/CryptofyIcon';

interface TextIconProps {
  label: string;
  size?: number;
  color?: string;
}

const iconMap: Record<string, CryptofyIconName> = {
  AI: 'ai',
  B: 'shield',
  C: 'wallet',
  D: 'device',
  F: 'filter',
  ID: 'user',
  L: 'lock',
  O: 'orbit',
  OK: 'check',
  P: 'transfer',
  R: 'refresh',
  S: 'shield',
  X: 'arrowDown',
  '@': 'mail',
  '#': 'payment',
  '%': 'analytics',
  '*': 'spark',
  '+': 'arrowUp',
  '-': 'arrowDown',
  '<': 'arrowDown',
  '>': 'chevronRight',
  '?': 'search',
  '!': 'shield',
};

export default function TextIcon({ label, size = 18, color = '#FFFFFF' }: TextIconProps) {
  return <CryptofyIcon name={iconMap[label] || 'spark'} size={size} color={color} />;
}
