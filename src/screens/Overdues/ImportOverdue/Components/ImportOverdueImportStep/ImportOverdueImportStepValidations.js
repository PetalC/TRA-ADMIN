import { importOverdueUploadDump, updateImportOverdueData } from '../../../redux/OverduesAction';

export const importOverdueImportStepValidations = async (dispatch, data, id, period) => {
  let error = '';
  let validated = true;

  // eslint-disable-next-line no-prototype-builtins
  if (!data?.file) {
    validated = false;
    error = 'Please import file to continue';
  }

  if (validated) {
    const { file } = data;
    const formData = new FormData();
    formData.append('dump-file', file);
    formData.append('clientId', id);
    formData.append('period', period);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    try {
      await dispatch(importOverdueUploadDump(formData, config));
      validated = true;
    } catch (e) {
      throw Error();
    }
  }
  dispatch(updateImportOverdueData('importFile', error));
  return validated;
};
