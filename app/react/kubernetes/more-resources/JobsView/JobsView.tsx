import { CalendarCheck2, CalendarSync } from 'lucide-react';

import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { JobsDatatable } from './JobsDatatable/JobsDatatable';
import { CronJobsDatatable } from './CronJobsDatatable/CronJobsDatatable';

export function JobsView() {
  useUnauthorizedRedirect(
    { authorizations: ['K8sJobsR', 'K8sCronJobsR'] },
    { to: 'kubernetes.dashboard' }
  );

  const tabs: Tab[] = [
    {
      name: '定时任务',
      icon: CalendarSync,
      widget: <CronJobsDatatable />,
      selectedTabParam: 'cronJobs',
    },
    {
      name: '任务',
      icon: CalendarCheck2,
      widget: <JobsDatatable />,
      selectedTabParam: 'jobs',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader
        title="定时任务和任务列表"
        breadcrumbs="定时任务和任务"
        reload
      />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
