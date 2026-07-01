import { CellContext, Row } from '@tanstack/react-table';
import clsx from 'clsx';

import {
  KubernetesApplicationDeploymentTypes,
  KubernetesApplicationTypes,
} from '@/kubernetes/models/application/models/appConstants';

import { filterHOC } from '@@/datatables/Filter';

import styles from './columns.status.module.css';
import { helper } from './columns.helper';
import { ApplicationRowData } from './types';

export const status = helper.accessor(getStatusSummary, {
  header: '状态',
  cell: Cell,
  meta: {
    filter: filterHOC('按状态筛选'),
  },
  enableColumnFilter: true,
  filterFn: (row: Row<ApplicationRowData>, _: string, filterValue: string[]) =>
    filterValue.length === 0 ||
    filterValue.includes(getStatusSummary(row.original)),
});

function Cell({
  row: { original: item },
}: CellContext<ApplicationRowData, string>) {
  if (
    item.ApplicationType === KubernetesApplicationTypes.Pod &&
    item.Pods &&
    item.Pods.length > 0
  ) {
    return item.Pods[0].Status;
  }

  return (
    <>
      <span
        className={clsx([
          styles.statusIndicator,
          {
            [styles.ok]:
              (item.TotalPodsCount > 0 &&
                item.TotalPodsCount === item.RunningPodsCount) ||
              item.Status === 'Ready',
          },
        ])}
      />
      {item.ApplicationType !== KubernetesApplicationTypes.Helm && (
        <>
          {item.DeploymentType ===
            KubernetesApplicationDeploymentTypes.Replicated && (
            <span className="mr-1">副本</span>
          )}
          {item.DeploymentType ===
            KubernetesApplicationDeploymentTypes.Global && (
            <span className="mr-1">全局</span>
          )}
          {item.RunningPodsCount >= 0 && item.TotalPodsCount >= 0 && (
            <span>
              <code aria-label="运行容器组" title="运行容器组">
                {item.RunningPodsCount}
              </code>{' '}
              /{' '}
              <code aria-label="总计容器组" title="总计容器组">
                {item.TotalPodsCount}
              </code>
            </span>
          )}
        </>
      )}
      {item.KubernetesApplications && <span>{item.Status}</span>}
    </>
  );
}

function getStatusSummary(item: ApplicationRowData): '就绪' | '未就绪' {
  if (
    item.ApplicationType === KubernetesApplicationTypes.Pod &&
    item.Pods &&
    item.Pods.length > 0
  ) {
    return item.Pods[0].Status === 'Running' ? '就绪' : '未就绪';
  }
  return item.TotalPodsCount > 0 &&
    item.TotalPodsCount === item.RunningPodsCount
    ? '就绪'
    : '未就绪';
}
