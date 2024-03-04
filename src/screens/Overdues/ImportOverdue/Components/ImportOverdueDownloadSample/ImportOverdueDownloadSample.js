import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '../../../../../common/IconButton/IconButton';
import { downloadAll } from '../../../../../helpers/DownloadHelper';
import { downloadODSample } from '../../../redux/OverduesAction';

const ImportOverdueDownloadSample = () => {
  const { downloadODSampleFileLoaderButton } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );
  const downloadSampleFile = useCallback(async () => {
    const res = await downloadODSample();
    if (res) downloadAll(res);
  }, []);
  return (
    <div className="io-download-step">
      <div className="io-file-icon mt-10">
        <IconButton
          buttonType="primary-1"
          title="cloud_download"
          onClick={downloadSampleFile}
          isLoading={downloadODSampleFileLoaderButton}
        />
        <span className="io-file-text mt-10">Download Sample File</span>
      </div>
    </div>
  );
};
export default ImportOverdueDownloadSample;
