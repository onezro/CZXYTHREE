/**
 * 缓存已计算的文本宽度，避免重复计算
 */
const textWidthCache = new Map<string, number>();

/**
 * 使用Canvas测量文本宽度（比DOM操作更快）
 * @param str 要测量的文本
 * @param fontSize 字体大小
 * @param fontFamily 字体族
 * @returns 文本宽度（像素）
 */
export const getTextWidth = (
  str: string,
  fontSize: number = 13,
  fontFamily: string = 'Arial, sans-serif'
): number => {
  if (!str) return 0;
  
  const cacheKey = `${str}_${fontSize}_${fontFamily}`;
  
  // 检查缓存
  if (textWidthCache.has(cacheKey)) {
    return textWidthCache.get(cacheKey)!;
  }
  
  // 使用Canvas测量（性能更好）
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    // 备用方案：使用span元素
    const span = document.createElement('span');
    span.style.cssText = `
      position: absolute;
      visibility: hidden;
      padding: 0;
      margin: 0;
      border: 0;
      line-height: 1;
      font-size: ${fontSize}px;
      font-family: ${fontFamily};
      white-space: nowrap;
    `;
    span.textContent = str;
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    
    textWidthCache.set(cacheKey, width);
    return width;
  }
  
  context.font = `${fontSize}px ${fontFamily}`;
  const width = context.measureText(str).width;
  
  textWidthCache.set(cacheKey, width);
  return width;
};

/**
 * 计算表格列的自适应宽度（优化版）
 * @param label 表头文字
 * @param prop 字段名
 * @param tableData 表格数据
 * @param options 配置选项
 * @returns 计算后的宽度字符串
 */
export const flexColumnWidth = (
  label: string,
  prop: string,
  tableData: any[],
  options: {
    minWidth?: number;
    maxWidth?: number;
    padding?: number;
    fontSize?: number;
    fontFamily?: string;
  } = {}
): string => {
  const {
    minWidth = 80,
    maxWidth = 500,
    padding = 25,
    fontSize = 13,
    fontFamily = 'Arial, sans-serif'
  } = options;
  
  // 收集需要测量的文本
  const textsToMeasure = [label];
  
  // 收集数据中的文本（限制数量以提高性能）
  if (tableData && tableData.length > 0) {
    // 限制最多测量前100条数据，避免性能问题
    const sampleSize = Math.min(tableData.length, 100);
    for (let i = 0; i < sampleSize; i++) {
      const value = tableData[i]?.[prop];
      if (value !== undefined && value !== null) {
        textsToMeasure.push(String(value));
      }
    }
  }
  
  // 找出最大宽度
  let maxTextWidth = 0;
  for (const text of textsToMeasure) {
    const width = getTextWidth(text, fontSize, fontFamily);
    if (width > maxTextWidth) {
      maxTextWidth = width;
    }
  }
  
  // 加上padding，并限制在minWidth和maxWidth之间
  let finalWidth = maxTextWidth + padding;
  finalWidth = Math.max(minWidth, Math.min(finalWidth, maxWidth));
  
  return `${finalWidth}px`;
};

/**
 * 批量计算多个列的宽度（优化性能）
 * @param columns 列配置数组
 * @param tableData 表格数据
 * @param options 全局配置
 * @returns 列宽配置对象
 */
export const calculateColumnsWidth = (
  columns: Array<{
    label: string;
    prop: string;
    minWidth?: number;
    maxWidth?: number;
  }>,
  tableData: any[],
  options: {
    padding?: number;
    fontSize?: number;
    fontFamily?: string;
  } = {}
): Record<string, string> => {
  const result: Record<string, string> = {};
  
  columns.forEach(column => {
    const width = flexColumnWidth(
      column.label,
      column.prop,
      tableData,
      {
        ...options,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth
      }
    );
    result[column.prop] = width;
  });
  
  return result;
};

/**
 * 清除文本宽度缓存
 */
export const clearTextWidthCache = (): void => {
  textWidthCache.clear();
};

