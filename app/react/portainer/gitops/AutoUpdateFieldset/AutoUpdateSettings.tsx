import { FormikErrors } from 'formik';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { type AutoUpdateModel } from '@/react/portainer/gitops/types';

import { ButtonSelector } from '@@/form-components/ButtonSelector/ButtonSelector';
import { FormControl } from '@@/form-components/FormControl';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

import { ForceDeploymentSwitch } from './ForceDeploymentSwitch';
import { IntervalField } from './IntervalField';
import { WebhookSettings } from './WebhookSettings';

export function AutoUpdateSettings({
  value,
  onChange,
  environmentType,
  showForcePullImage,
  errors,
  baseWebhookUrl,
  webhookId,
  webhookDocs,
}: {
  value: AutoUpdateModel;
  onChange: (value: Partial<AutoUpdateModel>) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES';
  showForcePullImage: boolean;
  errors?: FormikErrors<AutoUpdateModel>;
  baseWebhookUrl: string;
  webhookId: string;
  webhookDocs?: string;
}) {
  return (
    <>
      <TextTip color="orange" className="mb-2">
        对此堆栈或应用通过 Portainer 本地或直接在集群中进行的任何更改都将被 Git 仓库内容覆盖，可能会导致服务中断。
      </TextTip>

      <FormControl label="机制">
        <ButtonSelector
          size="small"
          options={[
            { value: 'Interval', label: '轮询' },
            { value: 'Webhook', label: 'Webhook' },
          ]}
          value={value.RepositoryMechanism || 'Interval'}
          onChange={(value) => onChange({ RepositoryMechanism: value })}
        />
      </FormControl>

      {value.RepositoryMechanism === 'Webhook' && (
        <WebhookSettings
          baseUrl={baseWebhookUrl}
          value={webhookId}
          docsLink={webhookDocs}
        />
      )}

      {value.RepositoryMechanism === 'Interval' && (
        <IntervalField
          value={value.RepositoryFetchInterval || ''}
          onChange={(value) => onChange({ RepositoryFetchInterval: value })}
          errors={errors?.RepositoryFetchInterval}
        />
      )}

      {showForcePullImage && (
        <div className="form-group">
          <div className="col-sm-12">
            <SwitchField
              name="forcePullImage"
              data-cy="gitops-force-pull-image-switch"
              featureId={FeatureId.STACK_PULL_IMAGE}
              checked={value.ForcePullImage || false}
              label="重新拉取镜像"
              labelClass="col-sm-3 col-lg-2"
              tooltip="启用后，当通过 webhook 或轮询触发重新部署时，如果存在带有您指定标签的较新镜像（例如可变的开发版本），则会被拉取并重新部署。如果您未指定标签，或指定 'latest' 作为标签，则将拉取并重新部署标签为 'latest' 的镜像。"
              onChange={(value) => onChange({ ForcePullImage: value })}
            />
          </div>
        </div>
      )}

      <ForceDeploymentSwitch
        checked={value.RepositoryAutomaticUpdatesForce || false}
        onChange={(value) =>
          onChange({ RepositoryAutomaticUpdatesForce: value })
        }
        label={
          environmentType === 'KUBERNETES' ? '始终应用清单' : undefined
        }
        tooltip={
          environmentType === 'KUBERNETES' ? (
            <>
              <p>
                启用后，当通过 webhook 或轮询触发重新部署时，即使 Portainer 检测到 Git 仓库与上次 Git 拉取时本地存储的内容没有差异，也会始终执行 kubectl apply。
              </p>
              <p>
                如果您希望 Git 仓库作为唯一真实来源，并且不介意直接对集群中资源所做的更改被覆盖，这将非常有用。
              </p>
            </>
          ) : (
            <p>
              启用后，当通过 webhook 或轮询触发重新部署时，即使 Portainer 检测到 Git 仓库与上次 Git 拉取时本地存储的内容没有差异，堆栈也将始终重新部署。
            </p>
          )
        }
      />
    </>
  );
}
