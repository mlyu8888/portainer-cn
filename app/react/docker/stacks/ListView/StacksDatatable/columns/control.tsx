import { CellContext } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { PropsWithChildren } from 'react';

import {
  isExternalStack,
  isOrphanedStack,
  isRegularStack,
} from '@/react/docker/stacks/view-models/utils';

import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Icon } from '@@/Icon';

import { DecoratedStack } from '../types';

import { columnHelper } from './helper';

export const control = columnHelper.display({
  header: '操作',
  id: 'control',
  cell: ControlCell,
  enableHiding: false,
});

function ControlCell({
  row: { original: item },
}: CellContext<DecoratedStack, unknown>) {
  if (isRegularStack(item)) {
    return <>总计</>;
  }

  if (isExternalStack(item)) {
    return (
      <Warning tooltip="此堆栈是在 Portainer 外部创建的，对此堆栈的操作受限。">
        受限
      </Warning>
    );
  }

  if (isOrphanedStack(item)) {
    return (
      <Warning tooltip="此堆栈创建于一个已不再注册到 Portainer 的环境中。">
        孤立
      </Warning>
    );
  }

  return null;
}

function Warning({
  tooltip,
  children,
}: PropsWithChildren<{ tooltip: string }>) {
  return (
    <TooltipWithChildren message={tooltip}>
      <span className="flex items-center gap-2">
        {children}
        <Icon icon={AlertCircle} mode="warning" />
      </span>
    </TooltipWithChildren>
  );
}
