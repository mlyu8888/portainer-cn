import { Authorized } from '@/react/hooks/useUser';

import { AddButton as BaseAddButton } from '@@/buttons';

export function AddButton() {
  return (
    <Authorized authorizations="OperationPortainerRegistryCreate" adminOnlyCE>
      <BaseAddButton
        data-cy="registry-addRegistryButton"
        to="portainer.registries.new"
      >
        添加注册表
      </BaseAddButton>
    </Authorized>
  );
}
