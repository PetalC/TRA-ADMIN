import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Input from '../../../common/Input/Input';
import CSVFileUpload from './CSVFileUpload';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import {
  UploadOverdueCSV,
  getClientOverdueEntityDetails,
  getClientOverdueList,
  resetClientOverdueListData,
  downloadClientOverdueList,
} from '../redux/ClientAction';
import Select from '../../../common/Select/Select';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import UploadedCsvTable from './UploadedCsvTable'
import IconButton from '../../../common/IconButton/IconButton';
import { downloadAll } from '../../../helpers/DownloadHelper';

const ClientOverdueTab = () => {
  const searchInputRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [newSubmissionDetails, setNewSubmissionDetails] = useState({});
  const [newSubmissionModal, setNewSubmissionModal] = useState(false);
  const [uploadedDataModal, setUploadedDataModal] = useState(false);
  const [csvFileName, setCsvFileName] = useState('Browse...');
  const [csvFile, setCsvFile] = useState(null);
  const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile);
  const { UploadCsvLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );
  const { _id, name } = useMemo(() => {
    if (loggedUserDetail) {
      // eslint-disable-next-line no-shadow
      const { _id, name } = loggedUserDetail;
      return {
        _id: _id || '',
        name: name || '',
      };
    }
    return { _id: '', name: '' };
  }, [loggedUserDetail]);

  const entityList = useSelector(
    ({ clientManagement }) => clientManagement?.overdue?.entityList ?? {}
  );

  const { clientOverdueListPageLoaderAction, downloadOverdueListLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const overdueListWithPageData = useSelector(
    ({ clientManagement }) => clientManagement?.overdue?.overdueList ?? {}
  );
  const { total, pages, page, limit, docs, headers } = useMemo(
    () => overdueListWithPageData,
    [overdueListWithPageData]
  );

  const [uploadOverduesModal, setUploadOverduesModal] = useState(false);
  
  const getOverdueListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      try {
        await dispatch(getClientOverdueList(data, id));
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    },
    [page, limit, id]
  );

  useEffect(async () => {
    dispatch(getClientOverdueEntityDetails());
    console.log(UploadCsvLoaderAction);
    const csvId = new URLSearchParams(location.search).get('csvId');
    await getOverdueListByFilter({csvId: csvId ?? -1});
    return () => {
      dispatch(resetClientOverdueListData());
    };
  }, []);


  const pageActionClick = useCallback(
    async newPage => {
      await getOverdueListByFilter({ page: newPage, limit });
    },
    [getOverdueListByFilter, limit]
  );
  const onSelectLimit = useCallback(
    async newLimit => {
      await getOverdueListByFilter({ page: 1, limit: newLimit });
    },
    [getOverdueListByFilter]
  );

  const onAddNewSubmission = useCallback(() => {
    if (
      // eslint-disable-next-line no-prototype-builtins
      !newSubmissionDetails.hasOwnProperty('clientId') ||
      // eslint-disable-next-line no-prototype-builtins
      !newSubmissionDetails.hasOwnProperty('submissionDate')
    ) {
      errorNotification('Please select client and month/year to add new submission');
    } else {
      history.push(
        `/over-dues/${newSubmissionDetails?.clientId?.value}/${moment(
          newSubmissionDetails?.submissionDate
        )?.format('MMMM-YYYY')}`,
        { isRedirected: true, redirectedFrom: 'client', fromId: id }
      );
    }
  }, [newSubmissionDetails, id]);

  const onCloseNewSubmissionModal = useCallback(() => {
    setNewSubmissionDetails({});
    setNewSubmissionModal(e => !e);
  }, []);

  const onCloseUploadedDataModal = useCallback(() => {
    setUploadedDataModal(e => !e);
  }, []);

  const newSubmissionButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: onCloseNewSubmissionModal,
      },
      {
        title: 'Add',
        buttonType: 'primary',
        onClick: onAddNewSubmission,
      },
    ],
    [onAddNewSubmission, onCloseNewSubmissionModal]
  );

  const uploadedDataModalButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: onCloseUploadedDataModal,
      },
    ],
    [onCloseUploadedDataModal]
  );

  const checkIfEnterKeyPressed = async e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      await getOverdueListByFilter();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        await getOverdueListByFilter({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  const downloadOverdueList = async () => {
    let ids =[];
    docs.forEach(doc => {
      doc.debtors?.forEach(debtor => {
        ids = [...ids, debtor?._id];
      })
    });
    try {
      const response = await dispatch(downloadClientOverdueList(ids));
      if(response) downloadAll(response);
    } catch (e) {
      /**/
    }
  }
  const handleCsvFileChange = useCallback(e => {
    e.persist();

    if (e.target.files && e.target.files.length > 0) {
      setCsvFileName(e.target.files[0].name ? e.target.files[0].name : 'Browse...');
      setCsvFile(e.target.files[0]);
    }
  }, []);

  const onUploadOverdues = useCallback(async () => {
    try {
      if (!csvFile) {
        throw new Error('Please select csv file.');
      }

      const formData = new FormData();
      console.log(formData)
      formData.append('overdue-csv', csvFile);
      formData.append('id', id);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      await dispatch(UploadOverdueCSV(formData, config));

      setCsvFileName('Browse...');
      setCsvFile(null);
      setUploadOverduesModal(e => !e);
      await getOverdueListByFilter();

    } catch (error) {
      errorNotification(error.message);
    }
  }, [csvFile, _id]);

  const onCloseUploadOverduesModal = ()=>{
    setUploadOverduesModal(e => !e);
  }

  const uploadOverduesButtons = useMemo(
    () => {
      return [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseUploadOverduesModal },
      { title: 'Upload', buttonType: 'primary', onClick: onUploadOverdues, isLoading: UploadCsvLoaderAction},
    ]},
    [onCloseUploadOverduesModal],
  );
  return (
    <>
      {!clientOverdueListPageLoaderAction ? (
        <>
          <div className="tab-content-header-row">
            <div className="tab-content-header">Overdue</div>
            <div className="buttons-row">
              <BigInput
                ref={searchInputRef}
                type="text"
                className="search"
                borderClass="tab-search"
                prefix="search"
                prefixClass="font-placeholder"
                placeholder="Search here"
                onKeyUp={checkIfEnterKeyPressed}
              />
              <IconButton
                buttonType="primary-1"
                title="cloud_download"
                className="mr-10"
                buttonTitle="Click to download overdues"
                onClick={downloadOverdueList}
                isLoading={downloadOverdueListLoaderAction}
              />
              <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.CLIENT}>
                <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.OVERDUE}>
                  <Button
                    buttonType="success"
                    title="New Submission"
                    onClick={() => setNewSubmissionModal(e => !e)}
                  />
                  <Button className="mr-10" buttonType="primary" title="Upload Overdues" onClick={() => setUploadOverduesModal(e => !e)} />
                  <Button
                    buttonType="primary"
                    title="Uploaded Data"
                    onClick={() => {
                      setUploadedDataModal(e => !e);
                    }}
                  />
                </UserPrivilegeWrapper>
              </UserPrivilegeWrapper>
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  isExpandable
                  tableClass="main-list-table white-header-table"
                  data={docs}
                  headers={headers}
                  refreshData={getOverdueListByFilter}
                  listFor={{ module: 'client', subModule: 'overdue' }}
                  rowClass="cursor-pointer"
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}
          {newSubmissionModal && (
            <Modal
              header="New Submission"
              className="new-submission-modal"
              headerClassName="left-aligned-modal-header"
              buttons={newSubmissionButtons}
              hideModal={onCloseNewSubmissionModal}
            >
              <Select
                placeholder="Select Client"
                name="role"
                options={entityList?.clientId}
                value={newSubmissionDetails?.clientId}
                onChange={e => setNewSubmissionDetails({ ...newSubmissionDetails, clientId: e })}
                isSearchble
              />
              <div className="date-picker-container month-year-picker">
                <DatePicker
                  placeholderText="Select month and year"
                  onChange={date =>
                    setNewSubmissionDetails({ ...newSubmissionDetails, submissionDate: date })
                  }
                  dateFormat="MM/yyyy"
                  selected={newSubmissionDetails?.submissionDate}
                  showMonthYearPicker
                  showYearDropdown
                  showFullMonthYearPicker
                />
                <span className="material-icons-round">expand_more</span>
              </div>
            </Modal>
          )}

          {uploadOverduesModal && (
            <Modal
              header="Upload Overdues"
              className="upload-overdues-modal"
              buttons={uploadOverduesButtons}
              hideModal={onCloseUploadOverduesModal}
            >
              <div className="upload-form-container">
                <div className="filter-modal-row">
                  <div className="form-title">User</div>
                  <Input type="text" name="upload-user" value={name} disabled />
                </div>

                <div className="filter-modal-row">
                  <div className="form-title">Date</div>
                  <Input type="text" name="upload-date" value={moment(new Date()).format('MM/DD/YYYY')} disabled />
                </div>

                <div className="filter-modal-row">
                  <div className="form-title">CSV File</div>
                  <CSVFileUpload id="csv-file" fileName={csvFileName} handleChange={handleCsvFileChange} />
                </div>
              </div>
            </Modal>
          )}

          {uploadedDataModal && (
            <Modal
              header="Uploaded Data"
              className="uploaded-data-modal"
              headerClassName="left-aligned-modal-header"
              buttons={uploadedDataModalButtons}
              hideModal={setUploadedDataModal}
            >
              <UploadedCsvTable />
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ClientOverdueTab;
