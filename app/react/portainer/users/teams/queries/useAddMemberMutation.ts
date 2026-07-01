import { useMutation, useQueryClient } from '@tanstack/react-query';

import { promiseSequence } from '@/portainer/helpers/promise-utils';
import { UserId } from '@/portainer/users/types';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError, withInvalidate } from '@/react-tools/react-query';

import { TeamId, TeamRole } from '../types';

import { buildMembershipUrl } from './build-membership-url';
import { queryKeys } from './query-keys';

export function useAddMemberMutation(teamId: TeamId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: UserId[]) =>
      promiseSequence(
        userIds.map(
          (userId) => () =>
            createTeamMembership(userId, teamId, TeamRole.Member)
        )
      ),

    ...withGlobalError('添加成员失败'),
    ...withInvalidate(queryClient, [queryKeys.memberships(teamId)]),
  });
}

export async function createTeamMembership(
  userId: UserId,
  teamId: TeamId,
  role: TeamRole
) {
  try {
    await axios.post(buildMembershipUrl(), { userId, teamId, role });
  } catch (e) {
    throw parseAxiosError(e, '无法创建团队成员关系');
  }
}
