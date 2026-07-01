import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useTransitionHook } from '@uirouter/react';

import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { IngressClassDatatable } from '@/react/kubernetes/cluster/ingressClass/IngressClassDatatable';
import {
  Environment,
  EnvironmentId,
} from '@/react/portainer/environments/types';
import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { SwitchField } from '@@/form-components/SwitchField';
import { FormActions } from '@@/form-components/FormActions';
import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';
import { InsightsBox } from '@@/InsightsBox';

import { useIngressControllerClassMapQuery } from '../../ingressClass/useIngressControllerClassMap';
import { IngressControllerClassMap } from '../../ingressClass/types';
import { useIsRBACEnabled } from '../../useIsRBACEnabled';
import { getIngressClassesFormValues } from '../../ingressClass/IngressClassDatatable/utils';

import { useStorageClassesFormValues } from './useStorageClasses';
import { ConfigureFormValues, StorageClassFormValues } from './types';
import { configureValidationSchema } from './validation';
import { RBACAlert } from './RBACAlert';
import { EnableMetricsInput } from './EnableMetricsInput';
import { StorageClassDatatable } from './StorageClassDatatable';
import { useConfigureClusterMutation } from './useConfigureClusterMutation';
import { handleSubmitConfigureCluster } from './handleSubmitConfigureCluster';

export function ConfigureForm() {
  const configureClusterMutation = useConfigureClusterMutation();
  // get the initial values
  const { data: environment } = useCurrentEnvironment();
  const { data: storageClassFormValues } =
    useStorageClassesFormValues(environment);
  const { data: ingressClasses, ...ingressClassesQuery } =
    useIngressControllerClassMapQuery({
      environmentId: environment?.Id,
    });
  const initialValues = useInitialValues(
    environment,
    storageClassFormValues,
    ingressClasses
  );

  if (!initialValues || !environment) {
    return null;
  }

  return (
    <Formik<ConfigureFormValues>
      initialValues={initialValues}
      onSubmit={(
        values: ConfigureFormValues,
        formikHelpers: FormikHelpers<ConfigureFormValues>
      ) => {
        handleSubmitConfigureCluster(
          values,
          initialValues,
          configureClusterMutation,
          formikHelpers,
          environment
        );
      }}
      validationSchema={configureValidationSchema}
      validateOnMount
      enableReinitialize // enableReinitialize is needed to update the form values when the ingress classes data is fetched
    >
      {(formikProps) => (
        <InnerForm
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formikProps}
          isIngressClassesLoading={ingressClassesQuery.isLoading}
          environmentId={environment.Id}
        />
      )}
    </Formik>
  );
}

