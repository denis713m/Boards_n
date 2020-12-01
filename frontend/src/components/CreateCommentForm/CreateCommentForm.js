import React from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import CommentInput from '../CommentInput/CommentInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/YupValidator';
import styles from './CreateCommentForm.module.sass';

const CreateCommentForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit} className={styles.createContainer}>
            <Field
                name='name'
                component={CommentInput}
                container={styles.createListContainer}
                inputfield={styles.inputfield}
                warning={styles.fieldWarning}
                type='text'
                label='Write a comment...'
            />
            <button type='submit' className={styles.btnSaveComment}>
                <span>Save</span>
            </button>
        </form>
    );
};

const afterSubmit = (result, dispatch) => dispatch(reset('createComment'));

export default reduxForm({
    form: 'createComment',
    onSubmitSuccess: afterSubmit,
    validate: customValidator(Schems.CreateBoardSchem),
})(CreateCommentForm);
