import { computed } from 'vue';
import { calculateColumnsWidth } from '@/utils/tableminWidth';

export interface UseTableColumnWidthOptions {
  padding?: number;
  fontSize?: number;
  fontFamily?: string;
  excludeLabels?: string[];
}

export const useTableColumnWidth = (
  tableRef: { value?: { columns: Array<{ property: string; label: string }> } },
  tableData: { value: any[] },
  options: UseTableColumnWidthOptions = {}
) => {
  const {
    padding = 25,
    fontSize = 13,
    fontFamily,
    excludeLabels = []
  } = options;

  const tableColumns = computed(() => {
    if (!tableRef.value) return [];
    return tableRef.value.columns
      .map((item: any) => ({ prop: item.property, label: item.label }))
      .filter((item: any) => !excludeLabels.includes(item.label));
  });

  const columnWidths = computed(() => {
    return calculateColumnsWidth(tableColumns.value, tableData.value, {
      padding,
      fontSize,
      fontFamily
    });
  });

  const getColumnWidth = (prop: string) => columnWidths.value[prop] || 'auto';

  return {
    tableColumns,
    columnWidths,
    getColumnWidth
  };
};
