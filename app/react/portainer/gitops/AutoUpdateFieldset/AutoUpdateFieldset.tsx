import { FormikErrors } from 'formik';

import { AutoUpdateModel } from '@/react/portainer/gitops/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { InsightsBox } from '@@/InsightsBox';

import { AutoUpdateSettings } from './AutoUpdateSettings';

export function AutoUpdateFieldset({
  value,
  onChange,
  environmentType,
  isForcePullVisible = true,
  errors,
  baseWebhookUrl,
  webhookId,
  webhooksDocs,
}: {
  value: AutoUpdateModel;
  onChange: (value: AutoUpdateModel) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES';
  isForcePullVisible?: boolean;
  errors?: FormikErrors<AutoUpdateModel>;
  baseWebhookUrl: string;
  webhookId: string;
  webhooksDocs?: string;
}) {
  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="autoUpdate"
            data-cy="gitops-auto-update-switch"
            checked={value.RepositoryAutomaticUpdates}
            label="GitOps 更新"
            tooltip="启用后，在每个轮询间隔或 Webhook 调用时，如果 Git 仓库与上次 Git 拉取时本地存储的内容不同，将部署更改。"
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) =>
              handleChange({ RepositoryAutomaticUpdates: value })
            }
          />
        </div>
      </div>

      <InsightsBox
        content={
          <p>
            我们已将"自动更新"重命名，以更好地与行业术语保持一致，并更清晰地表达其用途。虽然名称已更改，但功能保持不变。GitOps 已成为管理基础设施和应用变更的革命性方法，我们希望确保我们的平台反映行业的最新进展。
          </p>
        }
        header="认识'GitOps 更新'：原名为自动更新"
        insightCloseId="rename-gitops-updates"
        className="mb-3"
      />

      {value.RepositoryAutomaticUpdates && (
        <AutoUpdateSettings
          webhookId={webhookId}
          baseWebhookUrl={baseWebhookUrl}
          value={value}
          onChange={handleChange}
          environmentType={environmentType}
          showForcePullImage={isForcePullVisible}
          errors={errors}
          webhookDocs={webhooksDocs}
        />
      )}
    </>
  );

  function handleChange(newValues: Partial<AutoUpdateModel>) {
    onChange({ ...value, ...newValues });
  }
}
