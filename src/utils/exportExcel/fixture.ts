import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ElNotification } from "element-plus";

export async function importExcelToJSON(file:any, options:any = {}) {
  const {
    hasHeader = true,
    sheetIndex = 0,
    headerMapping = {},
    transformHeader,
    typeMapping = {} // 新增类型映射配置
  } = options;

  try {
    const workbook = new ExcelJS.Workbook();
    const buffer:any = await readFileAsBuffer(file);
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[sheetIndex];

    if (!worksheet) {
      throw new Error(`工作表索引 ${sheetIndex} 不存在`);
    }

    let headers:any = [];
    if (hasHeader) {
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        const headerText = cell.value?.toString().trim() || `column_${colNumber}`;

        if (transformHeader && typeof transformHeader === 'function') {
          headers.push(transformHeader(headerText, colNumber));
        } else if (headerMapping[headerText]) {
          headers.push(headerMapping[headerText]);
        } else {
          const cleanHeader = headerText
            .replace(/[。，；：！？、（）【】《》]/g, '')
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '');
          headers.push(cleanHeader);
        }
      });
    }

    const data:any = [];
    worksheet.eachRow((row, rowNumber) => {
      if (hasHeader && rowNumber === 1) return;

      const rowData:any = {};
      row.eachCell((cell, colNumber) => {
        if (hasHeader && headers[colNumber - 1]) {
          const fieldName = headers[colNumber - 1];
          let cellValue:any = cell.value;

          // 类型转换
          if (typeMapping[fieldName] === 'int') {
            cellValue = parseInt(cellValue, 10);
          } else {
            cellValue = String(cellValue);
          }

          rowData[fieldName] = cellValue;
        } else {
          rowData[`column_${colNumber}`] = cell.value;
        }
      });

      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    });

    return data;
  } catch (error) {
    console.error("[Excel Import Error]", error);
    ElNotification.error({
      title: "错误",
      message: "解析Excel文件失败，请检查文件格式",
    });
    throw new Error("解析Excel文件失败");
  }
}
function readFileAsBuffer(file:any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e:any) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}