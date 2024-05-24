import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import {
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
              <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.CLIENT}>
                <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.OVERDUE}>
                  <Button
                    buttonType="primary"
                    title="Uploaded Data"
                    onClick={() => {
                      setUploadedDataModal(e => !e);
                    }}
                  />
                  <Button
                    buttonType="success"
                    title="New Submission"
                    onClick={() => setNewSubmissionModal(e => !e)}
                  />
                </UserPrivilegeWrapper>
              </UserPrivilegeWrapper>
              <IconButton
                buttonType="primary-1"
                title="cloud_download"
                className="mr-10"
                buttonTitle="Click to download overdues"
                onClick={downloadOverdueList}
                isLoading={downloadOverdueListLoaderAction}
              />
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
