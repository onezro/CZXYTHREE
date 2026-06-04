// tableExcelExporter.ts
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from "dayjs";
/**
 * el-table 列配置项（仅需导出相关字段）
 */
export interface TableColumn {
  /** 列标题 */
  label: string;
  /** 数据字段，支持嵌套如 'user.name' */
  prop?: string;
  /** 自定义格式化函数，优先级高于 prop */
  formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => string;
  /** 列宽（可选，用于 Excel 列宽参考，非必须） */
  width?: number | string;
  /** 对齐方式，可用于设置 Excel 单元格对齐 */
  align?: 'left' | 'center' | 'right';
  /** 子列，用于多级表头 */
  children?: TableColumn[];
}

/**
 * 导出配置
 */
export interface ExportTableOptions {
  /** 表格列定义 */
  columns: TableColumn[];
  /** 表格数据 */
  data: Record<string, any>[];
  /** 导出的文件名（不含扩展名） */
  fileName?: string;
  /** 工作表名称 */
  sheetName?: string;
  /** 是否包含表头，默认 true */
  showHeader?: boolean;
  /** 是否根据内容自适应列宽，默认 true */
  autoWidth?: boolean;
  /** 自定义扩展数据行（如末尾添加统计行），格式为二维数组 */
  footerData?: any[][];
  /** 单元格样式 */
  headerStyle?: Partial<ExcelJS.Style>;
  dataStyle?: Partial<ExcelJS.Style>;
}

// ============ 工具函数 ============

/** 安全转为字符串 */
const safeStr = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val);
};

/** 获取嵌套属性值：'user.name' → row.user.name */
function getNestedValue(obj: any, path: string): any {
  if (!path || !obj) return obj;
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
}

/** 估算字符串显示宽度（中文 ≈ 2，英文 ≈ 1） */
function estimateWidth(str: string): number {
  if (!str) return 0;
  let width = 0;
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3000 && code <= 0x303f) ||
      (code >= 0xff00 && code <= 0xffef) ||
      (code >= 0xac00 && code <= 0xd7af) ||
      (code >= 0x3040 && code <= 0x309f) ||
      (code >= 0x30a0 && code <= 0x30ff)
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

/** 列索引转字母（0→A） */
function colIndexToLetter(index: number): string {
  let letter = '';
  let num = index;
  while (num >= 0) {
    letter = String.fromCharCode((num % 26) + 65) + letter;
    num = Math.floor(num / 26) - 1;
  }
  return letter;
}

/**
 * 收集所有叶子列（深度优先），返回叶子列数组及其在表头树中的最大深度。
 * 叶子列指没有 children 的列。
 */
function flattenColumns(columns: TableColumn[]): {
  leaves: TableColumn[];
  maxDepth: number;
} {
  let maxDepth = 0;
  const leaves: TableColumn[] = [];

  function dfs(cols: TableColumn[], depth: number) {
    maxDepth = Math.max(maxDepth, depth);
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        dfs(col.children, depth + 1);
      } else {
        leaves.push(col);
      }
    }
  }
  dfs(columns, 1);
  return { leaves, maxDepth };
}

/**
 * 构建多级表头（二维数组）：每一层是一行数组，缺失位置用空字符串或合并占位。
 * 返回 headerRows: string[][] 和 合并信息 mergeCells: { row, col, rowspan, colspan }[]
 */
function buildHeaderRows(
  columns: TableColumn[]
): { headerRows: string[][]; merges: { row: number; col: number; rowspan: number; colspan: number }[] } {
  const { leaves, maxDepth } = flattenColumns(columns);
  // headerRows 索引 0 为最顶层
  const headerRows: string[][] = Array.from({ length: maxDepth }, () => []);

  const merges: { row: number; col: number; rowspan: number; colspan: number }[] = [];

  // 用一个全局列计数器记录叶子列的位置
  let leafIndex = 0;

  function processLevel(
    cols: TableColumn[],
    level: number,
    startLeafIdx: number
  ): { leafCount: number } {
    let currentLeafCount = 0;
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        const childResult = processLevel(col.children, level + 1, startLeafIdx + currentLeafCount);
        const childLeafCount = childResult.leafCount;
        // 当前列占据本级的一个单元格，跨 childLeafCount 列
        headerRows[level].push(col.label);
        // 填充后续本级的空位（因为 children 会在下级处理）
        for (let i = 1; i < childLeafCount; i++) {
          headerRows[level].push('');
        }
        // 记录合并信息（如果需要跨列，但 Excel 合并基于列坐标，这里先记录跨度）
        if (childLeafCount > 1) {
          merges.push({
            row: level,                     // 0-based 在 headerRows 中的行
            col: leafIndex + currentLeafCount, // 起始叶子列索引
            rowspan: 1,
            colspan: childLeafCount,
          });
        }
        currentLeafCount += childLeafCount;
      } else {
        // 叶子列
        headerRows[level].push(col.label);
        // 如果该列在非最后一行（还有下级），可能需要 rowspan 占位
        // 由于叶子列在最底层，无需 rowspan，但上层空位置已经通过 children 处理时填充
        currentLeafCount++;
      }
    }
    return { leafCount: currentLeafCount };
  }

  processLevel(columns, 0, 0);
  // 确保每一行的长度与叶子列数一致，填充空字符串
  const totalLeaves = leaves.length;
  for (let i = 0; i < maxDepth; i++) {
    while (headerRows[i].length < totalLeaves) {
      headerRows[i].push('');
    }
  }

  return { headerRows, merges };
}

