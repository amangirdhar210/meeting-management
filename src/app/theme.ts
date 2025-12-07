import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{slate.700}',
          hoverColor: '{slate.800}',
          activeColor: '{slate.900}',
        },
        highlight: {
          background: '{slate.700}',
          focusBackground: '{slate.800}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
      dark: {
        primary: {
          color: '{slate.400}',
          hoverColor: '{slate.300}',
          activeColor: '{slate.200}',
        },
        highlight: {
          background: 'rgba(148, 163, 184, .16)',
          focusBackground: 'rgba(148, 163, 184, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});
