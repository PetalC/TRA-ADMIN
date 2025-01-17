import { useRef } from 'react';
/* import { uploadProfilePicture } from '../redux/HeaderAction'; */
import PropTypes from 'prop-types';
import IconButton from '../../IconButton/IconButton';
import dummy from '../../../assets/images/dummy.svg';

const FileUpload = props => {
  const {
    id,
    isProfile,
    profilePictureUrl,
    fileName,
    className,
    file,
    isDeleteIcon,
    handleChange,
    onDeleteClick,
  } = props;

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  let url = '';
  if (file) {
    url = URL.createObjectURL(file);
  }

  return (
    <div className={className ?? 'user-dp-upload'}>
      {isProfile ? (
        <div className="profile-dp-upload">
          <img className="user-dp" src={url || profilePictureUrl || dummy} />
          {isDeleteIcon && (
            <span className="material-icons-round profile-close-btn" onClick={onDeleteClick}>
              cancel
            </span>
          )}
        </div>
      ) : (
        ''
      )}
      <IconButton title="cloud_upload" className="user-dp-upload" onClick={handleClick} />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={hiddenFileInput}
        onChange={e => handleChange(e, id)}
      />
      <p onClick={handleClick}>{fileName}</p>
    </div>
  );
};
FileUpload.propTypes = {
  id: PropTypes.number,
  fileName: PropTypes.string.isRequired,
  isProfile: PropTypes.bool,
  handleChange: PropTypes.func,
  profilePictureUrl: PropTypes.string.isRequired,
  className: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  isDeleteIcon: PropTypes.bool,
  onDeleteClick: PropTypes.func,
};

FileUpload.defaultProps = {
  id: null,
  isProfile: false,
  handleChange: () => {},
  isDeleteIcon: false,
  onDeleteClick: () => {},
};

export default FileUpload;
