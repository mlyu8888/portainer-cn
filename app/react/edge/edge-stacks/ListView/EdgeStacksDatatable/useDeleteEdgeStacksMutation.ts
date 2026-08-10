import { useMutation, useQueryClient } from '@tanstack/react-query';

import { promiseSequence } from '@/portainer/helpers/promise-utils';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';

import { EdgeStack } from '../../types';
import { buildUrl } from '../../queries/buildUrl';
import { queryKeys } from '../../queries/query-keys';

export function useDeleteEdgeStacksMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (edgeStackIds: Array<EdgeStack['Id']>) =>
      promiseSequence(
        edgeStackIds.map((edgeStackId) => () => deleteEdgeStack(edgeStackId))
      ),
    mutationOptions(
      withError('无法删除边缘堆栈'),
      withInvalidate(queryClient, [queryKeys.base()])
    )
  );
}

async function deleteEdgeStack(id: EdgeStack['Id']) {
  try {
    await axios.delete(buildUrl(id));
  } catch (e) {
    throw parseAxiosError(e, 'Unable to delete edge stack');
  }
}
