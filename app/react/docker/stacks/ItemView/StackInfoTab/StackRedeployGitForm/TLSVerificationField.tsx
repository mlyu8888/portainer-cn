import { confirmEnableTLSVerify } from '@/react/portainer/gitops/utils';

import { SwitchField } from '@@/form-components/SwitchField';

interface Props {
  value: boolean;
  initialValue: boolean;
  onChange: (value: boolean) => void;
}

export function TLSVerificationField({ value, initialValue, onChange }: Props) {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <SwitchField
          name="TLSSkipVerify"
          checked={value}
          tooltip="启用此选项将允许跳过任何自签名证书的 TLS 验证。"
          labelClass="col-sm-3 col-lg-2"
          label="跳过 TLS 验证"
          onChange={async (newValue) => {
            if (initialValue && !newValue) {
              const confirmed = await confirmEnableTLSVerify();
              if (!confirmed) {
                return;
              }
            }

            onChange(newValue);
          }}
          data-cy="gitops-skip-tls-verification-switch"
        />
      </div>
    </div>
  );
}
