import React from 'react';
import { Field, reduxForm } from 'redux-form';
import FormInput from '../FormInput/FormInput';
import styles from './LoginForm.module.sass';
import Schems from '../../validators/YupValidator';
import validator from '../../validators/validator';

const Form = (props) => {
    const { handleSubmit } = props;

    return (
        <form onSubmit={handleSubmit} className={styles.mainContainer}>
            <div >
                <Field component={FormInput}
                    name="email"  type="text" label='email' />
            </div>
            <div >
                <Field component={FormInput}
                    name="password"  type="password" label='password'/>
            </div>
            <button className={styles.button} type="submit">LogIn</button>
    </form>
    );
}
const LoginForm = reduxForm({    
    form: 'login',
    validate : validator(Schems.LoginSchem),
  })(Form)
  

export default LoginForm;
