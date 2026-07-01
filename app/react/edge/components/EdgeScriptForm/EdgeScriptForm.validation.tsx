import { object, boolean, string } from 'yup';

export function validationSchema() {
  return object().shape({
    allowSelfSignedCertificates: boolean(),
    envVars: string(),
    edgeIdGenerator: string()
      .required('边缘 ID 生成器是必填项')
      .test(
        'valid edge id generator',
        '边缘 ID 生成器不能为空',
        (value) => !!(value && value.length)
      ),
  });
}
