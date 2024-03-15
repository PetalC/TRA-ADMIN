import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Tooltip from 'rc-tooltip';
import Table from '../../../../../common/Table/Table';

const ImportOverdueGenerateOverdueStep = () => {
  const { docs, headers, toBeProcessedOverdueCount, status, message } = useSelector(
    ({ overdue }) => overdue?.importOverdue?.importData ?? {}
  );
  const ReasonColumn = useMemo(
    () => [
      data => (
        <span className="material-icons-round font-danger cursor-pointer">
          <Tooltip
            overlayClassName="tooltip-top-class"
            mouseEnterDelay={0.5}
            overlay={<span>{data?.reason ?? 'No value'}</span>}
            placement="topLeft"
          >
            <span>error</span>
          </Tooltip>
        </span>
      ),
    ],
    []
  );
  return (
    <div className="io-generate-step">
      <div className="io-generate-status-count">
        <div className="io-validate-count">
          <div className="font-success f-16">{`To Be Processed : ${
            toBeProcessedOverdueCount ?? 0
          }`}</div>
          <div className="font-danger f-16 mt-10">{`Rejected : ${docs?.length ?? 0}`}</div>
        </div>
        {status === 'SUCCESS' && (
          <div className="io-import-status">
            <span className="material-icons-round font-success f-h2">verified</span>
            <div className="io-generate-message font-success ml-5">{message}</div>
          </div>
        )}
      </div>
      {docs?.length > 0 && (
        <div className="io-validate-table mt-10">
          <Table
            align="left"
            valign="center"
            tableClass="main-list-table"
            data={docs}
            headers={headers}
            rowClass="cursor-pointer"
            stepperColumn={ReasonColumn}
          />
        </div>
      )}
    </div>
  );
};
export default ImportOverdueGenerateOverdueStep;
