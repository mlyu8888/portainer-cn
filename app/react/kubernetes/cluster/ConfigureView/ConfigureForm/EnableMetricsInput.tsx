import { Field, useFormikContext } from 'formik';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

import { useGetMetricsMutation } from '@/react/kubernetes/queries/useGetMetricsMutation';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Switch } from '@@/form-components/SwitchField/Switch';
import { InlineLoader } from '@@/InlineLoader';

import { ConfigureFormValues } from './types';

type Props = {
  environmentId: number;
  value: boolean;
  error?: string;
};

export function EnableMetricsInput({ value, error, environmentId }: Props) {
  const { setFieldValue } = useFormikContext<ConfigureFormValues>();
  const [metricsFound, setMetricsFound] = useState<boolean>();
  const getMetricsMutation = useGetMetricsMutation();
  return (
    <div className="mb-4">
      <TextTip color="blue">
        <p>
          启用指标功能后，用户可以使用水平容器组自动伸缩，并查看容器和节点资源使用情况。这需要在集群中运行{' '}
          <a
            href="https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server"
            target="_blank"
            rel="noreferrer"
          >
            metrics server
          </a>{' '}
          或{' '}
          <a
            href="https://github.com/kubernetes-sigs/prometheus-adapter"
            target="_blank"
            rel="noreferrer"
          >
            prometheus
          </a>
          。
        </p>
        <p>
          如果后续禁用此功能，已部署且带有自动伸缩的应用仍将继续自动伸缩（需要移除自动伸缩定义才能停止）。
        </p>
      </TextTip>
      <FormControl
        label="启用使用指标 API 的功能"
        className="mb-0"
        size="large"
        errors={error}
        inputId="kubeSetup-metricsToggle"
      >
        <Field
          name="useServerMetrics"
          as={Switch}
          checked={value}
          id="kubeSetup-metricsToggle"
          onChange={(checked: boolean) => {
            // if turning off, just set the value
            if (!checked) {
              setFieldValue('useServerMetrics', checked);
              return;
            }
            // if turning on, see if the metrics server is available, then set the value to on if it is
            getMetricsMutation.mutate(environmentId, {
              onSuccess: () => {
                setMetricsFound(true);
                setFieldValue('useServerMetrics', checked);
              },
              onError: () => {
                setMetricsFound(false);
              },
            });
          }}
          data-cy="kubeSetup-metricsToggle"
        />
      </FormControl>
      {getMetricsMutation.isLoading && (
        <InlineLoader size="sm">正在检查指标 API...</InlineLoader>
      )}
      {!getMetricsMutation.isLoading && (
        <>
          {metricsFound === false && (
            <TextTip color="red" icon={XCircle}>
              无法访问指标 API，请确保指标服务器已正确部署到集群中。
            </TextTip>
          )}
          {metricsFound === true && (
            <TextTip color="green" icon={CheckCircle}>
              已成功连接指标 API
            </TextTip>
          )}
        </>
      )}
    </div>
  );
}
