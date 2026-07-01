import { Check, CheckCircle } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';
import { useDeleteEnvironmentsMutation } from '@/react/portainer/environments/ListView/useDeleteEnvironmentsMutation';
import { Environment } from '@/react/portainer/environments/types';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { useIsPureAdmin } from '@/react/hooks/useUser';

import { Button } from '@@/buttons';
import { openModal } from '@@/modals';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { useAssociateDeviceMutation, useLicenseOverused } from '../queries';
import { WaitingRoomEnvironment } from '../types';

import { AssignmentDialog } from './AssignmentDialog/AssignmentDialog';

const overusedTooltip = (
  <>
    设备关联已禁用，因为您的节点数已超过许可证限制
  </>
);

export function TableActions({
  selectedRows,
}: {
  selectedRows: WaitingRoomEnvironment[];
}) {
  const isPureAdmin = useIsPureAdmin();
  const associateMutation = useAssociateDeviceMutation();
  const removeMutation = useDeleteEnvironmentsMutation();
  const licenseOverused = useLicenseOverused(selectedRows.length);

  return (
    <>
      <DeleteButton
        onConfirmed={() => handleRemoveDevice(selectedRows)}
        disabled={selectedRows.length === 0}
        data-cy="remove-device-button"
        confirmMessage="您即将从等候室移除边缘设备，这些设备在下次代理启动之前不会显示。"
      >
        移除设备
      </DeleteButton>

      <TooltipWithChildren
        message={
          licenseOverused ? (
            overusedTooltip
          ) : (
            <>
              关联设备并分配边缘组、分组和标签，包含覆盖选项
            </>
          )
        }
      >
        <span>
          <Button
            onClick={() => handleAssociateAndAssign(selectedRows)}
            data-cy="associate-and-assign-button"
            disabled={
              selectedRows.length === 0 || licenseOverused || !isPureAdmin
            }
            color="secondary"
            icon={CheckCircle}
          >
            关联并分配
          </Button>
        </span>
      </TooltipWithChildren>

      <TooltipWithChildren
        message={
          licenseOverused ? (
            overusedTooltip
          ) : (
            <>
              根据设备预分配的边缘组、分组和标签进行关联
            </>
          )
        }
      >
        <span>
          <Button
            onClick={() => handleAssociateDevice(selectedRows)}
            data-cy="associate-device-button"
            disabled={selectedRows.length === 0 || licenseOverused}
            icon={Check}
          >
            关联设备
          </Button>
        </span>
      </TooltipWithChildren>
    </>
  );

  async function handleAssociateAndAssign(
    environments: WaitingRoomEnvironment[]
  ) {
    const assigned = await openModal(withReactQuery(AssignmentDialog), {
      environments,
    });

    if (!assigned) {
      return;
    }

    handleAssociateDevice(environments);
  }

  function handleAssociateDevice(devices: Environment[]) {
    associateMutation.mutate(
      devices.map((d) => d.Id),
      {
        onSuccess() {
          notifySuccess('成功', '边缘设备关联成功');
        },
      }
    );
  }

  async function handleRemoveDevice(devices: Environment[]) {
    removeMutation.mutate(
      devices.map((d) => ({ id: d.Id, name: d.Name })),
      {
        onSuccess() {
          notifySuccess('成功', '边缘设备已成功隐藏');
        },
      }
    );
  }
}
