import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.56)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
  },
  taglineWrap: {
    position: 'absolute',
    bottom: 56,
  },
});
