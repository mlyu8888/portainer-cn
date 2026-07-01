import { Sliders, AlignJustify } from 'lucide-react';

import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';

import { PlacementType } from './types';

type Props = {
  placementType: PlacementType;
  onChange: (placementType: PlacementType) => void;
};

export const placementOptions: ReadonlyArray<BoxSelectorOption<PlacementType>> =
  [
    {
      id: 'placement_hard',
      value: 'mandatory',
      icon: Sliders,
      iconType: 'badge',
      label: '强制',
      description: (
        <>
          将此应用<b>仅</b>调度到匹配<b>所有</b>规则的节点上
        </>
      ),
    },
    {
      id: 'placement_soft',
      value: 'preferred',
      icon: AlignJustify,
      iconType: 'badge',
      label: '优先',
      description:
        '在可能的情况下将此应用调度到匹配规则的节点上',
    },
  ] as const;

export function PlacementTypeBoxSelector({ placementType, onChange }: Props) {
  return (
    <BoxSelector<PlacementType>
      value={placementType}
      options={placementOptions}
      onChange={(placementType) => onChange(placementType)}
      radioName="placementType"
      slim
    />
  );
}
