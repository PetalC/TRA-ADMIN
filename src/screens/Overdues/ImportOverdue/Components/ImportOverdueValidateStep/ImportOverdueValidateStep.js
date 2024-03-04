import React, { useMemo } from 'react';
import Tooltip from 'rc-tooltip';
import { useSelector } from 'react-redux';
import Table from '../../../../../common/Table/Table';

const ImportOverdueValidateStep = () => {
  const { docs, headers, toBeProcessedOverdueCount } = useSelector(
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
  console.log('headers: ', headers);
  console.log('docs: ', docs);
  console.log('ReasonColumn: ', ReasonColumn);
  return (
    <div className="io-validate-step">
      <div className="io-validate-count">
        <div className="font-success f-16">{`To Be Processed : ${
          toBeProcessedOverdueCount ?? 0
        }`}</div>
        <div className="font-danger f-16 mt-10">{`Rejected : ${docs?.length ?? 0}`}</div>
      </div>
      {docs?.length > 0 && (
        <div className="io-validate-table mt-10">
          <Table
            align="left"
            valign="center"
            tableClass="main-list-table"
            data={docs}
            headers={headers}
            stepperColumn={ReasonColumn}
          />
        </div>
      )}
    </div>
  );
};

export default ImportOverdueValidateStep;
