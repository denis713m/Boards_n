import React from 'react';
import { Field, reduxForm } from 'redux-form';
import FormInput from '../FormInput/FormInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/YupValidator';
import styles from './CreateBoardForm.module.sass';

const CreateBoardForm = (props) => {
    return (
        <div className={styles.overlay}>
            <form onSubmit={props.handleSubmit} className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Board creation</h3>
                    <div type='button' className={styles.btnClose} onClick={props.close}>X</div>
                </div>
                <Field
                    name='name'
                    component={FormInput}
                    type='text'
                    label='Board name'
                />
                <button type='submit' className={styles.submitContainer}>
                    <span className={styles.submitBtn}>Create board</span>
                </button>
            </form>
        </div>
    );
}

export default reduxForm({
    form: 'createBoard',
    validate: customValidator(Schems.CreateBoardSchem)
})(CreateBoardForm);
