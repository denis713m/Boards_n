import React from 'react';
import { Field, reduxForm } from 'redux-form';
import FormInput from '../FormInput/FormInput';
import Schems from '../../validators/YupValidator';
import validator from '../../validators/validator';
import styles from './RegistrationForm.module.sass';


const RegistrationForm = (props) => {
    const { handleSubmit } = props;
    console.log(props);
    return (
        <form onSubmit={handleSubmit} className={styles.mainContainer}>
            <div >
                <Field component={FormInput}
                    name="firstName"  type="text" label='First name'/>
            </div>
            <div >
                <Field component={FormInput}
                    name="lastName"  type="text" label='Last name'/>
            </div>
            <div >
                <Field component={FormInput}
                    name="displayName"  type="text" label='Display name'/>
            </div>
            <div >
                <Field component={FormInput}
                    name="email"  type="text" label='email' />
            </div>
            <div >
                <Field component={FormInput}
                    name="password"  type="password" label='password'/>
            </div>
            <button className={styles.button} type="submit">Registrate</button>
    </form>
    );
}



export default reduxForm({    
        form: 'register',
        validate : validator(Schems.RegistrationSchem),
        })(RegistrationForm);

