import { FileCode, Lock } from 'lucide-react';

import { KubernetesConfigurationKinds } from '@/kubernetes/models/configuration/models';

import { BoxSelectorOption } from '@@/BoxSelector';

export const typeOptions: ReadonlyArray<BoxSelectorOption<number>> = [
  {
    id: 'type_basic',
    value: KubernetesConfigurationKinds.CONFIGMAP,
    icon: FileCode,
    iconType: 'badge',
    label: '配置映射',
    description: '此类保存非敏感信息',
  },
  {
    id: 'type_secret',
    value: KubernetesConfigurationKinds.SECRET,
    icon: Lock,
    iconType: 'badge',
    label: '密钥',
    description: '此类保存敏感信息',
  },
] as const;
