import { useState } from 'react';

import { Modal, openModal } from '@@/modals';
import { Button } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';

function UpdateIngressPrompt({
  onSubmit,
  title,
  hasOneIngress,
  hasOnePort,
}: {
  onSubmit: (value?: { noMatch: boolean }) => void;
  title: string;
  hasOneIngress: boolean;
  hasOnePort: boolean;
}) {
  const [value, setValue] = useState(false);

  const rulePlural = !hasOneIngress ? 'rules' : 'rule';
  const noMatchSentence = !hasOnePort
    ? `此应用中的服务端口不再匹配入口 ${rulePlural}。`
    : `此应用中的服务端口不再匹配入口 ${rulePlural}，这可能会破坏入口规则路径。`;
  const inputLabel = `更新入口 ${rulePlural} 以匹配服务端口更改`;

  return (
    <Modal onDismiss={() => onSubmit()} aria-label={title}>
      <Modal.Header title={title} />

      <Modal.Body>
        <ul className="ml-3">
          <li>更新应用可能会导致服务中断。</li>
          <li>{noMatchSentence}</li>
        </ul>

        <SwitchField
          name="noMatch"
          data-cy="kube-update-ingress-prompt-switch"
          label={inputLabel}
          checked={value}
          onChange={setValue}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => onSubmit({ noMatch: value })}
          color="primary"
          data-cy="update-ingress-confirm-button"
        >
          更新
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function confirmUpdateAppIngress(
  ingressesToUpdate: Array<unknown>,
  servicePortsToUpdate: Array<unknown>
) {
  const hasOneIngress = ingressesToUpdate.length === 1;
  const hasOnePort = servicePortsToUpdate.length === 1;

  return openModal(UpdateIngressPrompt, {
    title: '确定吗？',
    hasOneIngress,
    hasOnePort,
  });
}
