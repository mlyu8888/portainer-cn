import { compact } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { withGlobalError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { ClusterRole } from '../types';

import { queryKeys } from './query-keys';

export function useClusterRoles(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => {
      const clusterRoles = await getClusterRoles(environmentId);
      return compact(clusterRoles);
    },
    {
      ...withGlobalError('无法获取集群角色'),
      refetchInterval: options?.autoRefreshRate,
    }
  );
}

async function getClusterRoles(environmentId: EnvironmentId) {
  try {
    const { data: roles } = await axios.get<ClusterRole[]>(
      `kubernetes/${environmentId}/cluster_roles`
    );

    return roles;
  } catch (e) {
    throw parseAxiosError(e, '无法获取集群角色');
  }
}
