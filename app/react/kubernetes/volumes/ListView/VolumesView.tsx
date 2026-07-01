import { Database, HardDrive } from 'lucide-react';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { VolumesDatatable } from './VolumesDatatable';
import { StorageDatatable } from './StorageDatatable';

export function VolumesView() {
  const tabs: Tab[] = [
    {
      name: '存储卷',
      icon: Database,
      widget: <VolumesDatatable />,
      selectedTabParam: 'volumes',
    },
    {
      name: '存储',
      icon: HardDrive,
      widget: <StorageDatatable />,
      selectedTabParam: 'storage',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader title="存储卷列表" breadcrumbs="存储卷" reload />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
