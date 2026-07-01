import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmRedeploy() {
  return confirm({
    title: '',
    message: (
      <>
        一个或多个应用当前正在使用此存储卷。
        <br /> 为使更改生效，这些应用需要重新部署。是否立即重新调度？
      </>
    ),
    confirmButton: buildConfirmButton('重新部署应用'),
    cancelButtonLabel: '稍后再说',
  });
}
