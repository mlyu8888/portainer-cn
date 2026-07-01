import { pluralize } from '@/portainer/helpers/strings';
import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton as BaseDeleteButton } from '@@/buttons/DeleteButton';

import { Registry } from '../../types/registry';

import { useDeleteRegistriesMutation } from './useDeleteRegistriesMutation';

export function DeleteButton({ selectedItems }: { selectedItems: Registry[] }) {
  const mutation = useDeleteRegistriesMutation();

  const confirmMessage = getMessage(selectedItems.length);

  return (
    <BaseDeleteButton
      data-cy="registry-removeRegistryButton"
      disabled={selectedItems.length === 0}
      confirmMessage={confirmMessage}
      onConfirmed={handleDelete}
    />
  );

  function handleDelete() {
    mutation.mutate(
      selectedItems.map((item) => item.Id),
      {
        onSuccess() {
          notifySuccess('成功', '注册表已删除');
        },
      }
    );
  }
}

function getMessage(selectedCount: number) {
  const regAttrMsg = selectedCount > 1 ? '这些' : '这个';
  const registriesMsg = pluralize(selectedCount, '注册表', '注册表');
  return `${regAttrMsg} ${registriesMsg} 可能被一个或多个环境中的应用使用。删除${registriesMsg}可能导致使用${regAttrMsg}${registriesMsg}的应用出现服务中断。确定要删除选中的${registriesMsg}吗？`;
}
