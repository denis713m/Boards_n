import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import FormInput from '../FormInput/FormInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/YupValidator';
import styles from './RenameBoardForm.module.sass';

const RenameBoardForm = (props) => {
    return (
            <form onSubmit={props.handleSubmit} className={styles.changeContainer}>
                <Field
                    name='name'
                    component={FormInput}
                    container={styles.renameContainer}
                    inputfield={styles.inputfield}
                    warning = {styles.fieldWarning}
                    component={FormInput}
                    type='text'
                />
                <button type='submit' className={styles.btnRenameBoard}>
                    <span className={styles.submitBtn}>Rename</span>
                </button>
                <button className={styles.btnResetName} onClick={props.close}>
                    X
                </button>
            </form>


    );
}
function mapStateToProps(state, ownProps) {
    return {
      initialValues: {
        'name': state.boards.currentBoard.name
      }
  }
};

export default connect(mapStateToProps)( reduxForm({
    form: 'renameBoard',
    //enableReinitialize: true,
    mapStateToProps,
    validate: customValidator(Schems.CreateBoardSchem)
})(RenameBoardForm));
