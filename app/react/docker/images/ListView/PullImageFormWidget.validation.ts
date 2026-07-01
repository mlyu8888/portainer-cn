import { useMemo } from 'react';
import { SchemaOf, object, string } from 'yup';

import { imageConfigValidation } from '@@/ImageConfigFieldset';

import { FormValues } from './PullImageFormWidget.types';

export function useValidation(
  isDockerhubRateLimited: boolean,
  isNodeVisible: boolean
): SchemaOf<FormValues> {
  return useMemo(
    () =>
      object({
        config: imageConfigValidation().test(
          'rate-limits',
          '超出速率限制',
          () => !isDockerhubRateLimited
        ),
        node: isNodeVisible
          ? string().required('请选择节点')
          : string().default(''),
      }),
    [isDockerhubRateLimited, isNodeVisible]
  );
}
