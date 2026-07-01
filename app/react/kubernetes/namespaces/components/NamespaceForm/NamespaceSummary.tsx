import { isEqual } from 'lodash';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { NamespaceFormValues } from '../../types';

interface Props {
  initialValues: NamespaceFormValues;
  values: NamespaceFormValues;
  isValid: boolean;
}

export function NamespaceSummary({ initialValues, values, isValid }: Props) {
  // only compare the values from k8s related resources
  const { registries: newRegistryValues, ...newK8sValues } = values;
  const { registries: oldRegistryValues, ...oldK8sValues } = initialValues;
  const hasChanges = !isEqual(newK8sValues, oldK8sValues);
  if (!hasChanges || !isValid) {
    return null;
  }

  const isCreatingNamespace = !oldK8sValues.name && newK8sValues.name;

  const enabledQuotaInitialValues = initialValues.resourceQuota.enabled;
  const enabledQuotaNewValues = values.resourceQuota.enabled;

  const isCreatingResourceQuota =
    !enabledQuotaInitialValues && enabledQuotaNewValues;
  const isUpdatingResourceQuota =
    enabledQuotaInitialValues && enabledQuotaNewValues;
  const isDeletingResourceQuota =
    enabledQuotaInitialValues && !enabledQuotaNewValues;

  return (
    <FormSection title="摘要" isFoldable defaultFolded={false}>
      <div className="form-group">
        <div className="col-sm-12">
          <TextTip color="blue">
            Portainer 将执行以下 Kubernetes 操作。
          </TextTip>
        </div>
      </div>
      <div className="col-sm-12 small text-muted pt-1">
        <ul>
          {isCreatingNamespace && (
            <li>
              创建名为 <code>{values.name}</code> 的{' '}
              <span className="bold">命名空间</span>
            </li>
          )}
          {isCreatingResourceQuota && (
            <li>
              创建名为 <code>portainer-rq-{values.name}</code> 的{' '}
              <span className="bold">资源配额</span>
            </li>
          )}
          {isUpdatingResourceQuota && (
            <li>
              更新名为 <code>portainer-rq-{values.name}</code> 的{' '}
              <span className="bold">资源配额</span>
            </li>
          )}
          {isDeletingResourceQuota && (
            <li>
              删除名为 <code>portainer-rq-{values.name}</code> 的{' '}
              <span className="bold">资源配额</span>
            </li>
          )}
        </ul>
      </div>
    </FormSection>
  );
}
