import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import { OVERDUE_REDUX_CONSTANTS } from './OverduesReduxConstants';
import { FIELD_NAME_BY_ENTITY } from '../../../constants/EntitySearchConstants';

const initialOverdueState = {
  overdueList: {},
  entityList: {},
  overdueListByDate: {},
  overdueListByDateCopy: {},
  overdueDetails: {
    debtorId: [],
    acn: '',
    dateOfInvoice: '',
    overdueType: [],
    status: '',
    insurerId: [],
    monthString: '',
    clientComment: '',
    analystComment: '',
    currentAmount: '',
    thirtyDaysAmount: '',
    sixtyDaysAmount: '',
    ninetyDaysAmount: '',
    ninetyPlusDaysAmount: '',
    outstandingAmount: '',
  },
  importOverdue: {
    activeStep: 0,
    importId: '',
    importFile: {
      file: null,
      error: '',
    },
    importData: {},
  },
};

export const overdue = (state = initialOverdueState, action) => {
  switch (action.type) {
    case OVERDUE_REDUX_CONSTANTS?.GET_OVERDUE_LIST:
      return {
        ...state,
        overdueList: action?.data,
      };
    case OVERDUE_REDUX_CONSTANTS.GET_ENTITY_LIST: {
      const entityList = { ...state?.overdueDetails?.entityList };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        entityList[key] = value?.map(entity => ({
          label: entity?.name,
          name: key,
          value: entity?._id,
          acn: entity?.acn,
        }));
      });
      return {
        ...state,
        entityList,
      };
    }

    case OVERDUE_REDUX_CONSTANTS.GET_OVERDUE_ENTITY_DATA_BY_SEARCH: {
      const entityName = FIELD_NAME_BY_ENTITY?.[action?.name];
      const entityList = {
        ...state?.entityList,
        [entityName]: action?.data?.map(entity => ({
          label: entity.name,
          name: entityName,
          value: entity._id,
          acn: entity?.acn,
        })),
      };

      return {
        ...state,
        entityList,
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_FIELD_VALUE:
      return {
        ...state,
        overdueDetails: {
          ...state?.overdueDetails,
          [action.name]: action.value,
        },
      };

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA:
      return {
        ...state,
        overdueDetails: initialOverdueState?.overdueDetails,
      };

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_LIST_BY_DATE: {
      const docs = action?.data?.docs?.map(doc => {
        return { ...doc };
      });
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          client: action?.data?.client,
          previousEntries: action?.data?.previousEntries,
          isNilOverdue: action?.data?.isNilOverdue ?? false,
          docs,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.COPY_OVERDUE_LIST_BY_DATE: {
      const docs = action?.data?.docs?.map(doc => {
        return { ...doc };
      });
      return {
        ...state,
        overdueListByDateCopy: {
          ...state?.overdueListByDateCopy,
          client: action?.data?.client,
          isNilOverdue: action?.data?.isNilOverdue ?? false,
          previousEntries: action?.data?.previousEntries,
          docs,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_BY_DATE: {
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: action.data.list,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_COPY_OVERDUE_LIST_BY_DATE: {
      return {
        ...state,
        overdueListByDateCopy: {
          ...state?.overdueListByDateCopy,
          docs: action.data.list,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_DETAILS: {
      const docs = state?.overdueListByDate?.docs;
      const overdueDetail = docs?.find(doc => doc?.index === action?.id);
      return {
        ...state,
        overdueDetails: overdueDetail,
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_DETAILS_ACTION: {
      const finalDoc = state?.overdueListByDate?.docs?.map(doc => {
        if (doc?.index === action?.id) {
          return { ...doc, overdueAction: action?.status };
        }
        return doc;
      });
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: finalDoc,
        },
      };
    }
    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_AMEND: {
      const finalDoc = state?.overdueListByDate?.docs?.map(doc => {
        if (doc?.index === action?.id) {
          return { ...doc, ...action?.data, overdueAction: 'AMEND' };
        }
        return doc;
      });
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: finalDoc,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_ADD: {
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: [...state?.overdueListByDate?.docs, action?.data],
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.RESET_OVERDUE_LIST_PAGINATION_DATA: {
      return {
        ...state,
        overdueList: {
          ...state?.overdueList,
          page: action?.page,
          pages: action?.pages,
          total: action?.total,
          limit: action?.limit,
          docs: [],
        },
      };
    }

    // import application
    case OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.GO_TO_NEXT_STEP:
      return {
        ...state,
        importOverdue: {
          ...state?.importOverdue,
          activeStep: (state?.importOverdue?.activeStep ?? 0) + 1,
        },
      };

    case OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.RESET_STEPPER_DATA:
      return {
        ...state,
        importOverdue: initialOverdueState.importOverdue,
      };

    case OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.SET_FILE:
      return {
        ...state,
        importOverdue: {
          ...state?.importOverdue,
          importFile: {
            ...state?.importOverdue?.importFile,
            file: action.file,
          },
        },
      };

    case OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.UPDATE_DATA_ERROR:
      return {
        ...state,
        importOverdue: {
          ...state?.importOverdue,
          [action.step]: {
            ...state?.importOverdue?.[action.step],
            error: action.error,
          },
        },
      };

    case OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.DELETE_IMPORTED_FILE:
      return {
        ...state,
        importOverdue: {
          ...state?.importOverdue,
          importFile: {
            ...state?.importOverdue?.importFile,
            file: null,
          },
        },
      };

    case OVERDUE_REDUX_CONSTANTS.IMPORT_OVERDUE.UPDATE_DATA_ON_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let id = state?.importOverdue?.importId;
      if (action?.data?.importId) id = action?.data?.importId;
      return {
        ...state,
        importOverdue: {
          ...state?.importOverdue,
          importId: id,
          importData: action.data,
        },
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;
    default:
      return state;
  }
};