function InnerForm({
  initialValues,
  setFieldValue,
  isValid,
  isSubmitting,
  values,
  errors,
  isIngressClassesLoading,
  environmentId,
}: FormikProps<ConfigureFormValues> & {
  isIngressClassesLoading: boolean;
  environmentId: EnvironmentId;
}) {
  const { data: isRBACEnabled, ...isRBACEnabledQuery } =
    useIsRBACEnabled(environmentId);

  const onChangeControllers = useCallback(
    (controllerClassMap: IngressControllerClassMap[]) =>
      setFieldValue('ingressClasses', controllerClassMap),
    [setFieldValue]
  );

  // when navigating away from the page with unsaved changes, show a portainer prompt to confirm
  useTransitionHook('onBefore', {}, async () => {
    if (!isFormChanged(values, initialValues)) {
      return true;
    }
    const confirmed = await confirm({
      modalType: ModalType.Warn,
      title: '确定吗？',
      message:
        '集群设置视图中有未保存的更改。确定要离开吗？',
      confirmButton: buildConfirmButton('是', 'danger'),
    });
    return confirmed;
  });

  // when reloading or exiting the page with unsaved changes, show a browser prompt to confirm
  useEffect(() => {
    // the handler for showing the prompt
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
    function handler(event: BeforeUnloadEvent) {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    }

    // if the form is changed, then set the onbeforeunload
    if (isFormChanged(values, initialValues)) {
      window.addEventListener('beforeunload', handler);
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }
    return () => {};
  }, [values, initialValues]);

  return (
    <Form className="form-horizontal">
      <div className="flex flex-col">
        <FormSection title="网络 - 服务">
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                启用负载均衡器功能将允许用户通过云提供商分配的外部 IP 地址暴露其部署的应用。
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="orange" inline={false}>
                如果希望使用此功能，请确保您的云提供商允许创建负载均衡器。这可能会产生费用。
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="useLoadBalancer"
                data-cy="kubeSetup-loadBalancerToggle"
                label="允许用户使用外部负载均衡器"
                labelClass="col-sm-5 col-lg-4"
                checked={values.useLoadBalancer}
                onChange={(checked) =>
                  setFieldValue('useLoadBalancer', checked)
                }
              />
            </div>
          </div>
        </FormSection>
        <FormSection title="网络 - 入口">
          <IngressClassDatatable
            onChange={onChangeControllers}
            description="启用集群中的入口控制器后，它们将在 Portainer UI 中可用，供用户通过 HTTP/HTTPS 发布应用。控制器必须有类名才能被包含在此处。"
            values={values.ingressClasses}
            initialValues={initialValues.ingressClasses}
            isLoading={isIngressClassesLoading}
            view="cluster"
            noIngressControllerLabel="未找到支持的入口控制器。"
          />
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="allowNoneIngressClass"
                data-cy="kubeSetup-allowNoneIngressClass"
                label='允许将入口类设置为 "none"'
                tooltip='这允许用户设置入口时选择 "none" 作为入口类。'
                labelClass="col-sm-5 col-lg-4"
                checked={values.allowNoneIngressClass}
                onChange={(checked) => {
                  setFieldValue('allowNoneIngressClass', checked);
                  // add or remove the none ingress class from the ingress classes list
                  if (checked) {
                    setFieldValue(
                      'ingressClasses',
                      getIngressClassesFormValues(
                        checked,
                        initialValues.ingressClasses
                      )
                    );
                  }
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="ingressAvailabilityPerNamespace"
                data-cy="kubeSetup-ingressAvailabilityPerNamespace"
                label="按命名空间配置入口控制器可用性"
                tooltip="这允许管理员在每个命名空间中配置哪些入口控制器可供用户在为应用设置入口时选择。"
                labelClass="col-sm-5 col-lg-4"
                checked={values.ingressAvailabilityPerNamespace}
                onChange={(checked) =>
                  setFieldValue('ingressAvailabilityPerNamespace', checked)
                }
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="restrictStandardUserIngressW"
                data-cy="kubeSetup-restrictStandardUserIngressWToggle"
                label="仅允许管理员部署入口"
                featureId={FeatureId.K8S_ADM_ONLY_USR_INGRESS_DEPLY}
                tooltip="强制仅允许管理员部署入口（禁止普通用户部署）。"
                labelClass="col-sm-5 col-lg-4"
                checked={values.restrictStandardUserIngressW}
                onChange={(checked) =>
                  setFieldValue('restrictStandardUserIngressW', checked)
                }
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                您可以通过创建/编辑入口设置入口默认值（主机名和注解）。用户随后可以在创建/编辑应用时通过主机名下拉菜单选择它们。
              </TextTip>
            </div>
          </div>
        </FormSection>
        <FormSection title="变更窗口设置">
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="changeWindow.Enabled"
                data-cy="kubeSetup-changeWindowEnabledToggle"
                label="启用变更窗口"
                tooltip="在定义的变更窗口之外的堆栈或应用的 GitOps 更新将不会发生。"
                labelClass="col-sm-5 col-lg-4"
                checked={false}
                featureId={FeatureId.HIDE_AUTO_UPDATE_WINDOW}
                onChange={() => {}}
              />
            </div>
          </div>
        </FormSection>
        <FormSection title="安全">
          <div className="form-group">
            <div className="col-sm-12">
              {!isRBACEnabled && isRBACEnabledQuery.isSuccess && <RBACAlert />}
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                <p>
                  默认情况下，所有用户都可以访问 default 命名空间。启用此选项可设置对 default 命名空间的访问权限。
                </p>
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="restrictDefaultNamespace"
                data-cy="kubeSetup-restrictDefaultNsToggle"
                label="限制对 default 命名空间的访问"
                labelClass="col-sm-5 col-lg-4"
                checked={values.restrictDefaultNamespace}
                onChange={(checked) =>
                  setFieldValue('restrictDefaultNamespace', checked)
                }
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="restrictSecrets"
                data-cy="kubeSetup-restrictSecretsToggle"
                label="限制非管理员查看密钥内容（仅 UI）"
                tooltip="这隐藏了非管理员用户在 UI 中查看或编辑非自己创建的密钥内容的能力，但不阻止通过命令行操作。"
                labelClass="col-sm-5 col-lg-4"
                checked={false}
                featureId={FeatureId.K8S_ADM_ONLY_SECRETS}
                onChange={() => {}}
              />
            </div>
          </div>
        </FormSection>
        <FormSection title="资源和度量">
          <InsightsBox
            insightCloseId="resourceOverCommit"
            className="mb-4"
            header="允许资源超分 - 2.20 版本仅 UI 变更"
            content="资源超分在 Portainer CE 中始终处于启用状态。但切换开关错误地显示为关闭。现已修正，但请注意没有任何功能被移除。"
          />
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                <p>
                  禁用资源超分（强烈推荐）后，您只能为命名空间分配（总计）小于集群总量减去系统资源预留的 CPU 和内存资源。
                </p>
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="orange" inline={false}>
                <p>
                  启用资源超分后，您可以为命名空间分配超过集群物理可用资源的资源。如果资源不足以满足需求，可能导致意外的部署失败。
                </p>
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                label="允许资源超分"
                labelClass="col-sm-5 col-lg-4"
                name="resourceOverCommitPercentage"
                checked
                featureId={FeatureId.K8S_SETUP_DEFAULT}
                onChange={(checked: boolean) => {
                  setFieldValue('enableResourceOverCommit', checked);
                  // set 20% as the default resourceOverCommitPercentage value
                  if (!checked) {
                    setFieldValue('resourceOverCommitPercentage', 20);
                  }
                }}
                data-cy="kubeSetup-resourceOverCommitToggle"
              />
            </div>
          </div>
          <EnableMetricsInput
            environmentId={environmentId}
            error={errors.useServerMetrics}
            value={values.useServerMetrics}
          />
        </FormSection>
        <FormSection title="可用存储选项">
          {initialValues.storageClasses.length === 0 && (
            <div className="form-group">
              <div className="col-sm-12">
                <TextTip color="orange" inline={false}>
                  无法检测到用于持久化数据的存储类。用户将无法在此集群中持久化应用数据。
                </TextTip>
              </div>
            </div>
          )}
          {initialValues.storageClasses.length > 0 && (
            <>
              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue" inline={false}>
                    <p>
                      选择部署应用时可用的存储选项。请查阅存储驱动程序文档，以确定配置哪种访问策略以及是否支持卷扩展功能。
                    </p>
                    <p>
                      您可以在{' '}
                      <a
                        href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes"
                        target="_blank"
                        rel="noreferrer"
                      >
                        官方 Kubernetes 文档
                      </a>
                      中找到有关访问模式的更多信息。
                    </p>
                  </TextTip>
                </div>
              </div>
              <StorageClassDatatable
                storageClassValues={values.storageClasses}
              />
            </>
          )}
        </FormSection>
        <FormActions
          submitLabel="保存配置"
          loadingText="正在保存配置"
          isLoading={isSubmitting}
          isValid={
            isValid &&
            !isIngressClassesLoading &&
            isFormChanged(values, initialValues)
          }
          data-cy="kubeSetup-saveConfigurationButton"
        />
      </div>
    </Form>
  );
}

function useInitialValues(
  environment?: Environment | null,
  storageClassFormValues?: StorageClassFormValues[],
  ingressClasses?: IngressControllerClassMap[]
): ConfigureFormValues | undefined {
  return useMemo(() => {
    if (!environment) {
      return undefined;
    }
    const allowNoneIngressClass =
      !!environment.Kubernetes.Configuration.AllowNoneIngressClass;

    return {
      storageClasses: storageClassFormValues || [],
      useLoadBalancer: !!environment.Kubernetes.Configuration.UseLoadBalancer,
      useServerMetrics: !!environment.Kubernetes.Configuration.UseServerMetrics,
      enableResourceOverCommit:
        !!environment.Kubernetes.Configuration.EnableResourceOverCommit,
      resourceOverCommitPercentage:
        environment.Kubernetes.Configuration.ResourceOverCommitPercentage || 20,
      restrictDefaultNamespace:
        !!environment.Kubernetes.Configuration.RestrictDefaultNamespace,
      restrictStandardUserIngressW:
        !!environment.Kubernetes.Configuration.RestrictStandardUserIngressW,
      ingressAvailabilityPerNamespace:
        !!environment.Kubernetes.Configuration.IngressAvailabilityPerNamespace,
      allowNoneIngressClass,
      ingressClasses:
        getIngressClassesFormValues(allowNoneIngressClass, ingressClasses) ||
        [],
    };
  }, [environment, ingressClasses, storageClassFormValues]);
}

function isFormChanged(
  values: ConfigureFormValues,
  initialValues: ConfigureFormValues
) {
  // check if the form values are different from the initial values
  return !_.isEqual(values, initialValues);
}
