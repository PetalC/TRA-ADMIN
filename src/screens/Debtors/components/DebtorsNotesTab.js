import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import BigInput from '../../../common/BigInput/BigInput';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import Switch from '../../../common/Switch/Switch';
import Input from '../../../common/Input/Input';
import Table, { TABLE_ROW_ACTIONS } from '../../../common/Table/Table';
import {
  addDebtorsNoteAction,
  deleteDebtorsNoteAction,
  getDebtorsNotesListDataAction,
  updateDebtorsNoteAction,
} from '../redux/DebtorsAction';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import Pagination from '../../../common/Pagination/Pagination';

const NOTE_ACTIONS = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

const initialDebtorsNoteState = {
  noteId: null,
  description: '',
  isPublic: false,
  type: NOTE_ACTIONS.ADD,
};

const DEBTORS_NOTE_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function debtorsNoteReducer(state, action) {
  switch (action.type) {
    case DEBTORS_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case DEBTORS_NOTE_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case DEBTORS_NOTE_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialDebtorsNoteState };
    default:
      return state;
  }
}

const DebtorsNotesTab = () => {
  const searchInputRef = useRef();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [modifyNoteModal, setModifyNoteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [selectedDebtorsNote, dispatchSelectedDebtorsNote] = useReducer(
    debtorsNoteReducer,
    initialDebtorsNoteState
  );

  const debtorsNotesList = useSelector(
    ({ debtorsManagement }) => debtorsManagement.notes.notesList
  );

  const toggleModifyNotes = useCallback(
    value => setModifyNoteModal(value !== undefined ? value : e => !e),
    [setModifyNoteModal]
  );

  const { total, pages, page, limit, docs, headers } = useMemo(() => debtorsNotesList, [
    debtorsNotesList,
  ]);

  const getDebtorNotesList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getDebtorsNotesListDataAction(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getDebtorNotesList({ page: 1, limit: newLimit });
    },
    [getDebtorNotesList]
  );

  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const onSelectUserRecordActionClick = useCallback(
    async (type, noteId, noteData) => {
      if (type === TABLE_ROW_ACTIONS.EDIT_ROW) {
        const { description, isPublic } = noteData;
        const data = {
          noteId,
          description,
          isPublic: isPublic === 'Yes',
          type: NOTE_ACTIONS.EDIT,
        };
        dispatchSelectedDebtorsNote({
          type: DEBTORS_NOTE_REDUCER_ACTIONS.UPDATE_DATA,
          data,
        });
        toggleModifyNotes();
      } else if (type === TABLE_ROW_ACTIONS.DELETE_ROW) {
        setDeleteId(noteId);
        toggleConfirmationModal();
      }
    },
    [toggleModifyNotes]
  );

  const onChangeSelectedNoteInput = useCallback(e => {
    dispatchSelectedDebtorsNote({
      type: DEBTORS_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name: e.target.name,
      value: e.target.value,
    });
  }, []);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (e.target.value.trim().toString().length === 1) {
      getDebtorNotesList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getDebtorNotesList({ search: searchKeyword.trim().toString() });
      } else {
        getDebtorNotesList();
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const onCloseNotePopup = useCallback(() => {
    dispatchSelectedDebtorsNote({
      type: DEBTORS_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [toggleModifyNotes, dispatchSelectedDebtorsNote]);

  const addOrUpdateNote = useCallback(async () => {
    const noteData = {
      description: selectedDebtorsNote.description,
      isPublic: selectedDebtorsNote.isPublic,
    };
    if (selectedDebtorsNote.type === NOTE_ACTIONS.ADD) {
      // await dispatch(addClientNoteAction(id, noteData));
      await dispatch(addDebtorsNoteAction(id, noteData));
    } else {
      noteData.noteId = selectedDebtorsNote.noteId;
      await dispatch(updateDebtorsNoteAction(id, noteData));
    }
    dispatchSelectedDebtorsNote({
      type: DEBTORS_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [selectedDebtorsNote, toggleModifyNotes]);

  const addToCRMButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseNotePopup() },
      {
        title: `${selectedDebtorsNote.type === 'EDIT' ? 'Edit' : 'Add'} `,
        buttonType: 'primary',
        onClick: addOrUpdateNote,
      },
    ],
    [onCloseNotePopup, addOrUpdateNote]
  );

  const callBack = () => {
    setDeleteId(null);
    toggleConfirmationModal();
    getDebtorNotesList();
  };

  const deleteNoteButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: () => {
          try {
            dispatch(deleteDebtorsNoteAction(deleteId, () => callBack()));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, getDebtorNotesList, deleteId]
  );

  const pageActionClick = useCallback(
    newPage => {
      getDebtorNotesList({ page: newPage, limit });
    },
    [limit, getDebtorNotesList]
  );

  const onChangeSelectedNoteSwitch = useCallback(e => {
    dispatchSelectedDebtorsNote({
      type: DEBTORS_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name: e.target.name,
      value: e.target.checked,
    });
  }, []);

  useEffect(() => {
    getDebtorNotesList();
  }, []);

  return (
    <>
      {modifyNoteModal && (
        <Modal
          header={`${selectedDebtorsNote.type === 'EDIT' ? 'Edit Note' : 'Add Note'} `}
          className="add-to-crm-modal"
          buttons={addToCRMButtons}
          hideModal={toggleModifyNotes}
        >
          <div className="add-notes-popup-container">
            <span>Description</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="Note description"
              name="description"
              type="text"
              value={selectedDebtorsNote.description}
              onChange={onChangeSelectedNoteInput}
            />
            <span>Private/Public</span>
            <Switch
              id="selected-note"
              name="isPublic"
              checked={selectedDebtorsNote.isPublic}
              onChange={onChangeSelectedNoteSwitch}
            />
          </div>
        </Modal>
      )}
      {showConfirmModal && (
        <Modal header="Delete Note" buttons={deleteNoteButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this note?</span>
        </Modal>
      )}
      <div className="tab-content-header-row">
        <div className="tab-content-header">Notes</div>
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
          <Button buttonType="success" title="Add" onClick={toggleModifyNotes} />
        </div>
      </div>
      {docs ? (
        <>
          <div className="tab-table-container">
            <Table
              align="left"
              valign="center"
              data={docs}
              tableClass="white-header-table"
              headers={headers}
              recordActionClick={onSelectUserRecordActionClick}
              refreshData={getDebtorNotesList}
              haveActions
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
        <Loader />
      )}
    </>
  );
};

export default DebtorsNotesTab;