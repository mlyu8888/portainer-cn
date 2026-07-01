import { CellContext } from '@tanstack/react-table';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';

import { ContainerRowData } from '../types';

import { columnHelper } from './helper';

export const status = columnHelper.accessor('status', {
  header: '状态',
  cell: StatusCell,
});

function StatusCell({
  getValue,
}: CellContext<ContainerRowData, ContainerRowData['status']>) {
  const statusData = getValue();

  return (
    <Badge type={statusData.type}>
      <div className="flex items-center gap-1">
        <span>
          {statusData.status}
          {statusData.restartCount &&
            `（已重启 ${statusData.restartCount} 次）`}
        </span>
      </div>
      {statusData.message && <Tooltip message={statusData.message} />}
    </Badge>
  );
}
