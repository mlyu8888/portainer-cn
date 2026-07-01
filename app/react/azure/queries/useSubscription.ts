import { useQuery } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withError } from '@/react-tools/react-query';

import { Subscription } from '../types';
import { azureErrorParser } from '../services/utils';

import { queryKeys } from './query-keys';
import { buildSubscriptionsUrl } from './utils';

export function useSubscription(
  environmentId: EnvironmentId,
  subscriptionId: string
) {
  return useQuery(
    queryKeys.subscription(environmentId, subscriptionId),
    () => getSubscription(environmentId, subscriptionId),
    {
      ...withError('无法获取 Azure 订阅'),
    }
  );
}

async function getSubscription(
  environmentId: EnvironmentId,
  subscriptionId: string
) {
  try {
    const { data } = await axios.get<Subscription>(
      buildSubscriptionsUrl(environmentId, subscriptionId),
      { params: { 'api-version': '2016-06-01' } }
    );

    return data;
  } catch (e) {
    throw parseAxiosError(
      e as Error,
      '无法获取订阅',
      azureErrorParser
    );
  }
}
