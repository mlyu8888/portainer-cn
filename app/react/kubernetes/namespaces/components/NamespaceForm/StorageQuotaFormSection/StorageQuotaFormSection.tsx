import { StorageClass } from '@/react/portainer/environments/types';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { StorageQuotaItem } from './StorageQuotaItem';

interface Props {
  storageClasses: StorageClass[];
}

export function StorageQuotaFormSection({ storageClasses }: Props) {
  return (
    <FormSection title="存储">
      <TextTip color="blue">
        可以为每个存储选项设置配额，以防止用户在部署应用程序时超过特定阈值。您可以将配额设置为 0 以有效防止在此命名空间内使用特定存储选项。
      </TextTip>

      {storageClasses.map((storageClass) => (
        <StorageQuotaItem key={storageClass.Name} storageClass={storageClass} />
      ))}
    </FormSection>
  );
}
