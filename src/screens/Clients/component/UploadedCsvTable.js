import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Button from '../../../common/Button/Button';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import {
    getUploadedOverdueCsvList,
    undoUploadedCsv,
  } from '../redux/ClientAction';

const UploadedCsvTable = () => {
    const { uploadedOverdueCsvListLoaderAction } = useSelector(
        ({ generalLoaderReducer }) => generalLoaderReducer ?? false
    );

    const dispatch = useDispatch();
    const { id } = useParams();

    const uploadedOverdueCsvList = useSelector(
        ({ clientManagement }) => clientManagement?.overdue?.uploadedOverdueCsvList ?? []
    );
    const { total, pages, page, limit, docs } = useMemo(
        () => uploadedOverdueCsvList,
        [uploadedOverdueCsvList]
    );
    const pageActionClick = useCallback(
        async newPage => {
            const data = {
                page: newPage,
                limit: limit ?? 5,
            };
            dispatch(getUploadedOverdueCsvList(data, id));
        },
        [limit]
    );

    const onSelectLimit = useCallback(
        async newLimit => {
            const data = {
                page: 1,
                limit: newLimit,
            };
            dispatch(getUploadedOverdueCsvList(data, id));
        },
        []
    );

    const undoUpload = async (csvId) => {
        await dispatch(undoUploadedCsv(csvId));
        const data = {
            page: page ?? 1,
            limit: limit ?? 5,
        };
        dispatch(getUploadedOverdueCsvList(data, id));
    }
    useEffect(()=>{
        const data = {
            page: page ?? 1,
            limit: limit ?? 5,
        };
        dispatch(getUploadedOverdueCsvList(data, id));
    },[])
    return (
        <>
            {!uploadedOverdueCsvListLoaderAction ? (
                    <>
                        <div className='csv-table'>
                        { docs?.length > 0 ? (
                            <>
                                {docs.map((csvData) => (
                                    <div key={csvData._id} className='table-item'>
                                    <p className='table-cell'>{moment(csvData.createdAt).format('DD/MM/YYYY')}</p>
                                    <p className='table-cell'>{csvData.name}</p>
                                    <div className='table-cell'>
                                        <Button buttonType='primary' title='Undo' onClick={ async () => {
                                            await undoUpload(csvData._id)
                                        }}/>
                                    </div>
                                    {/* Render other properties of the CSV data */}
                                    </div>
                                ))}
                            </>
                            ) : (
                                <div className="no-record-found">No record found</div>
                            )
                        }
                        <Pagination
                            className="common-list-pagination"
                            total={total}
                            pages={pages}
                            page={page}
                            limit={limit}
                            pageActionClick={pageActionClick}
                            onSelectLimit={onSelectLimit}
                        />
                        </div>
                    </>
                ) : (
                    <Loader />
                )
            } 
        </> 
    )
}

export default UploadedCsvTable;