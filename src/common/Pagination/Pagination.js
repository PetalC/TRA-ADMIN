import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Select from '../Select/Select';

const noPerPage = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '25', value: 25 },
  { label: '30', value: 30 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];
const Pagination = props => {
  const { total, limit, pages, page, sortOption, className, pageActionClick, onSelectLimit } =
    props;

  const paginationClass = `pagination-container ${className}`;

  const [recordLimit, setRecordLimit] = useState([{ label: '15', value: 15 }]);

  const fromRecordCount = useMemo(() => (page - 1) * limit + 1, [page, limit, sortOption, total]);
  const toRecordCount = useMemo(
    () => (total < page * limit ? total : page * limit),
    [page, limit, sortOption, total]
  );

  const onNextClick = () => (page < pages ? pageActionClick(page + 1, sortOption) : null);
  const onPrevClick = () => (page > 1 ? pageActionClick(page - 1, sortOption) : null);
  const onFirstClick = () => (page > 1 ? pageActionClick(1, sortOption) : null);
  const onLastClick = () => (page < pages ? pageActionClick(pages, sortOption) : null);
  const onChangeLimit = e => {
    setRecordLimit(e);
    onSelectLimit(e.value);
  };

  useEffect(
    () => {
      const found = noPerPage.find(e => e.value === limit);
      let value = { label: '15', value: 15 };

      if (found) {
        value = found;
      }
      setRecordLimit([value]);
    },
    [limit],
    [sortOption]
  );

  if (total === 0) {
    return null;
  }

  return (
    <div className={paginationClass}>
      <div className="records-per-page-container">
        <span className="font-field mr-10">Show</span>
        <Select
          options={noPerPage}
          onChange={onChangeLimit}
          value={recordLimit}
          placeholder="Select"
          className="no-per-page-select"
          dropdownPosition="auto"
          isSearchable={false}
          menuPlacement="auto"
        />
        <span className="ml-10">
          {' '}
          Records {fromRecordCount} to {toRecordCount} of {total}
        </span>
      </div>
      <div className="pagination">
        <span className="mr-10">{pages} Pages</span>
        <div className="page-handler">
          <div
            className={`first-page ${page === 1 && 'pagination-button-disabled'}`}
            onClick={onFirstClick}
          >
            <span className="material-icons-round">double_arrow</span>
          </div>
          <div
            className={`prev-page ${page === 1 && 'pagination-button-disabled'}`}
            onClick={onPrevClick}
          >
            <span className="material-icons-round">arrow_back_ios</span>
          </div>
          <div className="page-number">{page}</div>
          <div
            className={`next-page ${page === pages && 'pagination-button-disabled'}`}
            onClick={onNextClick}
          >
            <span className="material-icons-round">arrow_forward_ios</span>
          </div>
          <div
            className={`last-page ${page === pages && 'pagination-button-disabled'}`}
            onClick={onLastClick}
          >
            <span className="material-icons-round">double_arrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  className: PropTypes.string,
  total: PropTypes.number,
  limit: PropTypes.number,
  pages: PropTypes.number,
  page: PropTypes.number,
  sortOption: PropTypes.number,
  pageActionClick: PropTypes.func,
  onSelectLimit: PropTypes.func,
};

Pagination.defaultProps = {
  className: '',
  total: 0,
  limit: 0,
  pages: 0,
  page: 0,
  sortOption: 0,
  pageActionClick: null,
  onSelectLimit: null,
};

export default Pagination;
