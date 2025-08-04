import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiCard: Components<Theme>['MuiCard'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      boxShadow: theme.vars.customShadows.z4,
      borderRadius: theme.shape.borderRadius * 2,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
      '& .MuiCardHeader-root': {
        alignItems: 'start',
        [theme.breakpoints.down('md')]: {
          display: 'center',
        },
      },
      '& .MuiCardHeader-subheader': {
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
      '& .MuiCardHeader-avatar': {
        marginRight: theme.spacing(1),
      },
      '& .MuiCardHeader-avatar svg': {
        [theme.breakpoints.down('md')]: {
          width: 32,
          height: 32,
        },
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    titleTypographyProps: { variant: 'h6' },
    subheaderTypographyProps: { variant: 'body2', marginTop: '4px' },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(3, 3, 0) }) },
};

// ----------------------------------------------------------------------

const MuiCardContent: Components<Theme>['MuiCardContent'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(3) }) },
};

// ----------------------------------------------------------------------

export const card = { MuiCard, MuiCardHeader, MuiCardContent };
