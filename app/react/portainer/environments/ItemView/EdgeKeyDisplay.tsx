import { CopyButton } from '@@/buttons';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { Code } from '@@/Code';

export function EdgeKeyDisplay({ edgeKey }: { edgeKey: string }) {
  return (
    <FormSection title="加入令牌">
      <TextTip color="blue">
        对于预部署边缘 Agent，请使用以下加入令牌将边缘 Agent 与此环境关联。
      </TextTip>

      <p className="small text-muted mt-2">
        您可以在用户指南中了解更多关于预部署的信息，请访问{' '}
        <a href="https://downloads.portainer.io/edge_agent_guide.pdf">此处。</a>
      </p>

      <Code>{edgeKey}</Code>

      <CopyButton
        copyText={edgeKey}
        className="mt-2"
        data-cy="copy-edge-key-button"
      >
        复制令牌
      </CopyButton>
    </FormSection>
  );
}
