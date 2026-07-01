import { Shield } from 'lucide-react';

import { BoxSelectorOption } from '@@/BoxSelector';

export const tlsOptions: ReadonlyArray<BoxSelectorOption<string>> = [
  {
    id: 'tls_client_ca',
    value: 'tls_client_ca',
    icon: Shield,
    iconType: 'badge',
    label: 'TLS 服务器和客户端验证',
    description: '使用客户端证书和服务器验证',
  },
  {
    id: 'tls_client_noca',
    value: 'tls_client_noca',
    icon: Shield,
    iconType: 'badge',
    label: '仅 TLS 客户端验证',
    description: '使用客户端证书但不进行服务器验证',
  },
  {
    id: 'tls_ca',
    value: 'tls_ca',
    icon: Shield,
    iconType: 'badge',
    label: '仅 TLS 服务器验证',
    description: '仅验证服务器证书',
  },
  {
    id: 'tls_only',
    value: 'tls_only',
    icon: Shield,
    iconType: 'badge',
    label: '仅 TLS',
    description: '无服务器/客户端验证',
  },
] as const;
