import React from 'react';
import { Field, reduxForm } from 'redux-form';
import FormInput from '../FormInput/FormInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/YupValidator';
import styles from './CreateListForm.module.sass';

const CreateListForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit} className={styles.createContainer}>
            <Field
                name='name'
                component={FormInput}
                container={styles.createListContainer}
                inputfield={styles.inputfield}
                warning={styles.fieldWarning}
                type='text'
                label='Add a list...'
            />
            <button type='submit' className={styles.btnCreateList}>
                <span className={styles.submitBtn}>Save</span>
            </button>
            {(!props.pristine || props.anyTouched) && (
                <button className={styles.btnResetName} onClick={props.reset}>
                    X
                </button>
            )}
        </form>
    );
};

export default reduxForm({
    form: 'createList',
    validate: customValidator(Schems.CreateBoardSchem),
})(CreateListForm);
