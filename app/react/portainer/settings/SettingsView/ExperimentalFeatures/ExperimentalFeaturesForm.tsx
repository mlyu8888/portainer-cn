import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useCallback } from 'react';
import { FlaskConical } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';
import { ExperimentalFeatures } from '@/react/portainer/settings/types';
import { useUpdateExperimentalSettingsMutation } from '@/react/portainer/settings/queries';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';

interface FormValues {}

const validation = yup.object({});

interface Props {
  settings: ExperimentalFeatures;
}

export function ExperimentalFeaturesSettingsForm({ settings }: Props) {
  const initialValues: FormValues = settings;

  const mutation = useUpdateExperimentalSettingsMutation();

  const { mutate: updateSettings } = mutation;

  const handleSubmit = useCallback(() => {
    updateSettings(
      {},
      {
        onSuccess() {
          notifySuccess(
            '成功',
            '实验性功能设置已成功更新'
          );
        },
      }
    );
  }, [updateSettings]);

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validation}
      validateOnMount
      enableReinitialize
    >
      {({ isValid, dirty }) => (
        <Form className="form-horizontal">
          <TextTip color="blue" icon={FlaskConical}>
            实验性功能可能随时停止，恕不另行通知。
          </TextTip>

          <br />
          <br />

          <div className="form-group col-sm-12 text-muted small">
            在 Portainer 版本中，我们可能会推出正在试验的功能。这些功能处于开发的早期阶段，经过有限的测试。<br />我们的目标是获取早期用户反馈，以便我们能够改进、增强并最终使我们的功能达到最佳。禁用实验性功能将阻止访问该功能。
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                loadingText="正在保存设置..."
                isLoading={mutation.isLoading}
                disabled={!isValid || !dirty}
                className="!ml-0"
                data-cy="settings-experimentalButton"
              >
                保存实验性设置
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
