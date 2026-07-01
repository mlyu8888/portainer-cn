import { number, string, object, SchemaOf } from 'yup';
import { FormikErrors } from 'formik';

import { FormSection } from '@@/form-components/FormSection';
import { RadioGroup } from '@@/RadioGroup/RadioGroup';
import { Input } from '@@/form-components/Input';
import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Button, ButtonGroup } from '@@/buttons';

import { StaggerParallelFieldset } from './StaggerParallelFieldset';
import {
  StaggerConfig,
  StaggerOption,
  StaggerParallelOption,
  UpdateFailureAction,
} from './StaggerFieldset.types';

interface Props {
  values: StaggerConfig;
  onChange: (value: Partial<StaggerConfig>) => void;
  errors?: FormikErrors<StaggerConfig>;
  isEdit?: boolean;
}

const staggerOptions = [
  {
    value: StaggerOption.AllAtOnce,
    label: '所有边缘设备同时更新',
  },
  {
    value: StaggerOption.Parallel,
    label: '并行更新边缘设备',
  },
] as const;

export function StaggerFieldset({
  values,
  onChange,
  errors,
  isEdit = true,
}: Props) {
  return (
    <FormSection title="更新配置">
      {!isEdit && (
        <div className="form-group">
          <div className="col-sm-12">
            <TextTip color="blue">
        请注意，&apos;更新配置&apos;设置仅在边缘堆栈更新时生效，无论是手动触发、通过回调钩子事件还是 GitOps 更新流程
            </TextTip>
          </div>
        </div>
      )}

      <div className="form-group">
        <div className="col-sm-12">
          <RadioGroup
            options={staggerOptions}
            selectedOption={values.StaggerOption}
            onOptionChange={(value) => {
              handleChange({ StaggerOption: value });
            }}
            name="StaggerOption"
          />
        </div>
      </div>

      {values.StaggerOption === StaggerOption.Parallel && (
        <div className="mb-2">
          <TextTip color="blue">
            指定要同时更新的设备数量。
            {values.StaggerParallelOption ===
              StaggerParallelOption.Incremental && (
              <div className="mb-2">
                例如，如果从 2 台设备开始并乘以 5，更新将首先覆盖 2 台边缘设备，然后是 10 台设备（2 x 5），接着是 50 台设备（10 x 5），依此类推。
              </div>
            )}
          </TextTip>

          <StaggerParallelFieldset
            values={values}
            onChange={handleChange}
            errors={errors}
          />

          <FormControl
            label="超时时间"
            inputId="timeout"
            errors={errors?.Timeout}
          >
            <div>
              <div style={{ display: 'inline-block', width: '150px' }}>
                <Input
                  name="Timeout"
                  id="stagger-timeout"
                  placeholder="例如：5（可选）"
                  value={values.Timeout}
                  onChange={(e) =>
                    handleChange({
                      Timeout: e.currentTarget.value,
                    })
                  }
                  data-cy="edge-stacks-stagger-timeout-input"
                />
              </div>
              <span> {' 分钟 '} </span>
            </div>
          </FormControl>

          <FormControl
            label="更新延迟"
            inputId="update-delay"
            errors={errors?.UpdateDelay}
          >
            <div>
              <div style={{ display: 'inline-block', width: '150px' }}>
                <Input
                  name="UpdateDelay"
                  data-cy="edge-stacks-stagger-update-delay-input"
                  id="stagger-update-delay"
                  placeholder="例如：5（可选）"
                  value={values.UpdateDelay}
                  onChange={(e) =>
                    handleChange({
                      UpdateDelay: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <span> {' 分钟 '} </span>
            </div>
          </FormControl>

          <FormControl
            label="更新失败操作"
            inputId="update-failure-action"
            errors={errors?.UpdateFailureAction}
          >
            <ButtonGroup>
              <Button
                className="btn-box-shadow"
                data-cy="edge-stacks-stagger-update-failure-action-continue-button"
                color={
                  values.UpdateFailureAction === UpdateFailureAction.Continue
                    ? 'primary'
                    : 'light'
                }
                onClick={() =>
                  handleChange({
                    UpdateFailureAction: UpdateFailureAction.Continue,
                  })
                }
              >
                继续
              </Button>
              <Button
                className="btn-box-shadow"
                data-cy="edge-stacks-stagger-update-failure-action-pause-button"
                color={
                  values.UpdateFailureAction === UpdateFailureAction.Pause
                    ? 'primary'
                    : 'light'
                }
                onClick={() =>
                  handleChange({
                    UpdateFailureAction: UpdateFailureAction.Pause,
                  })
                }
              >
                暂停
              </Button>
              <Button
                className="btn-box-shadow"
                data-cy="edge-stacks-stagger-update-failure-action-rollback-button"
                color={
                  values.UpdateFailureAction === UpdateFailureAction.Rollback
                    ? 'primary'
                    : 'light'
                }
                onClick={() =>
                  handleChange({
                    UpdateFailureAction: UpdateFailureAction.Rollback,
                  })
                }
              >
                回滚
              </Button>
            </ButtonGroup>
          </FormControl>
        </div>
      )}
    </FormSection>
  );

  function handleChange(partialValue: Partial<StaggerConfig>) {
    onChange(partialValue);
    // setControlledValues((values) => ({ ...values, ...partialValue }));
  }
}

export function staggerConfigValidation(): SchemaOf<StaggerConfig> {
  return object({
    StaggerOption: number()
      .oneOf([StaggerOption.AllAtOnce, StaggerOption.Parallel])
      .required('分批选项是必填项'),
    StaggerParallelOption: number()
      .when('StaggerOption', {
        is: StaggerOption.Parallel,
        then: (schema) =>
          schema.oneOf([
            StaggerParallelOption.Fixed,
            StaggerParallelOption.Incremental,
          ]),
      })
      .optional(),
    DeviceNumber: number()
      .default(0)
      .when('StaggerOption', {
        is: StaggerOption.Parallel,
        then: (schema) =>
          schema.when('StaggerParallelOption', {
            is: StaggerParallelOption.Fixed,
            then: (schema) =>
              schema
                .required('设备数至少为 1')
                .min(1, '设备数至少为 1'),
          }),
      })
      .optional(),
    DeviceNumberStartFrom: number()
      .when('StaggerOption', {
        is: StaggerOption.Parallel,
        then: (schema) =>
          schema.when('StaggerParallelOption', {
            is: StaggerParallelOption.Incremental,
            then: (schema) =>
              schema
                .min(1, '设备起始数至少为 1')
                .required('设备数是必填项'),
          }),
      })
      .optional(),
    DeviceNumberIncrementBy: number()
      .default(2)
      .when('StaggerOption', {
        is: StaggerOption.Parallel,
        then: (schema) =>
          schema.when('StaggerParallelOption', {
            is: StaggerParallelOption.Incremental,
            then: (schema) =>
              schema
                .min(2)
                .max(10)
                .required('设备递增数是必填项'),
          }),
      })
      .optional(),
    Timeout: string()
      .default('')
      .when('StaggerOption', {
        is: StaggerOption.Parallel,
        then: (schema) =>
          schema.test(
            'is-number',
            '超时必须为数字',
            (value) => !Number.isNaN(Number(value))
          ),
      })
      .optional(),
    UpdateDelay: string()
      .default('')
      .when('StaggerOption', {
        is: StaggerOption.Parallel,
        then: (schema) =>
          schema.test(
            'is-number',
            '超时必须为数字',
            (value) => !Number.isNaN(Number(value))
          ),
      })
      .optional(),
    UpdateFailureAction: number()
      .default(UpdateFailureAction.Continue)
      .when('StaggerOption', {
        is: StaggerOption.Parallel,
        then: (schema) =>
          schema.oneOf([
            UpdateFailureAction.Continue,
            UpdateFailureAction.Pause,
            UpdateFailureAction.Rollback,
          ]),
      })
      .optional(),
  });
}
