jest.mock('react-native-reanimated', () => {
  const ReactNative = require('react-native');
  return {
    __esModule: true,
    default: {
      View: ReactNative.View,
      createAnimatedComponent: (component) => component,
    },
    Easing: {
      cubic: jest.fn(),
      out: jest.fn((value) => value),
      inOut: jest.fn((value) => value),
    },
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (factory) => factory(),
    withTiming: (value) => value,
    withDelay: (_delay, value) => value,
    withRepeat: (value) => value,
    withSequence: (...values) => values[values.length - 1],
  };
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(),
}));
