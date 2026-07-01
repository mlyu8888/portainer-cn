import { Form, Formik } from 'formik';

import { addPlural } from '@/portainer/helpers/strings';
import { useUpdateEnvironmentsRelationsMutation } from '@/react/portainer/environments/queries/useUpdateEnvironmentsRelationsMutation';
import { notifySuccess } from '@/portainer/services/notifications';
import { BetaAlert } from '@/react/portainer/environments/update-schedules/common/BetaAlert';

import { Checkbox } from '@@/form-components/Checkbox';
import { FormControl } from '@@/form-components/FormControl';
import { OnSubmit, Modal } from '@@/modals';
import { TextTip } from '@@/Tip/TextTip';
import { Button, LoadingButton } from '@@/buttons';

import { WaitingRoomEnvironment } from '../../types';

import { GroupSelector, EdgeGroupsSelector, TagSelector } from './Selectors';
import { FormValues } from './types';
import { isAssignedToGroup } from './utils';
import { createPayload } from './createPayload';

export function AssignmentDialog({
  onSubmit,
  environments,
}: {
  onSubmit: OnSubmit<boolean>;
  environments: Array<WaitingRoomEnvironment>;
}) {
  const assignRelationsMutation = useUpdateEnvironmentsRelationsMutation();

  const initialValues: FormValues = {
    group: 1,
    overrideGroup: false,
    edgeGroups: [],
    overrideEdgeGroups: false,
    tags: [],
    overrideTags: false,
  };

  const hasPreAssignedEdgeGroups = environments.some(
    (e) => e.EdgeGroups?.length > 0
  );
  const hasPreAssignedTags = environments.some((e) => e.TagIds.length > 0);
  const hasPreAssignedGroup = environments.some((e) => isAssignedToGroup(e));

  return (
    <Modal
      aria-label="关联并分配"
      onDismiss={() => onSubmit()}
      size="lg"
    >
      <Modal.Header
        title={`关联并分配（${addPlural(
          environments.length,
          '已选边缘环境'
        )}）`}
      />
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ values, setFieldValue, errors }) => (
          <Form noValidate>
            <Modal.Body>
              <div>
                <FormControl
                  size="vertical"
                  label="分组"
                  tooltip="用于通过用户访问管理 RBAC"
                  errors={errors.group}
                >
                  <GroupSelector />

                  {hasPreAssignedGroup && (
                    <div className="mt-2">
                      <Checkbox
                        label="覆盖预分配分组"
                        data-cy="override-group-checkbox"
                        id="overrideGroup"
                        bold={false}
                        checked={values.overrideGroup}
                        onChange={(e) =>
                          setFieldValue('overrideGroup', e.target.checked)
                        }
                      />
                    </div>
                  )}
                </FormControl>

                <FormControl
                  size="vertical"
                  label="边缘组"
                  tooltip="管理边缘任务和边缘堆栈部署所需"
                  errors={errors.edgeGroups}
                >
                  <EdgeGroupsSelector />

                  {hasPreAssignedEdgeGroups && (
                    <div className="mt-2">
                      <Checkbox
                        label="覆盖预分配边缘组"
                        data-cy="override-edge-groups-checkbox"
                        bold={false}
                        id="overrideEdgeGroups"
                        checked={values.overrideEdgeGroups}
                        onChange={(e) =>
                          setFieldValue('overrideEdgeGroups', e.target.checked)
                        }
                      />
                    </div>
                  )}
                </FormControl>

                <div className="mb-3">
                  <TextTip color="blue">
                    在此创建的边缘组仅为静态类型，使用标签可分配给动态边缘组
                  </TextTip>
                </div>

                <FormControl
                  size="vertical"
                  label="标签"
                  tooltip="分配标签将自动将环境填充到具有这些标签的动态边缘组以及部署到该边缘组的任何任务或堆栈中"
                  errors={errors.tags}
                >
                  <TagSelector />

                  {hasPreAssignedTags && (
                    <div className="mt-2">
                      <Checkbox
                        label="覆盖预分配标签"
                        data-cy="override-tags-checkbox"
                        bold={false}
                        id="overrideTags"
                        checked={values.overrideTags}
                        onChange={(e) =>
                          setFieldValue('overrideTags', e.target.checked)
                        }
                      />
                    </div>
                  )}
                </FormControl>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => onSubmit()}
                color="default"
                data-cy="waiting-room-cancel-assignment-button"
              >
                取消
              </Button>
              <LoadingButton
                isLoading={assignRelationsMutation.isLoading}
                data-cy="waiting-room-associate-button"
                loadingText="关联中..."
              >
                关联
              </LoadingButton>
            </Modal.Footer>
            <div className="mt-2">
              <BetaAlert
                message={
                  <>
                    <b>测试版功能</b> - 此功能目前处于测试阶段，部分功能可能无法按预期工作。
                  </>
                }
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  function handleSubmit(values: FormValues) {
    assignRelationsMutation.mutate(
      Object.fromEntries(environments.map((e) => createPayload(e, values))),
      {
        onSuccess: () => {
          notifySuccess('成功', '边缘环境分配成功');
          onSubmit(true);
        },
      }
    );
  }
}
