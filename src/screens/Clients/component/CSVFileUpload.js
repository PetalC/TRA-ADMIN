import { useRef } from 'react';
import PropTypes from 'prop-types';
import IconButton from '../../../common/IconButton/IconButton';

const CSVFileUpload = props => {
  const { id, fileName, className, handleChange } = props;

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className={className ?? 'upload-file-container'}>
      <IconButton buttonType="outlined-bg" title="cloud_upload" className="upload-file-btn" onClick={handleClick} />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={hiddenFileInput}
        onChange={e => {
          handleChange(e, id);
        }}
        accept=".csv"
      />
      <p onClick={handleClick}>{fileName}</p>
    </div>
  );
};

CSVFileUpload.propTypes = {
  id: PropTypes.string,
  fileName: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  className: PropTypes.object.isRequired,
};

CSVFileUpload.defaultProps = {
  id: null,
  handleChange: () => {},
};

export default CSVFileUpload;
