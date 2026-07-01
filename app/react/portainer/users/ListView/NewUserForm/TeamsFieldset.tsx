import { useFormikContext } from 'formik';

import { useCurrentUser } from '@/react/hooks/useUser';
import { usePublicSettings } from '@/react/portainer/settings/queries';

import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

import { useTeams } from '../../teams/queries';

import { AdminSwitch } from './AdminSwitch';
import { FormValues } from './FormValues';
import { TeamsField } from './TeamsField';

export function TeamsFieldset() {
  const { values } = useFormikContext<FormValues>();
  const { isPureAdmin } = useCurrentUser();
  const teamsQuery = useTeams(!isPureAdmin);
  const settingsQuery = usePublicSettings();
  if (!teamsQuery.data || !settingsQuery.data) {
    return null;
  }

  const { TeamSync: teamSync } = settingsQuery.data;

  return (
    <>
      {isPureAdmin && <AdminSwitch />}

      {!values.isAdmin && (
        <TeamsField teams={teamsQuery.data} disabled={teamSync} />
      )}

      {teamSync && <TeamSyncMessage />}

      {isPureAdmin && !values.isAdmin && values.teams.length === 0 && (
        <NoTeamSelected />
      )}
    </>
  );
}

function TeamSyncMessage() {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <TextTip color="orange">
          团队负责人功能已禁用，因为当前已启用外部认证并开启了团队同步。
        </TextTip>
      </div>
    </div>
  );
}

function NoTeamSelected() {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <TextTip color="blue">
          注意：非管理员用户如果不在任何团队中，默认将无法访问任何环境。前往{' '}
          <Link to="portainer.endpoints" data-cy="env-link">
            环境视图
          </Link>{' '}
          管理他们的访问权限。
        </TextTip>
      </div>
    </div>
  );
}
