import { TextTip } from '@@/Tip/TextTip';
import { SwitchField } from '@@/form-components/SwitchField';

export function WebhookSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <div className="form-section-title"> 回调钩子 </div>
      <SwitchField
        label="创建边缘堆栈回调钩子"
        checked={value}
        onChange={onChange}
        tooltip="创建回调钩子（或回调 URI）以自动更新此堆栈。向此回调 URI 发送 POST 请求（无需任何认证）将拉取关联镜像的最新版本并重新部署此堆栈。"
        labelClass="col-sm-3 col-lg-2"
        data-cy="webhook-switch"
      />

      {value && (
        <TextTip>
          向回调钩子发送环境变量将使用新值更新堆栈。新的变量名称将添加到堆栈中，现有变量将被更新。
        </TextTip>
      )}
    </div>
  );
}
