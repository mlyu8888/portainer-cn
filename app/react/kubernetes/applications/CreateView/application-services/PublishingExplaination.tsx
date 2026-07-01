import ingressDiagram from '@/assets/images/ingress-explanatory-diagram.png';

import { FormSection } from '@@/form-components/FormSection';

export function PublishingExplaination() {
  return (
    <FormSection title="说明" isFoldable titleSize="sm">
      <div className="w-full mb-4 flex flex-col items-start lg:flex-row">
        <img
          src={ingressDiagram}
          alt="ingress explaination"
          width={646}
          className="flex w-full max-w-2xl basis-1/2 flex-col rounded border border-solid border-gray-5 object-contain lg:w-1/2"
        />
        <div className="text-muted ml-8 basis-1/2 text-xs">
          通过{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/service/"
            target="_blank"
            rel="noopener noreferrer"
          >
            服务
          </a>{' '}
          和{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/ingress/"
            target="_blank"
            rel="noopener noreferrer"
          >
            入口
          </a>
          暴露应用工作负载：
          <ul className="ml-5 mt-3 [&>li>ul>li]:ml-5 [&>li]:mb-3">
            <li>
              <b>仅</b>集群<b>
                <i>内部</i>
              </b>{' '}
              - 通过 <b>ClusterIP</b> 服务
              <ul>
                <li>
                  <i>默认服务类型。</i>
                </li>
              </ul>
            </li>
            <li>
              通过 <b>ClusterIP</b> 服务<b>集群内部</b>，以及通过<b>入口</b><b>外部</b>
              <ul>
                <li>
                  <i>
                    入口管理对集群内（通常是 ClusterIP）服务的外部访问，并允许定义路由规则、SSL 终止和其他高级功能。
                  </i>
                </li>
              </ul>
            </li>
            <li>
              通过 <b>NodePort</b> 服务<b>集群内外</b>
              <ul>
                <li>
                  <i>
                  这在每个节点上的静态端口上发布工作负载，允许通过节点的 IP 地址和端口进行外部访问。通常不建议用于生产环境。
                  </i>
                </li>
              </ul>
            </li>
            <li>
              通过 <b>LoadBalancer</b> 服务<b>集群内外</b>
              <ul>
                <li>
                  <i>
                    如果在云平台上运行，这将自动配置云负载均衡器，并分配一个外部 IP 地址或 DNS 来将流量路由到工作负载。
                  </i>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}
