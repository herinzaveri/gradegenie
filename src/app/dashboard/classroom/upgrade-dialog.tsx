'use client';

import type {ReactNode} from 'react';

interface UpgradeDialogProps {
  children: ReactNode
}

export const UpgradeDialog = ({children}: UpgradeDialogProps) => {
  // Simply render the children directly without the paywall dialog
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
