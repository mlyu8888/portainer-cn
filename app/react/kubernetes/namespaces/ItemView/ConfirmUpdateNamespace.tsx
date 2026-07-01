import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

type Warnings = {
  quota: boolean;
  ingress: boolean;
  registries: boolean;
};

export function confirmUpdateNamespace(warnings: Warnings) {
  const message = (
    <>
      {warnings.quota && (
        <p>
          减少分配给"使用中"命名空间的配额可能会产生意外后果，包括阻止正在运行的应用正常运行，甚至可能完全阻止它们运行。
        </p>
      )}
      {warnings.ingress && (
        <p>
          停用入口可能导致应用无法访问。受影响应用的所有入口配置都将被移除。
        </p>
      )}
      {warnings.registries && (
        <p>
          您移除的一些仓库可能正在被此环境中的一个或多个应用使用。移除仓库访问权限可能导致这些应用的服务中断。
        </p>
      )}
      <p>确定要继续吗？</p>
    </>
  );

  return confirm({
    title: '确定吗？',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('更新', 'primary'),
  });
}
