import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmUpdateNode(
  taintsWarning: boolean,
  labelsWarning: boolean,
  cordonWarning: boolean,
  drainWarning: boolean
) {
  let message;
  if (taintsWarning && !labelsWarning) {
    message =
      '更改污点将立即取消调度在此节点上运行且没有相应容忍度的应用。是否继续？';
  } else if (!taintsWarning && labelsWarning) {
    message =
      '移除或更改正在使用的标签可能会阻止应用将来在此节点上调度。是否继续？';
  } else if (taintsWarning && labelsWarning) {
    message = (
      <>
        <p>
          更改污点将立即取消调度在此节点上运行且没有相应容忍度的应用。
        </p>
        <p>
          移除或更改正在使用的标签可能会阻止应用将来在此节点上调度。
        </p>
        <p>是否继续？</p>
      </>
    );
  } else if (cordonWarning) {
    message =
      '将此节点标记为不可调度将有效封锁该节点，并阻止任何新的工作负载调度到该节点。确定吗？';
  } else if (drainWarning) {
    message =
      '排空此节点将导致所有工作负载从该节点驱逐。这可能会导致服务中断。确定吗？';
  }

  return confirm({
    title: '确定吗？',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('更新', 'primary'),
  });
}