// ============ 导出主函数 ============

export async function exportTableToExcel(options: ExportTableOptions): Promise<void> {
  const {
    columns,
    data,
    fileName = '表格导出',
    sheetName = 'Sheet1',
    showHeader = true,
    autoWidth = true,
    footerData,
    headerStyle: customHeaderStyle,
    dataStyle: customDataStyle,
  } = options;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // 收集叶子列
  const { leaves, maxDepth } = flattenColumns(columns);
  const leafCount = leaves.length;

  // ---------- 构建表头 ----------
  let headerRowCount = 0;
  if (showHeader && leafCount > 0) {
    const { headerRows, merges } = buildHeaderRows(columns);
    headerRowCount = headerRows.length;

    // 写入表头行
    for (const rowData of headerRows) {
      worksheet.addRow(rowData);
    }

    // 合并表头单元格（注意 headerRows 中的列索引假设与叶子列顺序对齐）
    // 需要将 merges 中的 col 转换为 Excel 列字母，row 已基于 headerRows 索引
    for (const merge of merges) {
      // row 是 headerRows 的行索引 (0-based)，col 是叶子列索引 (0-based)
      const excelRow = merge.row + 1; // Excel 行号从1开始
      const startCol = colIndexToLetter(merge.col);
      const endCol = colIndexToLetter(merge.col + merge.colspan - 1);
      worksheet.mergeCells(`${startCol}${excelRow}:${endCol}${excelRow}`);
    }
  }

  // ---------- 构建数据行 ----------
  const dataStartRow = headerRowCount + 1; // 数据行开始行号

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowData: string[] = [];
    for (const col of leaves) {
      let cellValue: any = '';
      if (col.prop) {
        cellValue = getNestedValue(row, col.prop);
      }
      // 格式化优先
      if (col.formatter) {
        cellValue = col.formatter(row, col, cellValue, i);
      }
      rowData.push(safeStr(cellValue));
    }
    worksheet.addRow(rowData);
  }

  // 添加自定义尾部数据
  if (footerData && footerData.length > 0) {
    for (const footerRow of footerData) {
      worksheet.addRow(footerRow.map(v => safeStr(v)));
    }
  }

  // ---------- 自适应列宽 ----------
  if (autoWidth) {
    const widths = new Array(leafCount).fill(0);

    // 表头宽度
    for (let i = 0; i < leafCount; i++) {
      // 取最底层表头单元格文本（最后一行）
      if (showHeader && headerRowCount > 0) {
        const lastHeaderRow = worksheet.getRow(headerRowCount);
        const cell = lastHeaderRow.getCell(i + 1);
        const text = cell.text || '';
        widths[i] = Math.max(widths[i], estimateWidth(text));
      }
      // 也可取上层表头
      for (let r = 1; r <= headerRowCount; r++) {
        const row = worksheet.getRow(r);
        const cell = row.getCell(i + 1);
        const text = cell.text || '';
        widths[i] = Math.max(widths[i], estimateWidth(text));
      }
    }

    // 数据宽度
    for (let r = dataStartRow; r <= worksheet.rowCount; r++) {
      const row = worksheet.getRow(r);
      for (let i = 0; i < leafCount; i++) {
        const cell = row.getCell(i + 1);
        const text = cell.text || '';
        widths[i] = Math.max(widths[i], estimateWidth(text));
      }
    }

    // 设置列宽 (加上一点 padding)
    for (let i = 0; i < leafCount; i++) {
      const colLetter = colIndexToLetter(i);
      const w = Math.max(widths[i] + 3, 8);
      worksheet.getColumn(colLetter).width = Math.min(w, 45);
    }
  }

  // ---------- 样式 ----------
  const defaultHeaderStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, size: 12, name: 'Microsoft YaHei' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6E4F0' } },
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  const defaultDataStyle: Partial<ExcelJS.Style> = {
    font: { size: 10, name: 'Microsoft YaHei' },
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  const applyStyle = (cell: ExcelJS.Cell, style: Partial<ExcelJS.Style>) => {
    cell.font = style.font ?? cell.font;
    cell.fill = style.fill ?? cell.fill;
    cell.alignment = style.alignment ?? cell.alignment;
    cell.border = style.border ?? cell.border;
  };

  const finalHeaderStyle = { ...defaultHeaderStyle, ...customHeaderStyle };
  const finalDataStyle = { ...defaultDataStyle, ...customDataStyle };

  // 设置表头样式
  for (let r = 1; r <= headerRowCount; r++) {
    const row = worksheet.getRow(r);
    row.eachCell((cell) => applyStyle(cell, finalHeaderStyle));
  }

  // 设置数据行样式
  for (let r = headerRowCount + 1; r <= worksheet.rowCount; r++) {
    const row = worksheet.getRow(r);
    row.eachCell((cell) => applyStyle(cell, finalDataStyle));
  }

  // 冻结窗格 (冻结表头行)
  if (headerRowCount > 0) {
    worksheet.views = [{ state: 'frozen', ySplit: headerRowCount }];
  }

  // ---------- 导出文件 ----------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}__${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);
}
// ==================== 从 el-table 实例提取列配置 ====================

