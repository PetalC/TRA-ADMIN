import React from 'react';
import './OverduesTab.scss';
import BigInput from '../../BigInput/BigInput';
import IconButton from '../../IconButton/IconButton';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';
import Button from '../../Button/Button';

const OverDuesTab = () => {
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const defaultFields = [
    'Name',
    'Job Title',
    'Email',
    'Portal Access',
    'Decision Maker',
    'Left Company',
  ];
  const customFields = [
    'Phone',
    'Trading As',
    'Net of brokerage',
    'Policy Type',
    'Expiry Date',
    'Inception Date',
  ];
  const columnStructure = {
    columns: [
      {
        type: 'text',
        name: 'Debtor Name',
        value: 'debtor_name',
      },
      {
        type: 'checkbox',
        name: 'Received',
        value: 'received',
      },
      {
        type: 'date',
        name: 'Processed Date',
        value: 'processed_date',
      },
      {
        type: 'text',
        name: 'Comments',
        value: 'comments',
      },
      {
        type: 'text',
        name: 'Credit Limit',
        value: 'credit_limit',
      },
    ],
    actions: [
      {
        type: 'edit',
        name: 'Edit',
        icon: 'edit-outline',
      },
      {
        type: 'delete',
        name: 'Delete',
        icon: 'trash-outline',
      },
    ],
  };
  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Overdues</div>
        <div className="buttons-row">
          <BigInput
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          <Button buttonType="success" title="Add" />
        </div>
      </div>
      <Table header={columnStructure} headerClass="tab-table-header" />
      <Pagination />
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default OverDuesTab;
