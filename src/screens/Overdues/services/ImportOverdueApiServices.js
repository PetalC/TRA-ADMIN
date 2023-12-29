import ApiService from '../../../services/api-service/ApiService';
import { OVERDUE_URLS } from '../../../constants/UrlConstants';

const ImportOverdueApiServices = {
  downloadSample: () =>
    ApiService.request({
      url: `${OVERDUE_URLS.IMPORT_OVERDUE_URLS.DOWNLOAD_SAMPLE}`,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  deleteOverdueDump: id =>
    ApiService.deleteData(`${OVERDUE_URLS.IMPORT_OVERDUE_URLS.UPLOAD_DUMP}${id}`),
  uploadOverdueDump: (data, config) =>
    ApiService.postData(OVERDUE_URLS.IMPORT_OVERDUE_URLS.UPLOAD_DUMP, data, {
      ...config,
      timeout: 2 * 60 * 1000,
    }),
  importOverdueSaveAndNext: (id, stepName) =>
    ApiService.putData(
      `${OVERDUE_URLS.IMPORT_OVERDUE_URLS.UPLOAD_DUMP}${id}?stepName=${stepName}`,
      {},
      {
        timeout: 2 * 60 * 1000,
      }
    ),
};
export default ImportOverdueApiServices;
