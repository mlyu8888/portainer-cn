import { withLimitToBE } from '@/react/hooks/useLimitToBE';

import { InformationPanel } from '@@/InformationPanel';
import { TextTip } from '@@/Tip/TextTip';
import { PageHeader } from '@@/PageHeader';
import { Link } from '@@/Link';
import { Alert } from '@@/Alert';

import { Datatable } from './Datatable';
import { useLicenseOverused, useUntrustedCount } from './queries';

export default withLimitToBE(WaitingRoomView);

function WaitingRoomView() {
  const untrustedCount = useUntrustedCount();
  const licenseOverused = useLicenseOverused(untrustedCount);
  return (
    <>
      <PageHeader
        title="等候室"
        breadcrumbs={[{ label: '等候室' }]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel>
            <TextTip color="blue">
              只有通过{' '}
              <Link
                to="portainer.endpoints.edgeAutoCreateScript"
                data-cy="waitingRoom-edgeAutoCreateScriptLink"
              >
                自动注册
              </Link>{' '}
              脚本生成的环境会出现在这里，手动添加的环境和边缘设备将绕过等候室。
            </TextTip>
          </InformationPanel>
        </div>
      </div>

      {licenseOverused && (
        <div className="row">
          <div className="col-sm-12">
            <Alert color="warn">
              关联等候室中的所有节点将超过当前许可证的节点限制。前往{' '}
              <Link
                to="portainer.licenses"
                data-cy="waitingRoom-portainerLicensesLink"
              >
                许可证
              </Link>{' '}
              页面查看当前使用情况。
            </Alert>
          </div>
        </div>
      )}

      <Datatable />
    </>
  );
}
