import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import FormInput from '../FormInput/FormInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/YupValidator';
import styles from './CreateCardForm.module.sass';

const CraeteCardForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit} className={styles.createContainer}>
            <Field
                name='name'
                component={FormInput}
                container={styles.createCardContainer}
                inputfield={styles.inputfield}
                warning={styles.fieldWarning}
                component={FormInput}
                type='text'
                label='Add a card...'
            />
            <div className={styles.btnContainer}>
            <button type='submit' className={styles.btnAddList}>
                <span className={styles.submitBtn}>Add</span>
            </button>
            <button className={styles.btnClose} onClick={props.close}>
                <Icon path={mdiClose} size={1.5} className={styles.icon} />
            </button>
            </div>
        </form>
    );
};

export default reduxForm({
    form: 'createCard',
    validate: customValidator(Schems.CreateBoardSchem),
})(CraeteCardForm);
