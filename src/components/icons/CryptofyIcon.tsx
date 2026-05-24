import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

export type CryptofyIconName =
  | 'ai'
  | 'analytics'
  | 'arrowDown'
  | 'arrowUp'
  | 'bell'
  | 'buy'
  | 'card'
  | 'check'
  | 'chevronRight'
  | 'dashboard'
  | 'device'
  | 'eye'
  | 'eyeOff'
  | 'filter'
  | 'lock'
  | 'mail'
  | 'orbit'
  | 'payment'
  | 'percent'
  | 'profile'
  | 'refresh'
  | 'search'
  | 'send'
  | 'shield'
  | 'spark'
  | 'swap'
  | 'transfer'
  | 'user'
  | 'wallet';

interface CryptofyIconProps {
  name: CryptofyIconName;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

const common = {
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export default function CryptofyIcon({
  name,
  color = '#FFFFFF',
  size = 24,
  strokeWidth = 1.9,
}: CryptofyIconProps) {
  const stroke = color;

  const renderIcon = () => {
    switch (name) {
      case 'dashboard':
        return (
          <>
            <Rect x="4" y="4" width="7" height="7" rx="2.2" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Rect x="13" y="4" width="7" height="10" rx="2.2" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Rect x="4" y="13" width="7" height="7" rx="2.2" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M14 18h5M16.5 15.5v5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'analytics':
        return (
          <>
            <Path d="M4 17.5c2.7-4.7 4.9-6.1 7.2-4.2 2 1.7 4.2.9 8.8-5.2" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M4 5v14.5h16" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Circle cx="11.1" cy="13.1" r="1.35" fill={stroke} />
          </>
        );
      case 'bell':
        return (
          <>
            <Path d="M6.5 10.5a5.5 5.5 0 0 1 11 0c0 3.1 1.2 4.4 2.1 5.5H4.4c.9-1.1 2.1-2.4 2.1-5.5z" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M10 19a2.2 2.2 0 0 0 4 0" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'eye':
        return (
          <>
            <Path d="M3.8 12s3-5.5 8.2-5.5S20.2 12 20.2 12s-3 5.5-8.2 5.5S3.8 12 3.8 12z" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Circle cx="12" cy="12" r="2.4" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'eyeOff':
        return (
          <>
            <Path d="M4 4l16 16M9.2 6.9A8.8 8.8 0 0 1 12 6.5c5.2 0 8.2 5.5 8.2 5.5a15 15 0 0 1-2.5 3.1M14.2 14.3A2.7 2.7 0 0 1 9.7 9.8M6.6 8.3A15 15 0 0 0 3.8 12s3 5.5 8.2 5.5c1 0 1.9-.2 2.8-.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'swap':
        return (
          <>
            <Path d="M7 7h9.5l-2.8-2.8M17 7l-3.3 3.2M17 17H7.5l2.8 2.8M7 17l3.3-3.2" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'buy':
        return (
          <>
            <Circle cx="12" cy="12" r="8" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M12 8v8M8 12h8" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'ai':
        return (
          <>
            <Path d="M12 3.5l1.6 4.1 4.1 1.6-4.1 1.6L12 15l-1.6-4.2-4.1-1.6 4.1-1.6L12 3.5z" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M18 14l.8 2.1L21 17l-2.2.9L18 20l-.9-2.1L15 17l2.1-.9L18 14z" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Circle cx="6.3" cy="17.7" r="1.4" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'transfer':
        return (
          <>
            <Path d="M7 7h10l-3-3M17 17H7l3 3" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M17 7l-3 3M7 17l3-3" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'profile':
        return (
          <>
            <Circle cx="12" cy="8.2" r="3.2" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M18.8 6.2l1.4.8M18.8 10.2l1.4-.8" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'send':
        return <Path d="M5 12h13M13 6l6 6-6 6" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'arrowDown':
        return <Path d="M12 5v14M6.5 13.5L12 19l5.5-5.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'arrowUp':
        return <Path d="M12 19V5M6.5 10.5L12 5l5.5 5.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'card':
        return (
          <>
            <Rect x="3.5" y="6" width="17" height="12" rx="3" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M3.8 10h16.4M7 14.5h3.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'wallet':
        return (
          <>
            <Path d="M4 7.5h14.5A2.5 2.5 0 0 1 21 10v6.5a2.5 2.5 0 0 1-2.5 2.5h-12A3.5 3.5 0 0 1 3 15.5v-9A2.5 2.5 0 0 1 5.5 4H17" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M16 12.2h5v3.6h-5a1.8 1.8 0 0 1 0-3.6z" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'shield':
        return <Path d="M12 3.5l7 2.6v5.3c0 4.5-2.6 7.6-7 9.1-4.4-1.5-7-4.6-7-9.1V6.1l7-2.6z" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'check':
        return <Path d="M5 12.5l4.2 4.1L19 7" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'spark':
        return <Path d="M12 3.5l1.7 5 5 1.8-5 1.7-1.7 5-1.8-5-5-1.7 5-1.8L12 3.5z" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'orbit':
        return (
          <>
            <Circle cx="12" cy="12" r="2.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M4.8 9.2c2.7-4.6 7.5-6.4 10.7-4.1 3.3 2.3 3.7 7.9 1 12.4M19.2 14.8c-2.7 4.6-7.5 6.4-10.7 4.1-3.3-2.3-3.7-7.9-1-12.4" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'filter':
        return <Path d="M5 7h14M8 12h8M10.5 17h3" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'search':
        return (
          <>
            <Circle cx="10.5" cy="10.5" r="5.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M15 15l4 4" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'payment':
        return <Path d="M6 9h12M7 14h4M5 5.5h14A2.5 2.5 0 0 1 21.5 8v8A2.5 2.5 0 0 1 19 18.5H5A2.5 2.5 0 0 1 2.5 16V8A2.5 2.5 0 0 1 5 5.5z" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'device':
        return (
          <>
            <Rect x="7" y="3.5" width="10" height="17" rx="2.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Line x1="10.5" y1="17" x2="13.5" y2="17" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'lock':
        return (
          <>
            <Rect x="5" y="10" width="14" height="10" rx="3" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M8 10V7.8a4 4 0 0 1 8 0V10" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'mail':
        return (
          <>
            <Rect x="3.5" y="5.5" width="17" height="13" rx="3" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M5 8l7 5 7-5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'user':
        return (
          <>
            <Circle cx="12" cy="8" r="3.2" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Path d="M5.5 19.5c.9-3.7 3-5.5 6.5-5.5s5.6 1.8 6.5 5.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      case 'refresh':
        return <Path d="M19 8a7 7 0 0 0-12-2l-2 2M5 6v5h5M5 16a7 7 0 0 0 12 2l2-2M19 18v-5h-5" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'chevronRight':
        return <Path d="M9 5.5l6.5 6.5L9 18.5" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'percent':
        return (
          <>
            <Path d="M6 18L18 6" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Circle cx="7.2" cy="7.2" r="1.8" {...common} stroke={stroke} strokeWidth={strokeWidth} />
            <Circle cx="16.8" cy="16.8" r="1.8" {...common} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );
      default:
        return <Circle cx="12" cy="12" r="7" {...common} stroke={stroke} strokeWidth={strokeWidth} />;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderIcon()}
    </Svg>
  );
}
