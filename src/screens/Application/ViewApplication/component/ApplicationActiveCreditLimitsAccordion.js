import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import { NumberCommaSeparator } from '../../../../helpers/NumberCommaSeparator';

const ApplicationActiveClientLimitAccordion = props => {
  const { index } = props;

  const { creditLimitList } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.creditLimit ?? {}
  );

  const data = useMemo(() => creditLimitList?.docs ?? [], [creditLimitList]);

  return (
    <>
      {data && (
        <AccordionItem
          index={index}
          header="Active Client Limit"
          count={data?.length < 10 ? `0${data?.length}` : data?.length}
          suffix="expand_more"
        >
          {data &&
            data.map(creditLimit => (
              <div className="common-accordion-item-content-box" key={creditLimit._id}>
                <div className="d-flex">
                  <span className="font-field">Client Name:</span>
                  <span className="font-primary ml-10">{creditLimit?.name.value || '-'}</span>
                </div>
                <div className="d-flex">
                  <span className="font-field">Limit Type:</span>
                  <span className="font-primary ml-10">{creditLimit?.limitType || '-'}</span>
                </div>
                <div className="d-flex">
                  <div className="font-field">Approve Amount:</div>
                  <div className="font-primary ml-10">
                    {creditLimit?.creditLimit
                      ? `$${NumberCommaSeparator(creditLimit.creditLimit)}`
                      : '-'}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="font-field">Approval Date:</div>
                  <div className="font-primary ml-10">
                    {moment(creditLimit?.approvalOrDecliningDate).format('DD-MMM-YYYY')}
                  </div>
                </div>
              </div>
            ))}
        </AccordionItem>
      )}
    </>
  );
};

export default React.memo(ApplicationActiveClientLimitAccordion);

ApplicationActiveClientLimitAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};
