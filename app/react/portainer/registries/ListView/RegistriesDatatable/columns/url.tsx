import { DefaultRegistryDomain } from './DefaultRegistryDomain';
import { columnHelper } from './helper';

export const url = columnHelper.accessor('URL', {
  header: '地址',
  cell: ({ getValue, row: { original: item } }) =>
    item.Id ? getValue() : <DefaultRegistryDomain />,
});
