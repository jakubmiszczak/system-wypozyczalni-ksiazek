import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import axios from '../utils/axios';
import { FormattedMessage, useIntl } from 'react-intl';

function Register() {
    const intl = useIntl();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateField = (name, value) => {
        if (!value.trim()) {
            return intl.formatMessage({ id: `auth.validation.${name}.required` });
        }

        switch (name) {
            case 'username':
                if (value.trim().length < 3) {
                    return intl.formatMessage({ id: 'auth.validation.username.length.min' });
                }
                if (value.trim().length > 50) {
                    return intl.formatMessage({ id: 'auth.validation.username.length.max' });
                }
                break;
            case 'password':
                if (value.length < 6) {
                    return intl.formatMessage({ id: 'auth.validation.password.length.min' });
                }
                if (value.length > 72) {
                    return intl.formatMessage({ id: 'auth.validation.password.length.max' });
                }
                break;
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    return intl.formatMessage({ id: 'validation.email.format' });
                }
                if (value.length > 255) {
                    return intl.formatMessage({ id: 'validation.email.length.max' });
                }
                break;
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        const errors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) errors[key] = error;
        });

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setSubmitError(intl.formatMessage({ id: 'auth.validation.fillRequired' }));
            return;
        }

        try {
            const response = await axios.post('/auth/register', formData);
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setSubmitError(err.response?.data?.error || intl.formatMessage({ id: 'auth.error.registerFailed' }));
        }
    };

    return (
        <div className="auth-container">
            <h2><FormattedMessage id="auth.register" /></h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label><FormattedMessage id="auth.field.username" /></label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
                </div>
                <div className="form-group">
                    <label><FormattedMessage id="auth.field.email" /></label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
                </div>
                <div className="form-group">
                    <label><FormattedMessage id="auth.field.password" /></label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
                </div>
                <button type="submit"><FormattedMessage id="auth.register" /></button>
                {submitError && <div className="summary-error">{submitError}</div>}
            </form>
            <div className="switch-auth">
                <FormattedMessage id="auth.haveAccount" />
                {' '}
                <Link to="/login"><FormattedMessage id="auth.login" /></Link>
            </div>
        </div>
    );
}

export default Register; 