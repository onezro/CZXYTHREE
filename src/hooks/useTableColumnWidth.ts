import { computed, toValue } from 'vue';
import { calculateColumnsWidth } from '@/utils/tableminWidth';

export interface UseTableColumnWidthOptions {
  padding?: number;
  fontSize?: number;
  fontFamily?: string;
  excludeLabels?: string[] | (() => string[]);
  excludeTypes?: string[] | (() => string[]);
}

export const useTableColumnWidth = (
  tableRef: { value?: { columns: Array<{ property: string; label: string; type?: string }> } },
  tableData: { value: any[] },
  options: UseTableColumnWidthOptions = {}
) => {
  const {
    padding = 25,
    fontSize = 13,
    fontFamily,
    excludeLabels = [],
    excludeTypes = []
  } = options;

  const tableColumns = computed(() => {
    if (!tableRef.value) return [];
    const excludeLabelsVal = toValue(excludeLabels);
    const excludeTypesVal = toValue(excludeTypes);
    return tableRef.value.columns
      .map((item: any) => ({ prop: item.property, label: item.label, type: item.type }))
      .filter((item: any) => !excludeLabelsVal.includes(item.label) && !excludeTypesVal.includes(item.type));
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
