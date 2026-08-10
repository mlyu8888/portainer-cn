import { useMutation, useQueryClient } from '@tanstack/react-query';

import { withGlobalError, withInvalidate } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { queryKeys } from './query-keys';

export function useDeleteRoleBindingsMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation(deleteRoleBindings, {
    ...withInvalidate(queryClient, [queryKeys.list(environmentId)]),
    ...withGlobalError('无法删除角色绑定'),
  });
}

export async function deleteRoleBindings({
  environmentId,
  data,
}: {
  environmentId: EnvironmentId;
  data: Record<string, string[]>;
}) {
  try {
    return await axios.post(
      `kubernetes/${environmentId}/role_bindings/delete`,
      data
    );
  } catch (e) {
    throw parseAxiosError(e, `无法删除角色绑定`);
  }
}
