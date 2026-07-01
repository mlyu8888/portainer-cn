import { useQueryClient, useMutation } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import {
  GitAuthModel,
  GitCredentialsModel,
} from '@/react/portainer/gitops/types';
import { useCurrentUser } from '@/react/hooks/useUser';
import { UserId } from '@/portainer/users/types';

import { GitCredential } from '../types';
import { buildGitUrl } from '../git-credentials.service';

export interface CreateGitCredentialPayload {
  userId: number;
  name: string;
  username?: string;
  password: string;
}

export function useCreateGitCredentialMutation() {
  const queryClient = useQueryClient();

  return useMutation(createGitCredential, {
    onSuccess: (_, payload) => {
      notifySuccess('凭据创建成功', payload.name);
      return queryClient.invalidateQueries(['gitcredentials']);
    },
    meta: {
      error: {
        title: '失败',
        message: '无法创建凭据',
      },
    },
  });
}

async function createGitCredential(gitCredential: CreateGitCredentialPayload) {
  try {
    const { data } = await axios.post<{ gitCredential: GitCredential }>(
      buildGitUrl(gitCredential.userId),
      gitCredential
    );
    return data.gitCredential;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法创建 Git 凭据');
  }
}

export function useSaveCredentialsIfRequired() {
  const saveCredentialsMutation = useCreateGitCredentialMutation();
  const { user } = useCurrentUser();

  return {
    saveCredentials: saveCredentialsIfRequired,
    isLoading: saveCredentialsMutation.isLoading,
  };

  async function saveCredentialsIfRequired(authentication?: GitAuthModel) {
    if (!authentication) {
      return undefined;
    }

    if (
      !authentication.SaveCredential ||
      !authentication.RepositoryPassword ||
      !authentication.NewCredentialName
    ) {
      return authentication.RepositoryGitCredentialID;
    }

    try {
      const credential = await saveCredentialsMutation.mutateAsync({
        userId: user.Id,
        username: authentication.RepositoryUsername,
        password: authentication.RepositoryPassword,
        name: authentication.NewCredentialName,
      });
      return credential.id;
    } catch (err) {
      notifyError('错误', err as Error, '无法保存凭据');
      return undefined;
    }
  }
}

export async function saveGitCredentialsIfNeeded(
  userId: UserId,
  gitModel: GitAuthModel
): Promise<GitCredentialsModel> {
  let credentialsId = gitModel.RepositoryGitCredentialID;
  let username = gitModel.RepositoryUsername;
  let password = gitModel.RepositoryPassword;
  if (
    gitModel.SaveCredential &&
    gitModel.RepositoryAuthentication &&
    password &&
    username &&
    gitModel.NewCredentialName
  ) {
    const cred = await createGitCredential({
      name: gitModel.NewCredentialName,
      password,
      username,
      userId,
    });
    credentialsId = cred.id;
  }

  // clear username and password if credentials are provided
  if (credentialsId && username) {
    username = '';
    password = '';
  }

  return {
    RepositoryAuthentication: gitModel.RepositoryAuthentication,
    RepositoryGitCredentialID: credentialsId,
    RepositoryUsername: username,
    RepositoryPassword: password,
    RepositoryAuthorizationType: gitModel.RepositoryAuthorizationType,
  };
}
