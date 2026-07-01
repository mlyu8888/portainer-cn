import { Badge } from '@@/Badge';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

export function RestrictedSecretBadge() {
  return (
    <TooltipWithChildren message="您只能查看自己在 Portainer 中创建的密钥详情">
      <div className="min-w-min">
        <Badge type="warn">受限制</Badge>
      </div>
    </TooltipWithChildren>
  );
}
