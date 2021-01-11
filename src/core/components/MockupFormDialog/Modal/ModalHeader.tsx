import * as React from 'react';
import { initializeTheme } from '../Theme';
initializeTheme();

import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    IconButton,
    IIconProps
  } from 'office-ui-fabric-react';

const theme = getTheme();
const contentStyles = mergeStyleSets({
header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
    flex: '1 1 auto',
    borderTop: `4px solid ${theme.palette.themePrimary}`,
    color: theme.palette.neutralPrimary,
    display: 'flex',
    alignItems: 'center',
    fontWeight: FontWeights.semibold,
    padding: '12px 12px 14px 24px',
    },
]
});

const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };

const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const ModalHeader: React.FunctionComponent = () => {

    return (
        <div className={contentStyles.header}>
          <span>Ahoro 1 - Promo descuento</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
          />
        </div>
    );
};