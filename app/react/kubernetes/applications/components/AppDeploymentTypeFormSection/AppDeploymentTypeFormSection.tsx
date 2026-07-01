import { Boxes, Sliders } from 'lucide-react';
import { FormikErrors } from 'formik';

import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { FormError } from '@@/form-components/FormError';

import { DeploymentType } from '../../types';

interface Props {
  values: DeploymentType;
  onChange(values: DeploymentType): void;
  errors: FormikErrors<DeploymentType>;
  supportGlobalDeployment: boolean;
}

export function AppDeploymentTypeFormSection({
  values,
  onChange,
  errors,
  supportGlobalDeployment,
}: Props) {
  const options = getOptions(supportGlobalDeployment);

  return (
    <FormSection title="部署">
      <TextTip color="blue">
        选择要在集群中部署应用的方式。
      </TextTip>
      <BoxSelector
        slim
        options={options}
        value={values}
        onChange={onChange}
        radioName="deploymentType"
      />
      {!!errors && <FormError>{errors}</FormError>}
    </FormSection>
  );
}

function getOptions(
  supportGlobalDeployment: boolean
): ReadonlyArray<BoxSelectorOption<DeploymentType>> {
  return [
    {
      id: 'deployment_replicated',
      label: '副本',
      value: 'Replicated',
      icon: Sliders,
      iconType: 'badge',
      description: '运行此容器的一个或多个实例',
    },
    {
      id: 'deployment_global',
      disabled: () => !supportGlobalDeployment,
      tooltip: () =>
        !supportGlobalDeployment
          ? '用于持久化文件夹的存储或访问策略无法与此选项一起使用'
          : '',
      label: '全局',
      description:
        '应用将以 DaemonSet 方式部署，在集群的每个节点上运行一个实例',
      value: 'Global',
      icon: Boxes,
      iconType: 'badge',
    },
  ] as const;
}
