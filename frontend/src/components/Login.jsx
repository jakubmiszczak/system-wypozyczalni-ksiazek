import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import './Auth.css';
import { FormattedMessage, useIntl } from 'react-intl';

function Login() {
    const intl = useIntl();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateField = (name, value) => {
        if (!value.trim()) {
            return intl.formatMessage({ id: `auth.validation.${name}.required` });
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
            const response = await axios.post('/auth/login', formData);
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setSubmitError(err.response?.data?.error || intl.formatMessage({ id: 'auth.error.loginFailed' }));
        }
    };

    return (
        <div className="auth-container">
            <h2><FormattedMessage id="auth.login" /></h2>
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
                    <label><FormattedMessage id="auth.field.password" /></label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
                </div>
                <button type="submit"><FormattedMessage id="auth.login" /></button>
                {submitError && <div className="summary-error">{submitError}</div>}
            </form>
            <div className="switch-auth">
                <FormattedMessage id="auth.noAccount" />
                {' '}
                <Link to="/register"><FormattedMessage id="auth.register" /></Link>
            </div>
        </div>
    );
}

export default Login; 