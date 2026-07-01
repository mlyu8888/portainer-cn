import { SchemaOf, array, object, string } from 'yup';

import { buildUniquenessTest } from '@@/form-components/validate-unique';

import { Annotation } from './types';

const re = /^([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/;

export const annotationsSchema: SchemaOf<Annotation[]> = array(
  getAnnotationValidation()
).test(
  'unique',
  '不允许重复的键。',
  buildUniquenessTest(() => '不允许重复的键。', 'key')
);

function getAnnotationValidation(): SchemaOf<Annotation> {
  return object({
    key: string()
      .required('键是必填项。')
      .test('is-valid', (value, { createError }) => {
        if (!value) {
          return true;
        }
        const keySegments = value.split('/');
        if (keySegments.length > 2) {
          return createError({
            message:
              '允许两个由斜杠(/)分隔的段：一个可选的前缀和一个名称。',
          });
        }
        if (keySegments.length === 2) {
          if (keySegments[0].length > 253) {
            return createError({
              message: '前缀（斜杠之前）不能超过 253 个字符。',
            });
          }
          if (keySegments[1].length > 63) {
            return createError({
              message: '名称（斜杠之后）不能超过 63 个字符。',
            });
          }
          if (!re.test(keySegments[1])) {
            return createError({
              message:
                '以字母数字字符开头和结尾，中间只允许使用短划线、下划线和字母数字字符。',
            });
          }
        } else if (keySegments.length === 1) {
          if (keySegments[0].length > 63) {
            return createError({
              message:
                '名称（斜杠后的段，如果没有斜杠则为唯一段）不能超过 63 个字符。',
            });
          }
          if (!re.test(keySegments[0])) {
            return createError({
              message:
                '以字母数字字符开头和结尾，中间只允许使用短划线、下划线和字母数字字符。',
            });
          }
        }
        return true;
      }),
    value: string().required('值是必填项。'),
    id: string().required('ID 是必填项。'),
  });
}
