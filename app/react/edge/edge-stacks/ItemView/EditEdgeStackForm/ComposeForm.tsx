import { useFormikContext } from 'formik';

import { useDockerComposeSchema } from '@/react/hooks/useDockerComposeSchema/useDockerComposeSchema';

import { TextTip } from '@@/Tip/TextTip';
import { WebEditorForm } from '@@/WebEditorForm';

import { DeploymentType } from '../../types';

import { FormValues } from './types';

export function ComposeForm({
  handleContentChange,
  hasKubeEndpoint,
  handleVersionChange,
  versionOptions,
}: {
  hasKubeEndpoint: boolean;
  handleContentChange: (type: DeploymentType, content: string) => void;
  handleVersionChange: (newVersion: number) => void;
  versionOptions: number[] | undefined;
}) {
  const { errors, values } = useFormikContext<FormValues>();
  const { data: dockerComposeSchema } = useDockerComposeSchema();

  return (
    <>
      {hasKubeEndpoint && (
        <TextTip>
          <p>
            Portainer 不再支持{' '}
            <a
              href="https://docs.docker.com/compose/compose-file/"
              target="_blank"
              rel="noreferrer"
            >
              docker-compose
            </a>{' '}
            格式的 Kubernetes 部署清单，并且我们已经移除了支持此功能的{' '}
            <a href="https://kompose.io/" target="_blank" rel="noreferrer">
              Kompose
            </a>{' '}
            转换工具。原因是 Kompose 现在存在安全风险，因为它有多个常见漏洞和暴露（CVE）。
          </p>
          <p>
            不幸的是，尽管 Kompose 项目有维护者并且是 CNCF 的一部分，但它并没有得到积极维护。发布频率很低，新的拉取请求（包括我们提交的）需要数月才能合并，同时新的 CVE 不断出现。
          </p>
          <p>
            我们建议在沙箱环境中安装您自己的 Kompose 实例，将 Docker Compose 文件转换为 Kubernetes 清单，并使用这些清单来设置应用程序。
          </p>
        </TextTip>
      )}

      <WebEditorForm
        data-cy="compose-editor"
        value={values.content}
        type="yaml"
        schema={dockerComposeSchema}
        id="compose-editor"
        textTip="在此定义或粘贴 docker compose 文件内容"
        onChange={(value) => handleContentChange(DeploymentType.Compose, value)}
        error={errors.content}
        readonly={hasKubeEndpoint}
        versions={versionOptions}
        onVersionChange={handleVersionChange}
      >
        <div>
          您可以在{' '}
          <a
            href="https://docs.docker.com/compose/compose-file/"
            target="_blank"
            rel="noreferrer"
          >
            官方文档
          </a>
          中获取更多关于 Compose 文件格式的信息。
        </div>
      </WebEditorForm>
    </>
  );
}
