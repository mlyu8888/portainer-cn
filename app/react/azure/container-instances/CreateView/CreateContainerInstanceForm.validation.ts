import { object, string, number, boolean, array } from 'yup';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { buildUniquenessTest } from '@@/form-components/validate-unique';

import { validationSchema as portsSchema } from './PortsMappingField.validation';

export function validationSchema(isAdmin: boolean) {
  return object().shape({
    name: string().required('名称是必需的。'),
    image: string().required('镜像是必需的。'),
    subscription: string().required('订阅是必需的。'),
    resourceGroup: string().required('资源组是必需的。'),
    location: string().required('位置是必需的。'),
    os: string().oneOf(['Linux', 'Windows']),
    cpu: number().positive(),
    memory: number().positive(),
    allocatePublicIP: boolean(),
    ports: portsSchema(),
    accessControl: accessControlSchema(isAdmin),
    env: array()
      .of(
        object().shape({
          name: string().required('环境变量名称是必需的。'),
          value: string().required('环境变量值是必需的。'),
        })
      )
      .test(
        'unique',
        '该环境变量已定义',
        buildUniquenessTest(
          () => 'This environment variable is already defined',
          'name'
        )
      ),
  });
}
