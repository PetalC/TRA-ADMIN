import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { successNotification } from '../../../common/Toast';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { DashboardApiService } from '../../Dashboard/services/DashboardApiService';
import { OverdueApiServices } from '../services/OverdueApiServices';
import { OVERDUE_REDUX_CONSTANTS } from './OverduesReduxConstants';
import ImportOverdueApiServices from '../services/ImportOverdueApiServices';

export const getEntityDetails = () => {
  return async dispatch => {
    try {
      const response = await OverdueApiServices.getEntityListData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.GET_ENTITY_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const handleOverdueFieldChange = (name, value) => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_FIELD_VALUE,
      name,
      value,
    });
  };
};

export const resetOverdueFormData = () => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA,
    });
  };
};

export const addNewOverdueDetails = data => {
  return dispatch => {
    try {
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_ADD,
        data,
      });
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getOverdueList = params => {
  return async dispatch => {
    try {
      const finalParams = {
        ...params,
        clientId: params?.clientId?.value,
        debtorId: params?.debtorId?.value,
      };
      startGeneralLoaderOnRequest('overdueListPageLoaderAction');
      const response = await OverdueApiServices.getOverdueList(finalParams);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.GET_OVERDUE_LIST,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('overdueListPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('overdueListPageLoaderAction');
      displayErrors(e);
    }
  };
};
export const getOverdueListByDate = params => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('addOverduePageLoaderAction');
      const response = await OverdueApiServices.getOverdueListByDate(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_LIST_BY_DATE,
          data: response?.data?.data,
        });
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.COPY_OVERDUE_LIST_BY_DATE,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('addOverduePageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('addOverduePageLoaderAction');
      displayErrors(e);
    }
  };
};

export const changeOverdueStatus = (id, params) => {
  return async () => {
    try {
      const response = await OverdueApiServices.changeOverdueStatus(id, params);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Status updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getOverdueDetailsById = id => {
  return dispatch =>
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_DETAILS,
      id,
    });
};

export const changeOverdueAction = (id, status) => {
  return async dispatch => {
    try {
      await dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_DETAILS_ACTION,
        id,
        status,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const amendOverdue = (id, data) => {
  return async dispatch => {
    try {
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_AMEND,
        id,
        data,
      });
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const saveOverdueList = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('saveOverdueToBackEndPageLoaderAction');
      const response = await OverdueApiServices.saveOverdueList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_BY_DATE,
          data,
        });
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_COPY_OVERDUE_LIST_BY_DATE,
          data,
        });
        successNotification(response?.data?.message ?? 'Overdue saved successfully');
        stopGeneralLoaderOnSuccessOrFail('saveOverdueToBackEndPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('saveOverdueToBackEndPageLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};

export const resetOverdueListData = (page, pages, total, limit, sortOption) => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.RESET_OVERDUE_LIST_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
      sortOption,
    });
  };
};

export const getOverdueFilterDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch({
        ...options,
        isForRisk: true,
      });

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.GET_OVERDUE_ENTITY_DATA_BY_SEARCH,
          data: response?.data?.data,
          name: options?.entityType,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const downloadOVerduesForSelectedDateRange = params => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('overdueDownloadButtonLoaderAction');
      const response = await OverdueApiServices.downloadOverdues(params);

      if (response?.statusText === 'OK') {
        downloadAll(response);
        successNotification('Overdues for given date range downloaded successfully');
      }
      return true;
    } catch (e) {
      displayErrors(e);
      return false;
    } finally {
      stopGeneralLoaderOnSuccessOrFail('overdueDownloadButtonLoaderAction');
    }
  };
};

export const getOverduesListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    const finalParams = {
      ...params,
      clientId: params?.clientId?.value,
      debtorId: params?.debtorId?.value,
    };
    startGeneralLoaderOnRequest('overdueListPageLoader');
    try {
      const response = await OverdueApiServices.getOverdueListByFilter(finalParams);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_LIST_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('overdueListPageLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('overdueListPageLoader');
      displayErrors(e);
    }
  };
};

export const importOverdueGoToNextStep = () => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.GO_TO_NEXT_STEP,
    });
  };
};

export const deleteImportedFile = () => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.DELETE_IMPORTED_FILE,
    });
  };
};

export const downloadODSample = async () => {
  try {
    startGeneralLoaderOnRequest('downloadODSampleFileLoaderButton');
    const response = await ImportOverdueApiServices.downloadSample();
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail('downloadODSampleFileLoaderButton');
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('downloadODSampleFileLoaderButton');
    displayErrors(e);
  }
  return false;
};

export const deleteDumpFromBackend = dumpId => {
  return async () => {
    try {
      console.log(dumpId);
      startGeneralLoaderOnRequest('deleteDumpFromBackEndLoader');
      // await ImportOverdueApiServices.deleteOverdueDump(dumpId);
      stopGeneralLoaderOnSuccessOrFail('deleteDumpFromBackEndLoader');
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('deleteDumpFromBackEndLoader');
      displayErrors(e);
    }
  };
};

export const importOverdueSaveAndNext = (importId, stepName) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('saveAndNextIOLoader');
      const response = await ImportOverdueApiServices.importOverdueSaveAndNext(importId, stepName);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.UPDATE_DATA_ON_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('saveAndNextIOLoader');
        return true;
      }
      return true;
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('saveAndNextIOLoader');
      displayErrors(e);
      throw Error();
    }
  };
};

export const resetImportOverdueStepper = () => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.RESET_STEPPER_DATA,
    });
  };
};

export const setImportedFile = file => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.SET_FILE,
      file,
    });
  };
};

export const updateImportOverdueData = (step, error) => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.UPDATE_DATA_ERROR,
      step,
      error,
    });
  };
};

export const importOverdueUploadDump = (data, config) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('saveAndNextIOLoader');
      const response = await ImportOverdueApiServices.uploadOverdueDump(data, config);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.UPDATE_DATA_ON_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('saveAndNextIOLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('saveAndNextIOLoader');
      if (e?.response?.data?.status === 'MISSING_HEADERS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.UPDATE_DATA_ERROR,
          step: 'importFile',
          error: e?.response?.data?.message,
        });
      } else {
        displayErrors(e);
      }
      throw Error();
    }
  };
};
