import React from 'react';
import { requireNativeView } from 'expo';

import type { MonthGridProps } from './MonthGrid.types';

const NativeView: React.ComponentType<MonthGridProps> = requireNativeView('MonthGrid');

const MonthGridView = (props: MonthGridProps) => <NativeView {...props} />;

export default React.memo(MonthGridView);
