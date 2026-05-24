import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Line,
  Path,
  Stop,
} from 'react-native-svg';
import { COLORS } from '../constants/Theme';

interface PortfolioChartProps {
  data: number[];
}

const CHART_HEIGHT = 200;
const CHART_WIDTH = 320;
const PADDING = 20;

function buildLinePath(data: number[]) {
  if (data.length === 0) {
    return '';
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerWidth = CHART_WIDTH - PADDING * 2;
  const innerHeight = CHART_HEIGHT - PADDING * 2;
  const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  return data
    .map((value, index) => {
      const x = PADDING + step * index;
      const y = PADDING + innerHeight - ((value - min) / range) * innerHeight;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyTitle}>No chart data yet</Text>
        <Text style={styles.emptyText}>Portfolio history will appear once live snapshots are available.</Text>
      </View>
    );
  }

  const linePath = buildLinePath(data);

  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      >
        <Defs>
          <LinearGradient id="chartStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.7} />
            <Stop offset="100%" stopColor={COLORS.primary} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        {[0, 1, 2, 3].map(index => {
          const y = PADDING + index * ((CHART_HEIGHT - PADDING * 2) / 3);
          return (
            <Line
              key={index}
              x1={PADDING}
              x2={CHART_WIDTH - PADDING}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          );
        })}
        <Path
          d={linePath}
          fill="none"
          stroke="url(#chartStroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
