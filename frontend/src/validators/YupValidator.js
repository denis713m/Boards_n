import * as yup from 'yup';

export default {
    LoginSchem: yup.object().shape({
        email: yup.string().email('check email').required('required'),
        password: yup.string().test('test-password','min 6 symbols',value => (value && value.trim().length>=6)).required('required')
    }),
    RegistrationSchem: yup.object().shape({
        firstName: yup.string().test('test-name','min 3 symbols',value => (value && value.trim().length>=3)).required('required'),
        lastName: yup.string().test('test-name','min 3 symbols',value => (value && value.trim().length>=3)).required('required'),
        displayName: yup.string().test('test-name','min 3 symbols',value => (value && value.trim().length>=3)).required('required'),
        email: yup.string().email('check email').required('required'),
        password: yup.string().test('test-password','min 6 symbols',value => (value && value.trim().length>=6)).required('required')
    }),
    CreateBoardSchem: yup.object().shape({
        name: yup.string().test('test-name','min 3 symbols',value => (value && value.trim().length>=3)).required('required'),        
    }),
}