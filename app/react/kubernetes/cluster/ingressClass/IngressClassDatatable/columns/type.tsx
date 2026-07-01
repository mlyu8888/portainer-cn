import { columnHelper } from './helper';

export const type = columnHelper.accessor('Type', {
  header: '入口控制器类型',
  cell: ({ getValue }) => {
    const type = getValue();
    return type || '-';
  },
  id: 'type',
});
