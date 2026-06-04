// useExport.ts
import { ElLoading, ElMessage } from 'element-plus';
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading';

export function useExport() {
  let loadingInstance: LoadingInstance | null = null;

  const showLoading = (text = '正在导出，请稍候...') => {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.7)',
    });
  };

  const hideLoading = () => {
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }
  };

  const handleExportError = (err: any) => {
    console.error('导出失败:', err);
    ElMessage.error('导出失败，请稍后重试');
  };

  const handleExportSuccess = (fileName?: string) => {
    ElMessage.success(`文件“${fileName || '数据'}”已开始下载`);
  };

  return {
    showLoading,
    hideLoading,
    handleExportError,
    handleExportSuccess,
  };
}