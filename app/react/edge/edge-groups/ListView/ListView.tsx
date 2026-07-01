import { PageHeader } from '@@/PageHeader';

import { EdgeGroupsDatatable } from './EdgeGroupsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="边缘组" breadcrumbs="边缘组" reload />
      <EdgeGroupsDatatable />
    </>
  );
}
