import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../../../common/IconButton/IconButton';
import { errorNotification } from '../../../../../common/Toast';
import {
  deleteImportedFile,
  setImportedFile,
  updateImportOverdueData,
} from '../../../redux/OverduesAction';
// import { check } from 'prettier';

const ImportOverdueImportStep = () => {
  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);

  const { importOverdue } = useSelector(({ overdue }) => overdue ?? {});
  const { file, error } = useMemo(
    () => importOverdue?.importFile ?? {},
    [importOverdue?.importFile]
  );

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = useCallback(e => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const fileExtension = ['xls', 'xlsx'];
      const mimeType = [
        'overdue/vnd.ms-excel',
        'overdue/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const checkExtension =
        fileExtension.indexOf(e.target.files[0].name.split('.').splice(-1)[0]) !== -1;
      const checkMimeTypes = mimeType.indexOf(e.target.files[0].type) !== -1;
      if (!(checkExtension || checkMimeTypes)) {
        errorNotification('Only excel file types are allowed');
      } else {
        dispatch(setImportedFile(e.target.files[0]));
        e.target.value = null;
        dispatch(updateImportOverdueData('importFile', ''));
      }
    }
  }, []);

  const downloadImportedFile = useCallback(() => {
    const blob = new Blob([file]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = file?.name;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '__blank');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.setAttribute('href', url);
    link.click();
  }, [file]);

  return (
    <div className="io-import-file-step">
      <div className="io-file-icon mt-10">
        <IconButton buttonType="primary" title="cloud_upload" onClick={handleClick} />
        <input
          type="file"
          style={{ display: 'none' }}
          ref={hiddenFileInput}
          onChange={handleChange}
        />
        <span className="io-file-text mt-10 cursor-pointer" onClick={handleClick}>
          Import File
        </span>
      </div>
      {file && (
        <div className="io-import-file-name mt-10">
          <div className="io-file-name">{file.name}</div>
          <div className="io-action-buttons">
            <span
              className="material-icons-round font-field cursor-pointer"
              onClick={() => downloadImportedFile(file)}
            >
              cloud_download
            </span>
            <span
              className="material-icons-round font-field cursor-pointer ml-10"
              onClick={() => {
                dispatch(deleteImportedFile());
                dispatch(updateImportOverdueData('importFile', ''));
              }}
            >
              delete
            </span>
          </div>
        </div>
      )}
      {error && <div className="import-error mt-10 font-danger">{error}</div>}
    </div>
  );
};

export default ImportOverdueImportStep;
