import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../common/IconButton/IconButton';
import Modal from '../../../common/Modal/Modal';
import ImportOverdueStepper from './ImportOverdueStepper';
import {
  // deleteDumpFromBackend,
  // getOverduesListByFilter,
  resetImportOverdueStepper,
} from '../redux/OverduesAction';
// import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const ImportOverdueModal = () => {
  const dispatch = useDispatch();
  const { importOverdue } = useSelector(({ overdue }) => overdue ?? {});
  // const { overdueListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});
  const activeStep = useMemo(() => importOverdue?.activeStep ?? 0, [importOverdue]);
  const importId = useMemo(() => importOverdue?.importId ?? null, [importOverdue]);

  // const {
  //   page: paramPage,
  //   limit: paramLimit,
  //   entityType: paramEntityType,
  //   status: paramStatus,
  //   minCreditLimit: paramMinCreditLimit,
  //   maxCreditLimit: paramMaxCreditLimit,
  //   startDate: paramStartDate,
  //   endDate: paramEndDate,
  // } = useQueryParams();

  const [importOverdueModal, setImportOverdueModal] = useState(false);
  const toggleImportOverdueModal = useCallback(() => {
    setImportOverdueModal(e => !e);
  }, []);
  const oncancelImportOverdueModal = useCallback(() => {
    // const params = {
    //   page: paramPage ?? 1,
    //   limit: paramLimit ?? 15,
    // };
    // const filters = {
    //   entityType:
    //     (paramEntityType?.trim()?.length ?? -1) > 0
    //       ? paramEntityType
    //       : overdueListFilters?.entityType ?? undefined,
    //   clientId: overdueListFilters?.clientId,
    //   debtorId: overdueListFilters?.debtorId,

    //   status: (paramStatus?.trim()?.length ?? -1) > 0 ? paramStatus : overdueListFilters?.status,
    //   minCreditLimit:
    //     (paramMinCreditLimit?.trim()?.length ?? -1) > 0
    //       ? paramMinCreditLimit
    //       : overdueListFilters?.minCreditLimit,
    //   maxCreditLimit:
    //     (paramMaxCreditLimit?.trim()?.length ?? -1) > 0
    //       ? paramMaxCreditLimit
    //       : overdueListFilters?.maxCreditLimit,
    //   startDate: paramStartDate || overdueListFilters?.startDate,
    //   endDate: paramEndDate || overdueListFilters?.endDate,
    // };

    // if (activeStep >= 2 && activeStep <= 4) dispatch(deleteDumpFromBackend(importId));

    // if (activeStep === 4) dispatch(getOverduesListByFilter({ ...params, ...filters }));
    dispatch(resetImportOverdueStepper());
    toggleImportOverdueModal();
  }, [activeStep, importId]);

  return (
    <>
      <IconButton
        buttonType="primary"
        title="cloud_upload"
        className="mr-10"
        buttonTitle="Click to upload overdues"
        onClick={toggleImportOverdueModal}
      />
      {importOverdueModal && (
        <Modal
          header="Import Overdues"
          className="import-overdue-modal"
          hideModal={toggleImportOverdueModal}
        >
          <ImportOverdueStepper oncancelImportOverdueModal={oncancelImportOverdueModal} />
        </Modal>
      )}
    </>
  );
};

export default ImportOverdueModal;
