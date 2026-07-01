import { NodeCondition } from 'kubernetes-types/core/v1';
import { CellContext } from '@tanstack/react-table';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';

import { NodeRowData } from '../types';

import { columnHelper } from './helper';

export const conditions = columnHelper.accessor((row) => getConditions(row), {
  header: () => (
    <>
      条件
      <Tooltip
        position="top"
        message="空表示节点健康。橙色表示节点遇到 MemoryPressure、DiskPressure、NetworkUnavailable 或 PIDPressure。"
      />
    </>
  ),
  id: 'conditions',
  cell: ConditionsCell,
});

function ConditionsCell({
  row: { original: node },
}: CellContext<NodeRowData, NodeCondition[]>) {
  const conditions = getConditions(node);

  return (
    <div className="flex flex-wrap gap-1">
      {conditions.length > 0
        ? conditions.map((condition) => (
            <Badge
              key={condition.type?.toString()}
              type={condition.status === 'True' ? 'warn' : 'success'}
            >
              {condition.type}
            </Badge>
          ))
        : '-'}
    </div>
  );
}

function getConditions(node: NodeRowData) {
  return (
    // exclude the Ready condition and search for unhealthy conditions
    node.status?.conditions?.filter(
      (condition) => condition.type !== 'Ready' && condition.status === 'True'
    ) ?? []
  );
}
