import React, { useCallback, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ImportOverdueImportStep from './Components/ImportOverdueImportStep/ImportOverdueImportStep';
import Button from '../../../common/Button/Button';
import ImportOverdueValidateStep from './Components/ImportOverdueValidateStep/ImportOverdueValidateStep';
import ImportOverdueABNLookUpStep from './Components/ImportOverdueABNLookUpStep/ImportOverdueABNLookUpStep';
import ImportOverdueGenerateOverdueStep from './Components/ImportOverdueGenerateOverdueStep/ImportOverdueGenerateOverdueStep';
import ImportOverdueDownloadSample from './Components/ImportOverdueDownloadSample/ImportOverdueDownloadSample';
import {
  importOverdueGoToNextStep,
  importOverdueSaveAndNext,
  resetImportOverdueStepper,
} from '../redux/OverduesAction';
import { importOverdueImportStepValidations } from './Components/ImportOverdueImportStep/ImportOverdueImportStepValidations';
import { errorNotification } from '../../../common/Toast';

const STEPS = [
  {
    text: 'Download File',
    name: 'downloadFile',
  },
  {
    text: 'Import File',
    name: 'importFile',
    button: 'Import File',
  },
  {
    text: 'Validate Overdues',
    name: 'validateOverdue',
    button: 'Validate Overdues',
  },
  {
    text: 'ACN LookUp',
    name: 'abnLookUp',
    button: 'ABN/NZBN LookUp',
  },
  {
    text: 'Generate Overdues',
    name: 'generateOverdue',
    button: 'Generate Overdues',
  },
];
const STEP_COMPONENT = [
  <ImportOverdueDownloadSample />,
  <ImportOverdueImportStep />,
  <ImportOverdueValidateStep />,
  <ImportOverdueABNLookUpStep />,
  <ImportOverdueGenerateOverdueStep />,
];
const ImportOverdueStepper = ({ oncancelImportOverdueModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, period } = useParams();
  const { importOverdue } = useSelector(({ overdue }) => overdue ?? {});
  const activeStep = useMemo(() => importOverdue?.activeStep ?? 0, [importOverdue]);
  const importId = useMemo(() => importOverdue?.importId ?? null, [importOverdue]);
  const { toBeProcessedOverdueCount } = useMemo(
    () => importOverdue?.importData ?? 0,
    [importOverdue]
  );
  const { saveAndNextIOLoader, deleteDumpFromBackEndLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const validate = useCallback(async () => {
    const data = importOverdue?.[STEPS?.[activeStep ?? 0]?.name];
    try {
      switch (STEPS?.[activeStep]?.name) {
        case 'downloadFile':
          return true;
        case 'importFile':
          return await importOverdueImportStepValidations(dispatch, data, id, period);
        case 'validateOverdue':
          return dispatch(importOverdueSaveAndNext(importId, 'VALIDATE_OVERDUES'));
        case 'abnLookUp':
          return dispatch(importOverdueSaveAndNext(importId, 'GENERATE_OVERDUES'));
        case 'generateOverdue':
          dispatch(resetImportOverdueStepper());
          history.push(`/over-dues`);
          return true;
        default:
          return false;
      }
    } catch (e) {
      /**/
    }
    return false;
  }, [importOverdue, activeStep, importId]);

  const onClickNextStep = useCallback(async () => {
    if (toBeProcessedOverdueCount !== 0) {
      const result = await validate();
      if (result && activeStep < STEPS.length - 1) {
        dispatch(importOverdueGoToNextStep());
      }
    } else {
      errorNotification('No overdue to be processed.');
    }
  }, [activeStep, validate, toBeProcessedOverdueCount]);
  return (
    <div className="mt-10">
      <div className="io-stepper-container">
        {STEPS.map((step, index) => (
          <div
            key={step.text}
            className={`io-stepper-item ${index <= activeStep && 'io-done-step'}`}
          >
            <div className={`io-step-circle ${index <= activeStep && 'io-done-step'} `} />
            <div className={`io-step-name ${index <= activeStep && 'io-done-step'}`}>
              {step.text}
            </div>
          </div>
        ))}
      </div>
      <div className="io-step-content">
        {!saveAndNextIOLoader ? (
          STEP_COMPONENT[activeStep]
        ) : (
          <span className="no-record-found">Processing overdues please wait...</span>
        )}
      </div>
      <div className="io-step-button-row">
        {activeStep < STEPS.length - 1 && (
          <Button
            buttonType="outlined-primary"
            title="Cancel"
            onClick={oncancelImportOverdueModal}
            isLoading={deleteDumpFromBackEndLoader}
          />
        )}
        {activeStep === STEPS.length - 1 && (
          <Button
            buttonType="outlined-primary"
            title="Close"
            onClick={onClickNextStep}
            isLoading={deleteDumpFromBackEndLoader}
          />
        )}
        {activeStep < STEPS.length - 1 && (
          <Button
            className="ml-15"
            buttonType="primary"
            title={STEPS[activeStep + 1].button}
            onClick={onClickNextStep}
            isLoading={saveAndNextIOLoader}
          />
        )}
      </div>
    </div>
  );
};

ImportOverdueStepper.propTypes = {
  oncancelImportOverdueModal: PropTypes.func.isRequired,
};

export default ImportOverdueStepper;
