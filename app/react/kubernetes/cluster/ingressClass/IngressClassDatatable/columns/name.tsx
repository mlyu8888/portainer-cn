import { CellContext } from '@tanstack/react-table';

import { Badge } from '@@/Badge';

import type { IngressControllerClassMap } from '../../types';

import { columnHelper } from './helper';

export const name = columnHelper.accessor('ClassName', {
  header: '入口类',
  cell: NameCell,
  id: 'name',
});

function NameCell({
  row,
  getValue,
}: CellContext<IngressControllerClassMap, string>) {
  const className = getValue();

  return (
    <span className="flex gap-2 flex-nowrap">
      {className}
      {row.original.New && <Badge className="ml-auto">新检测到</Badge>}
    </span>
  );
}
