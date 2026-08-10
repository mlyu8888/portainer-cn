import { useMutation, useQueryClient } from '@tanstack/react-query';

import { withGlobalError, withInvalidate } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { queryKeys } from './query-keys';

export function useDeleteCronJobsMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation(deleteCronJob, {
    ...withInvalidate(queryClient, [queryKeys.list(environmentId)]),
    ...withGlobalError('无法删除定时任务'),
  });
}

type NamespaceCronJobsMap = Record<string, string[]>;

export async function deleteCronJob({
  environmentId,
  data,
}: {
  environmentId: EnvironmentId;
  data: NamespaceCronJobsMap;
}) {
  try {
    return await axios.post(
      `kubernetes/${environmentId}/cron_jobs/delete`,
      data
    );
  } catch (e) {
    throw parseAxiosError(e, `无法删除定时任务`);
  }
}
