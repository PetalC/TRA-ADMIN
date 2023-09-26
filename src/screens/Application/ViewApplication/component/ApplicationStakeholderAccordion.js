import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationStakeholderAccordion = props => {
  const { index } = props;

  const { stakeHolderList } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.stakeHolder ?? {}
  );

  const data = useMemo(() => stakeHolderList?.docs ?? [], [stakeHolderList]);
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
            data.map(i => (
              i.acn?
                <div className="common-accordion-item-content-box" key={i._id}>
                  <div className="d-flex">
                    <span className="font-field">Name:</span>
                    <span className="font-primary ml-10">{i?.name.value ?? '-'}</span>
                  </div>
                  <div className="d-flex">
                    <span className="font-field">ACN/NZCN:</span>
                    <span className="font-primary ml-10">{i?.acn ?? '-'}</span>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Entity Type:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.entityType ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Country:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.country ?? '-'}</span>
                    </div>
                  </div>
                </div> 
              :
                <div className="common-accordion-item-content-box" key={i._id}>
                  <div className="d-flex">
                    <span className="font-field">Title:</span>
                    <span className="font-primary ml-10">{i?.title ?? '-'}</span>
                  </div>
                  <div className="d-flex">
                    <span className="font-field">Name:</span>
                    <span className="font-primary ml-10">{i?.name.value ?? '-'}</span>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Date Of Birth:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.dateOfBirth ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Driver’s License Number:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.driverLicenceNumber ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Street Number:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.streetNumber ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Street Name:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.streetName ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Street Type:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.streetType ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Suburb:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.suburb ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">State:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.state ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Country:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.country ?? '-'}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="font-field">Postcode:</div>
                    <div className="font-primary ml-10">
                    <span className="font-primary ml-10">{i?.postCode ?? '-'}</span>
                    </div>
                  </div>
                </div>               
            ))}
        </AccordionItem>
      )}
    </>
  );
};

export default React.memo(ApplicationStakeholderAccordion);

ApplicationStakeholderAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};