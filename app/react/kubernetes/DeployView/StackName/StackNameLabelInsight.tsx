import { useCurrentUser } from '@/react/hooks/useUser';

import { InsightsBox } from '@@/InsightsBox';
import { Link } from '@@/Link';

export function StackNameLabelInsight() {
  const { isPureAdmin } = useCurrentUser();
  const insightsBoxContent = (
    <>
      下面的堆栈字段之前标记为&apos;名称&apos;，但实际上它一直是堆栈名称（因此重新标记）。
      {isPureAdmin && (
        <>
          <br />
          Kubernetes 堆栈功能可以通过{' '}
          <Link
            to="portainer.settings"
            target="_blank"
            data-cy="k8s-deploy-settings-link"
          >
            Kubernetes 设置
          </Link>
          完全关闭。
        </>
      )}
    </>
  );

  return (
    <InsightsBox
      type="slim"
      header="堆栈"
      content={insightsBoxContent}
      insightCloseId="k8s-stacks-name"
    />
  );
}
