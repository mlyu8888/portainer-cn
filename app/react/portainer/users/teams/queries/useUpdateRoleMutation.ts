import { useQueryClient, useMutation } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { UserId } from '@/portainer/users/types';
import { withGlobalError, withInvalidate } from '@/react-tools/react-query';

import { TeamId, TeamMembership, TeamRole, TeamMembershipId } from '../types';

import { buildMembershipUrl } from './build-membership-url';
import { queryKeys } from './query-keys';

export function useUpdateRoleMutation(
  teamId: TeamId,
  teamMemberships: TeamMembership[] = []
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: UserId; role: TeamRole }) => {
      const membership = teamMemberships.find(
        (membership) => membership.UserID === userId
      );
      if (!membership) {
        throw new Error('Membership not found');
      }
      return updateTeamMembership(membership.Id, userId, teamId, role);
    },
    ...withGlobalError('更新角色失败'),
    ...withInvalidate(queryClient, [queryKeys.memberships(teamId)]),
  });
}

async function updateTeamMembership(
  id: TeamMembershipId,
  userId: UserId,
  teamId: TeamId,
  role: TeamRole
) {
  try {
    await axios.put(buildMembershipUrl(id), { userId, teamId, role });
  } catch (e) {
    throw parseAxiosError(e as Error, '无法更新团队成员角色');
  }
}
