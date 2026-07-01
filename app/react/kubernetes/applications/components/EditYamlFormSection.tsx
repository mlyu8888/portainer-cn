import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useEnvironmentDeploymentOptions } from '@/react/portainer/environments/queries/useEnvironment';
import { useAuthorizations } from '@/react/hooks/useUser';

import { WebEditorForm } from '@@/WebEditorForm';
import { TextTip } from '@@/Tip/TextTip';

type StackFileContent = string;

type Props = {
  values: StackFileContent;
  onChange: (values: StackFileContent) => void;
  isComposeFormat?: boolean;
};

export function EditYamlFormSection({
  values,
  onChange,
  isComposeFormat,
}: Props) {
  // check if the user is allowed to edit the yaml
  const environmentId = useEnvironmentId();
  const { data: deploymentOptions } =
    useEnvironmentDeploymentOptions(environmentId);
  const { authorized: roleHasAuth } = useAuthorizations('K8sYAMLW');
  const isAllowedToEdit = roleHasAuth && !deploymentOptions?.hideWebEditor;
  const formId = 'kubernetes-deploy-editor';

  return (
    <div>
      <WebEditorForm
        data-cy="k8s-yaml-editor"
        value={values}
        readonly={!isAllowedToEdit}
        titleContent={<TitleContent isComposeFormat={isComposeFormat} />}
        onChange={(values) => onChange(values)}
        id={formId}
        textTip="在此定义或粘贴清单文件的内容"
        type="yaml"
      />
    </div>
  );
}

function TitleContent({ isComposeFormat }: { isComposeFormat?: boolean }) {
  return (
    <>
      {isComposeFormat && (
        <TextTip color="orange">
          <p>
            Portainer 不再支持{' '}
            <a
              href="https://docs.docker.com/compose/compose-file/"
              target="_blank"
              rel="noreferrer"
            >
              docker-compose
            </a>{' '}
            格式的 Kubernetes 部署清单，并且我们已移除支持此功能的{' '}
            <a href="https://kompose.io/" target="_blank" rel="noreferrer">
              Kompose
            </a>{' '}
            转换工具。原因是 Kompose 存在安全风险，因为它有多个通用漏洞与暴露（CVE）。
          </p>
          <p>
          遗憾的是，虽然 Kompose 项目有维护者并且是 CNCF 的一部分，但它并未得到积极维护。发版频率很低，而且对该项目的新拉取请求（包括我们提交的）需要数月才能合并，同时新 CVE 不断出现。
          </p>
          <p>
          建议您在沙箱环境中安装自己的 Kompose 实例，将 Docker Compose 文件转换为 Kubernetes 清单，然后使用这些清单来设置应用。
          </p>
        </TextTip>
      )}
      {!isComposeFormat && (
        <TextTip color="blue">
          <p>
          此功能允许您在此环境中部署任何类型的 Kubernetes 资源（部署、密钥、配置映射...）。
          </p>
          <p>
            您可以在{' '}
            <a
              href="https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/"
              target="_blank"
              rel="noreferrer"
            >
              官方文档
            </a>
            中了解更多关于 Kubernetes 文件格式的信息。
          </p>
        </TextTip>
      )}
    </>
  );
}
