interface SelectedRowsCountProps {
  value: number;
  hidden: number;
}

export function SelectedRowsCount({ value, hidden }: SelectedRowsCountProps) {
  return value !== 0 ? (
    <div className="infoBar">
      已选择 {value} 项
      {hidden !== 0 && `（${hidden} 项被筛选隐藏）`}
    </div>
  ) : null;
}
