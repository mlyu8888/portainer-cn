import _ from 'lodash';
import { useState } from 'react';

import { EdgeGroup } from '@/react/edge/edge-groups/types';

import { Select } from '@@/form-components/ReactSelect';
import { FormError } from '@@/form-components/FormError';
import { Link } from '@@/Link';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';

import { useEdgeGroups } from '../../edge-groups/queries/useEdgeGroups';

type SingleValue = EdgeGroup['Id'];

interface Props {
  value: SingleValue[];
  onChange: (value: SingleValue[]) => void;
  error?: string | string[];
  horizontal?: boolean;
  isGroupVisible?(group: EdgeGroup): boolean;
  required?: boolean;
}

export function EdgeGroupsSelector({
  value,
  onChange,
  error,
  horizontal,
  isGroupVisible = () => true,
  required,
}: Props) {
  const [inputId] = useState(() => _.uniqueId('edge-groups-selector-'));

  const selector = (
    <InnerSelector
      value={value}
      onChange={onChange}
      isGroupVisible={isGroupVisible}
      inputId={inputId}
    />
  );

  return horizontal ? (
    <FormControl
      errors={error}
      label="边缘组"
      required={required}
      inputId={inputId}
    >
      {selector}
    </FormControl>
  ) : (
    <FormSection title={`边缘组${required ? ' *' : ''}`} htmlFor={inputId}>
      <div className="form-group">
        <div className="col-sm-12">{selector} </div>
        {error && (
          <div className="col-sm-12">
            <FormError>{error}</FormError>
          </div>
        )}
      </div>
    </FormSection>
  );
}

function InnerSelector({
  value,
  onChange,
  isGroupVisible,
  inputId,
}: {
  isGroupVisible(group: EdgeGroup): boolean;
  value: SingleValue[];
  onChange: (value: SingleValue[]) => void;
  inputId: string;
}) {
  const edgeGroupsQuery = useEdgeGroups();

  const items = (edgeGroupsQuery.data || []).filter(isGroupVisible);

  const valueGroups = _.compact(
    value.map((id) => items.find((item) => item.Id === id))
  );

  return items.length ? (
    <Select
      aria-label="Edge 分组"
      options={items}
      isMulti
      getOptionLabel={(item) => item.Name}
      getOptionValue={(item) => String(item.Id)}
      value={valueGroups}
      onChange={(value) => {
        onChange(value.map((item) => item.Id));
      }}
      placeholder="选择一个或多个组"
      closeMenuOnSelect={false}
      data-cy="edge-stacks-groups-selector"
      id="edge-stacks-groups-selector"
      inputId={inputId}
    />
  ) : (
    <div className="small text-muted">
      没有可用的边缘组。前往{' '}
      <Link to="edge.groups" data-cy="edge-stacks-groups-view-link">
        边缘组视图
      </Link>{' '}
      创建一个。
    </div>
  );
}
