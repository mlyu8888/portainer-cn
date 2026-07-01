import { PageHeader } from '@@/PageHeader';

import { IngressDatatable } from './IngressDatatable';

export function IngressesDatatableView() {
  return (
    <>
      <PageHeader
        title="入口列表"
        breadcrumbs={[
          {
            label: '入口',
          },
        ]}
        reload
      />
      <IngressDatatable />
    </>
  );
}