/**
 * 将 el-table 组件的 columns 转为通用的 TableColumn[]
 * @param tableColumns  el-table 实例的 columns 属性（ref 取值后）
 * @param excludeProps  需要排除的列 prop 或 label 列表（如 ['index', 'operation']）
 * @param i18nT         可选的国际化翻译函数，用于处理 label 翻译后的匹配
 */
export function extractColumnsFromElTable(
  tableColumns: any[],
  excludeProps: (string | RegExp)[] = [],
  i18nT?: (key: string) => string
): TableColumn[] {
  const result: TableColumn[] = [];

  for (const col of tableColumns) {
    // 跳过无 label 的列（可能是隐藏列）
    if (!col.label) continue;

    // 排除指定的列（通过 label 或 property 匹配）
    const label = col.label;
    const prop = col.property || col.prop;
    const shouldExclude = excludeProps.some((ex) => {
      if (typeof ex === 'string') {
        // 如果需要国际化匹配：将排除文本通过 i18nT 翻译后再比较
        const excludeLabel = i18nT ? i18nT(ex) : ex;
        return label === excludeLabel || prop === ex;
      }
      return ex.test(label) || (prop && ex.test(prop));
    });
    if (shouldExclude) continue;

    const tableCol: TableColumn = {
      label: label,
      prop: prop,
      align: col.align || 'center',
      width: col.width,
      // 提取 formatter（注意 el-table 的 formatter 签名不同，需包装）
      formatter: col.formatter
        ? (row: any, column: TableColumn, cellValue: any, index: number) => {
            return col.formatter(row, column, cellValue, index);
          }
        : undefined,
    };

    // 递归处理子列（多级表头）
    if (col.children && col.children.length > 0) {
      tableCol.children = extractColumnsFromElTable(col.children, excludeProps, i18nT);
    }

    result.push(tableCol);
  }

  return result;
}

/**
 * 直接从 el-table 实例导出 Excel（便捷方法）
 * @param tableRef  el-table 的 ref 值（已解包）
 * @param data      要导出的数据
 * @param options   其他导出选项
 */
export async function exportTableByRef(
  tableRef: { columns: any[] },
  data: Record<string, any>[],
  options?: {
    fileName?: string;
    sheetName?: string;
    excludeProps?: (string | RegExp)[];
    i18nT?: (key: string) => string;
    // 其他 ExportTableOptions 中的参数也可透传
    [key: string]: any;
  }
) {
  const { excludeProps = [], i18nT, ...restOptions } = options || {};
  const columns = extractColumnsFromElTable(tableRef.columns, excludeProps, i18nT);
  await exportTableToExcel({
    columns,
    data,
    ...restOptions,
  });
}