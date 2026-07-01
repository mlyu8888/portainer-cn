import { useState } from 'react';
import { FormikErrors } from 'formik';

import {
  PathSelector,
  PathSelectorGitModel,
} from '@/react/portainer/gitops/ComposePathField/PathSelector';
import { dummyGitForm } from '@/react/portainer/gitops/RelativePathFieldset/utils';

import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Input, Select } from '@@/form-components/Input';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';
import { InsightsBox } from '@@/InsightsBox';

import { RelativePathModel, getPerDevConfigsFilterType } from './types';

interface Props {
  values: RelativePathModel;
  gitModel?: PathSelectorGitModel;
  onChange: (value: RelativePathModel) => void;
  isEditing?: boolean;
  hideEdgeConfigs?: boolean;
  errors?: FormikErrors<RelativePathModel>;
}

export function RelativePathFieldset({
  values: value,
  gitModel,
  onChange = () => {},
  isEditing,
  hideEdgeConfigs,
  errors,
}: Props) {
  const [relativePathManuallyEnabled, setRelativePathManuallyEnabled] =
    useState(value.SupportRelativePath);

  const [relativePathForcedEnabled, setRelativePathForcedEnabled] = useState(
    value.SupportPerDeviceConfigs
  );

  const gitoptsEdgeConfigDocUrl = useDocsUrl(
    '/user/edge/stacks/add#gitops-edge-configurations'
  );

  const pathTipSwarm =
    '在 Docker Swarm 中使用相对路径存储卷时，您必须拥有所有节点都能访问的网络文件系统。';
  const pathTipGitopsActive =
    'GitOps Edge 配置已激活。当您设置"本地文件系统路径"时，它也将用于相对路径。';

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="EnableRelativePaths"
            data-cy="gitops-enable-relative-paths-switch"
            label="启用相对路径存储卷"
            labelClass="col-sm-3 col-lg-2"
            tooltip="启用此选项意味着您可以在 Compose 文件中指定相对路径存储卷，Portainer 将内容从您的 Git 仓库拉取到堆栈部署的目标环境。"
            disabled={isEditing || relativePathForcedEnabled}
            checked={value.SupportRelativePath}
            onChange={(value) => {
              setRelativePathManuallyEnabled(value);
              handleChange({ SupportRelativePath: value });
            }}
          />
        </div>
      </div>

      {value.SupportRelativePath && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                {relativePathForcedEnabled ? pathTipGitopsActive : pathTipSwarm}
              </TextTip>
            </div>
          </div>

          {(!relativePathForcedEnabled || hideEdgeConfigs) && (
            <div className="form-group">
              <div className="col-sm-12">
                <FormControl
                  label="本地文件系统路径"
                  errors={errors?.FilesystemPath}
                  required
                >
                  <Input
                    name="FilesystemPath"
                    data-cy="relative-path-filesystem-path-input"
                    placeholder="/mnt"
                    disabled={isEditing}
                    value={value.FilesystemPath}
                    onChange={(e) =>
                      handleChange({ FilesystemPath: e.target.value })
                    }
                  />
                </FormControl>
              </div>
            </div>
          )}
        </>
      )}

      {!hideEdgeConfigs && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                启用后，相应的 Edge ID 将作为环境变量传递：PORTAINER_EDGE_ID。
              </TextTip>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="EnablePerDeviceConfigs"
                data-cy="gitops-enable-per-device-configs-switch"
                label="GitOps Edge 配置"
                labelClass="col-sm-3 col-lg-2"
                tooltip="启用 GitOps Edge 配置功能后，您可以在配置文件中定义相对路径存储卷。Portainer 将通过匹配文件夹名称或文件名与 Portainer Edge ID，自动从您的 Git 仓库获取内容，并将其应用到堆栈部署的环境。"
                disabled={isEditing}
                checked={!!value.SupportPerDeviceConfigs}
                onChange={(v) => {
                  setRelativePathForcedEnabled(v);
                  handleChange({
                    SupportPerDeviceConfigs: v,
                    SupportRelativePath: v ? true : relativePathManuallyEnabled,
                  });
                }}
              />
            </div>
          </div>

          {value.SupportPerDeviceConfigs && (
            <>
              <InsightsBox
                content={
                  <p>
                    名为 <code>$&#123;PORTAINER_EDGE_ID&#125;.env</code>{' '}
                    和/或 <code>$&#123;PORTAINER_EDGE_GROUP&#125;.env</code>{' '}
                    的文件会被加载用于 compose 文件变量替换。
                  </p>
                }
                header="GitOps Edge 配置"
                insightCloseId="edge-config-interpolation-info"
                className="mb-3"
              />

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">{pathTipSwarm}</TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl
                  label="本地文件系统路径"
                    errors={errors?.FilesystemPath}
                    required
                  >
                    <Input
                      name="FilesystemPath"
                      data-cy="per-device-configs-filesystem-path-input"
                      placeholder="/mnt"
                      disabled={isEditing}
                      value={value.FilesystemPath}
                      onChange={(e) =>
                        handleChange({ FilesystemPath: e.target.value })
                      }
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    指定配置所在的目录名称。这将允许您使用 Git 仓库作为模板来管理设备配置设置。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl
                    label="目录"
                    errors={errors?.PerDeviceConfigsPath}
                    inputId="per_device_configs_path_input"
                    required
                  >
                    <PathSelector
                      value={value.PerDeviceConfigsPath || ''}
                      onChange={(value) =>
                        handleChange({ PerDeviceConfigsPath: value })
                      }
                      placeholder="config"
                      model={gitModel || dummyGitForm}
                      readOnly={isEditing}
                      dirOnly
                      inputId="per_device_configs_path_input"
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    选择匹配配置时要使用的规则，可以按设备单独匹配，也可以按 Edge 组全组匹配。只有与所选规则匹配的配置才能通过其对应路径访问。依赖访问配置的部署可能会遇到错误。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="设备匹配规则">
                    <Select
                      value={value.PerDeviceConfigsMatchType}
                      data-cy="per-device-configs-match-type-select"
                      onChange={(e) =>
                        handleChange({
                          PerDeviceConfigsMatchType: getPerDevConfigsFilterType(
                            e.target.value
                          ),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '文件名与 Portainer Edge ID 匹配',
                          value: 'file',
                        },
                        {
                          label: '文件夹名与 Portainer Edge ID 匹配',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="组匹配规则">
                    <Select
                      value={value.PerDeviceConfigsGroupMatchType}
                      data-cy="per-device-configs-group-match-type-select"
                      onChange={(e) =>
                        handleChange({
                          PerDeviceConfigsGroupMatchType:
                            getPerDevConfigsFilterType(e.target.value),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '文件名与 Edge 组匹配',
                          value: 'file',
                        },
                        {
                          label: '文件夹名与 Edge 组匹配',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    <div>
                      您可以将它用作镜像的环境变量：{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_ID&#125;</code> 或{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_GROUP&#125;</code>。您
                      也可以将其用于存储卷的相对路径：{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_ID&#125;:/myapp/config
                      </code>{' '}
                      或{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_GROUP&#125;:/myapp/groupconfig
                      </code>
                      。更多文档请查看{' '}
                      <a href={gitoptsEdgeConfigDocUrl}>此处</a>。
                    </div>
                  </TextTip>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );

  function handleChange(newValue: Partial<RelativePathModel>) {
    onChange({ ...value, ...newValue });
  }
}
