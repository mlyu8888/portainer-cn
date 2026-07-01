import { InsightsBox } from '@@/InsightsBox';

export function HelmInsightsBox() {
  return (
    <InsightsBox
      header="Helm 选项"
      content={
        <span>
          从 2.20 版本开始，Helm 菜单侧边栏选项已移至{' '}
          <strong>从代码创建</strong> - 通过上方按钮访问。
        </span>
      }
      insightCloseId="k8s-helm"
    />
  );
}
