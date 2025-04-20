import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const TYPOGRAPHY = StyleSheet.create({
  h1: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.text,
  },
  h2: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    lineHeight: 29,
    color: COLORS.text,
  },
  h3: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.text,
  },
  body: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  bodyBold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  caption: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  button: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    textTransform: 'uppercase',
    color: COLORS.text,
  },
  small: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textTertiary,
  },
});