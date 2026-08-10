import { NodeList, Node } from 'kubernetes-types/core/v1';
import { useQuery } from '@tanstack/react-query';

import axios from '@/portainer/services/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { withGlobalError } from '@/react-tools/react-query';

import { parseKubernetesAxiosError } from '../../axiosError';

import { queryKeys } from './query-keys';

// getNodes is used to get a list of nodes using the kubernetes API
export async function getNodes(environmentId: EnvironmentId) {
  try {
    const { data: nodeList } = await axios.get<NodeList>(
      `/endpoints/${environmentId}/kubernetes/api/v1/nodes`
    );
    return nodeList.items;
  } catch (e) {
    throw parseKubernetesAxiosError(e, '无法获取节点');
  }
}

// useNodesQuery is used to get an array of nodes using the kubernetes API
export function useNodesQuery<T = Node[]>(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number; select?: (nodes: Node[]) => T }
) {
  return useQuery(
    queryKeys.nodes(environmentId),
    async () => getNodes(environmentId),
    {
      ...withGlobalError(
        '从 Kubernetes API 获取节点失败',
        '获取节点失败'
      ),
      refetchInterval: options?.autoRefreshRate ?? false,
      select: options?.select,
    }
  );
}
