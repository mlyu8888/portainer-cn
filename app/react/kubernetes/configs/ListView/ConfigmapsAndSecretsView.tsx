import { FileCode, Lock } from 'lucide-react';

import { PageHeader } from '@@/PageHeader';
import { Tab, WidgetTabs, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { ConfigMapsDatatable } from './ConfigMapsDatatable';
import { SecretsDatatable } from './SecretsDatatable';

const tabs: Tab[] = [
  {
    name: '配置映射',
    icon: FileCode,
    widget: <ConfigMapsDatatable />,
    selectedTabParam: 'configmaps',
  },
  {
    name: '密钥',
    icon: Lock,
    widget: <SecretsDatatable />,
    selectedTabParam: 'secrets',
  },
];

export function ConfigmapsAndSecretsView() {
  const currentTabIndex = useCurrentTabIndex(tabs);
  return (
    <>
      <PageHeader
        title="配置映射与密钥列表"
        breadcrumbs="配置映射与密钥"
        reload
      />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
