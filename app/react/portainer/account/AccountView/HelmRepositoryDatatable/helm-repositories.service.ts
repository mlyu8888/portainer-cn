import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { success as notifySuccess } from '@/portainer/services/notifications';
import { withError } from '@/react-tools/react-query';
import { pluralize } from '@/portainer/helpers/strings';
import { queryKeys } from '@/react/kubernetes/helm/helmChartSourceQueries/query-keys';
import { useCurrentUser } from '@/react/hooks/useUser';

import {
  CreateHelmRepositoryPayload,
  HelmRepository,
  HelmRepositories,
} from './types';

export async function createHelmRepository(
  helmRepository: CreateHelmRepositoryPayload
) {
  try {
    const { data } = await axios.post<{ helmRepository: HelmRepository }>(
      buildUrl(helmRepository.UserId),
      helmRepository
    );
    return data.helmRepository;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法创建 Helm 仓库');
  }
}

export async function getHelmRepositories(userId: number) {
  try {
    const { data } = await axios.get<HelmRepositories>(buildUrl(userId));
    return data;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取 Helm 仓库');
  }
}

export async function deleteHelmRepository(repo: HelmRepository) {
  try {
    await axios.delete<HelmRepository[]>(buildUrl(repo.UserId, repo.Id));
  } catch (e) {
    throw parseAxiosError(e as Error, '无法删除 Helm 仓库');
  }
}

export async function deleteHelmRepositories(repos: HelmRepository[]) {
  try {
    await Promise.all(repos.map((repo) => deleteHelmRepository(repo)));
  } catch (e) {
    throw parseAxiosError(e as Error, '无法删除 Helm 仓库');
  }
}

export function useDeleteHelmRepositoryMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  return useMutation(deleteHelmRepository, {
    onSuccess: (_, helmRepository) => {
      notifySuccess('Helm repository deleted successfully', helmRepository.URL);
      return queryClient.invalidateQueries(queryKeys.registries(user.Id));
    },
    ...withError('无法删除 Helm 仓库'),
  });
}

export function useDeleteHelmRepositoriesMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  return useMutation(deleteHelmRepositories, {
    onSuccess: () => {
      notifySuccess(
        'Success',
        `Helm ${pluralize(
          deleteHelmRepositories.length,
          'repository',
          'repositories'
        )} deleted successfully`
      );
      return queryClient.invalidateQueries(queryKeys.registries(user.Id));
    },
    ...withError('无法删除 Helm 仓库'),
  });
}

export function useHelmRepositories(userId: number) {
  return useQuery(
    queryKeys.registries(userId),
    () => getHelmRepositories(userId),
    {
      staleTime: 20,
      ...withError('无法检索 Helm 仓库'),
    }
  );
}

export function useCreateHelmRepositoryMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  return useMutation(createHelmRepository, {
    onSuccess: (_, payload) => {
      notifySuccess('Helm repository created successfully', payload.URL);
      return queryClient.invalidateQueries(queryKeys.registries(user.Id));
    },
    ...withError('无法创建 Helm 仓库'),
  });
}

function buildUrl(userId: number, helmRepositoryId?: number) {
  if (helmRepositoryId) {
    return `/users/${userId}/helm/repositories/${helmRepositoryId}`;
  }
  return `/users/${userId}/helm/repositories`;
}
