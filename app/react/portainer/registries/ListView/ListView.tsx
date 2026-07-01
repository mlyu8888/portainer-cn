import { PageHeader } from '@@/PageHeader';
import { InformationPanel } from '@@/InformationPanel';

import { RegistriesDatatable } from './RegistriesDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="注册表" breadcrumbs="注册表管理" reload />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel title="信息">
            <span className="small text-muted">
              通过环境查看注册表，管理用户和/或团队的访问权限
            </span>
          </InformationPanel>
        </div>
      </div>

      <RegistriesDatatable />
    </>
  );
}
