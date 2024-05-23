import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

export const ClientOverdueApiServices = {
  getClientOverdueList: (params, id) =>{
    return ApiService.getData(`${CLIENT_URLS.CLIENT_OVERDUE.GET_CLIENT_OVERDUE_LIST}${id}`, { params });
  },
  getClientOverdueEntityListData: () =>
    ApiService.getData(CLIENT_URLS.CLIENT_OVERDUE.GET_CLIENT_CLAIMS_ENTITY_LIST),
  getUploadedOverdueCsvList: (params, id) => {
    return ApiService.getData(`${CLIENT_URLS.CLIENT_OVERDUE.GET_CLIENT_UPLOADED_OVERDUE_CSV_LIST}${id}`, { params });
  },
  undoUploadedCsv: (id) => {
    return ApiService.deleteData(`${CLIENT_URLS.CLIENT_OVERDUE.UNDO_UPLOADED_CSV}${id}`)
  },
  getClientIdbyCsvId: (id) => {
    return ApiService.getData(`${CLIENT_URLS.CLIENT_OVERDUE.GET_CLIENT_ID_BY_CSV_ID}${id}`);
  },
  getOverdueListbyCsvId: (id) => {
    return ApiService.getData(`${CLIENT_URLS.CLIENT_OVERDUE.GET_OVERDUE_LIST_BY_ID}${id}`);
  }
};
