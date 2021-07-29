import {
  EDIT_PROFILE_CONSTANT,
  HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS,
  HEADER_NOTIFICATION_REDUX_CONSTANTS,
} from './HeaderConstants';

export const loggedUserProfile = (state = { changed: false }, action) => {
  switch (action.type) {
    case EDIT_PROFILE_CONSTANT.GET_LOGGED_USER_DETAILS:
      return { ...action.data, changed: false };
    case EDIT_PROFILE_CONSTANT.USER_EDIT_PROFILE_DATA_CHANGE:
      return {
        ...state,
        changed: true,
        [`${action.data.name}`]: action.data.value,
      };
    case EDIT_PROFILE_CONSTANT.UPDATE_USER_PROFILE_PICTURE:
      return { ...state, profilePictureUrl: action.data };
    default:
      return state;
  }
};

export const headerNotificationReducer = (
  state = { notificationList: [], notificationReceived: false, alertDetail: {} },
  action
) => {
  switch (action.type) {
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.GET_HEADER_NOTIFICATION: {
      let notificationReceived = false;
      if (action?.data?.length > 0) notificationReceived = true;
      return {
        ...state,
        notificationList: action?.data,
        notificationReceived,
      };
    }
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.ADD_NOTIFICATION: {
      const notifications = [...state?.notificationList];
      notifications.unshift(action?.data);
      return {
        ...state,
        notificationList: notifications,
        notificationReceived: true,
      };
    }
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_DELETED_READ: {
      const notificationList = [...state?.notificationList];
      let finalList = [];
      finalList = notificationList?.filter(notification => notification?._id !== action?.id);
      return {
        ...state,
        notificationList: finalList,
      };
    }
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.OFF_NOTIFIRE: {
      return {
        ...state,
        notificationReceived: false,
      };
    }
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.GET_NOTIFICATION_ALERTS_DETAILS: {
      return {
        ...state,
        alertDetail: action?.data,
      };
    }
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.CLEAR_NOTIFICATION_ALERTS_DETAILS: {
      return {
        ...state,
        alertDetail: {},
      };
    }
    default:
      return state;
  }
};

export const globalSearchReducer = (state = [], action) => {
  switch (action.type) {
    case HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS.GET_SEARCH_RESULT_LIST:
      return {
        ...state,
        searchResults: action?.data,
      };
    case HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS.CLEAR_SEARCHED_DATA_LIST:
      return {
        ...state,
        searchResults: [],
      };
    default:
      return state;
  }
};
