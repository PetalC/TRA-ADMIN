import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationStakeholderAccordion = props => {
  const { index } = props;

  const { stakeHolderList } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.stakeHolder ?? {}
  );

  const data = useMemo(() => stakeHolderList?.docs ?? [], [stakeHolderList]);
  console.log('data: ', data);
  return (
    <>
      {data && (
        <AccordionItem
          index={index}
          header="Stakeholder Details"
          count={data?.length < 10 ? `0${data?.length}` : data?.length}
          suffix="expand_more"
        >
          {data &&
            data.map(stakeHolderDetail =>
              stakeHolderDetail.acn ? (
                <div className="common-accordion-item-content-box" key={stakeHolderDetail._id}>
                  <div className="d-flex">
                    <span className="font-field">Name:</span>
                    <span className="font-primary ml-10">
                      {stakeHolderDetail?.name.value || '-'}
                    </span>
                  </div>
                  <div className="d-flex">
                    <span className="font-field">ACN/NZCN:</span>
                    <span className="font-primary ml-10">{stakeHolderDetail?.acn || '-'}</span>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Entity Type:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.entityType || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Country:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.country || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="common-accordion-item-content-box" key={stakeHolderDetail._id}>
                  <div className="d-flex">
                    <span className="font-field">Title:</span>
                    <span className="font-primary ml-10">{stakeHolderDetail?.title || '-'}</span>
                  </div>
                  <div className="d-flex">
                    <span className="font-field">Name:</span>
                    <span className="font-primary ml-10">
                      {stakeHolderDetail?.name.value || '-'}
                    </span>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Date Of Birth:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {moment(stakeHolderDetail?.dateOfBirth).format('DD-MM-YYYY') || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Driver’s License Number:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.driverLicenceNumber || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Street Number:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.streetNumber || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Street Name:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.streetName || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Street Type:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.streetType || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Suburb:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">{stakeHolderDetail?.suburb || '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">State:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">{stakeHolderDetail?.state || '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Country:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.country || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Postcode:</div>
                    <div className="font-primary ml-10">
                      <span className="font-primary ml-10">
                        {stakeHolderDetail?.postCode || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
        </AccordionItem>
      )}
    </>
  );
};

export default React.memo(ApplicationStakeholderAccordion);

ApplicationStakeholderAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};
