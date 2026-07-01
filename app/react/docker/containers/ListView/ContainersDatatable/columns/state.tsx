import clsx from 'clsx';
import { CellContext } from '@tanstack/react-table';

import {
  type ContainerListViewModel,
  ContainerStatus,
} from '@/react/docker/containers/types';

import { filterHOC } from '@@/datatables/Filter';
import { multiple } from '@@/datatables/filter-types';

import { columnHelper } from './helper';

const statusLabels: Record<string, string> = {
  [ContainerStatus.Paused]: '已暂停',
  [ContainerStatus.Stopped]: '已停止',
  [ContainerStatus.Created]: '已创建',
  [ContainerStatus.Healthy]: '健康',
  [ContainerStatus.Unhealthy]: '不健康',
  [ContainerStatus.Starting]: '启动中',
  [ContainerStatus.Running]: '运行中',
  [ContainerStatus.Dead]: '已停止',
  [ContainerStatus.Exited]: '已退出',
};

export const state = columnHelper.accessor('Status', {
  header: '状态',
  id: 'state',
  cell: StatusCell,
  enableColumnFilter: true,
  filterFn: multiple,
  meta: {
    filter: filterHOC('按状态筛选'),
  },
});

function StatusCell({
  getValue,
  row: { original: container },
}: CellContext<ContainerListViewModel, ContainerStatus>) {
  const status = getValue();

  const hasHealthCheck = [
    ContainerStatus.Starting,
    ContainerStatus.Healthy,
    ContainerStatus.Unhealthy,
  ].includes(status);

  const statusClassName = getClassName();

  let transformedStatus = statusLabels[status] || status;
  if (status === ContainerStatus.Exited) {
    transformedStatus = `已退出 (代码 ${extractExitCode(container.StatusText)})`;
  }

  return (
    <span
      className={clsx('label', `label-${statusClassName}`, {
        interactive: hasHealthCheck,
      })}
      title={hasHealthCheck ? '此容器具有健康检查' : ''}
    >
      {transformedStatus}
    </span>
  );

  function getClassName() {
    switch (status) {
      case ContainerStatus.Paused:
      case ContainerStatus.Starting:
      case ContainerStatus.Unhealthy:
        return 'warning';
      case ContainerStatus.Created:
        return 'info';
      case ContainerStatus.Stopped:
      case ContainerStatus.Dead:
      case ContainerStatus.Exited:
        return 'danger';
      case ContainerStatus.Healthy:
      case ContainerStatus.Running:
      default:
        return 'success';
    }
  }

  function extractExitCode(statusText: string) {
    const regex = /\((\d+)\)/;
    const match = statusText.match(regex);
    return match ? match[1] : '';
  }
}
