import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
import { COLORS } from '../constants/Theme';

interface PortfolioChartProps {
  data: number[];
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <View style={styles.container}>
      <LineChart
        style={{ height: 200 }}
        data={data}
        contentInset={{ top: 20, bottom: 20 }}
        curve={shape.curveNatural}
        svg={{ stroke: COLORS.primary, strokeWidth: 3 }}
      >
        <Grid svg={{ stroke: 'rgba(255,255,255,0.05)' }} />
        <Defs>
          <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
            <Stop offset={'0%'} stopColor={COLORS.primary} stopOpacity={0.2} />
            <Stop offset={'100%'} stopColor={COLORS.primary} stopOpacity={0} />
          </LinearGradient>
        </Defs>
      </LineChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
