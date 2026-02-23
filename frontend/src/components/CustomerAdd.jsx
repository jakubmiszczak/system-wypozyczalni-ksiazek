import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './entity-form.css';

function CustomerAdd() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    first_name: '',
    last_name: '',
    PESEL: '',
    email: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    PESEL: '',
    email: '',
    phone_number: '',
    general: ''
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'first_name':
        if (!value.trim()) return intl.formatMessage({ id: "customers.validation.firstName.required" });
        if (value.length > 50) return intl.formatMessage({ id: "customers.validation.firstName.maxLength" });
        return '';
      case 'last_name':
        if (!value.trim()) return intl.formatMessage({ id: "customers.validation.lastName.required" });
        if (value.length > 50) return intl.formatMessage({ id: "customers.validation.lastName.maxLength" });
        return '';
      case 'PESEL':
        if (!value.trim()) return intl.formatMessage({ id: "customers.validation.pesel.required" });
        if (!/^\d{11}$/.test(value)) return intl.formatMessage({ id: "customers.validation.pesel.format" });
        return '';
      case 'email':
        if (!value.trim()) return intl.formatMessage({ id: "customers.validation.email.required" });
        if (!/\S+@\S+\.\S+/.test(value)) return intl.formatMessage({ id: "customers.validation.email.format" });
        if (value.length > 255) return intl.formatMessage({ id: "customers.validation.email.maxLength" });
        return '';
      case 'phone_number':
        if (!value.trim()) return intl.formatMessage({ id: "customers.validation.phone.required" });
        if (value.length > 15) return intl.formatMessage({ id: "customers.validation.phone.maxLength" });
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(customer).forEach(field => {
      const error = validateField(field, customer[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    newErrors.general = isValid ? '' : intl.formatMessage({ id: "validation.fixErrors" });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('/clients', customer);
      navigate('/customers');
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: err.response?.data?.error || intl.formatMessage({ id: "error.createFailed" }, { item: intl.formatMessage({ id: "customers.title" }) })
      }));
      console.error('Error creating customer:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  return (
    <div className="entity-form container">
      <h2><FormattedMessage id="customers.add.title" /></h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label><FormattedMessage id="customers.field.firstName" /></label>
          <input
            type="text"
            name="first_name"
            value={customer.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <div className="error-message">{errors.first_name}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="customers.field.lastName" /></label>
          <input
            type="text"
            name="last_name"
            value={customer.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <div className="error-message">{errors.last_name}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="customers.field.pesel" /></label>
          <input
            type="text"
            name="PESEL"
            value={customer.PESEL}
            onChange={handleChange}
          />
          {errors.PESEL && <div className="error-message">{errors.PESEL}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="customers.field.email" /></label>
          <input
            type="text"
            name="email"
            value={customer.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="customers.field.phone" /></label>
          <input
            type="text"
            name="phone_number"
            value={customer.phone_number}
            onChange={handleChange}
          />
          {errors.phone_number && <div className="error-message">{errors.phone_number}</div>}
        </div>

        <div className="button-group">
          <button type="submit">
            <FormattedMessage id="common.save" />
          </button>
          {errors.general && <div className="error-message general">{errors.general}</div>}
          <button type="button" className="cancel-button" onClick={() => navigate('/customers')}>
            <FormattedMessage id="common.cancel" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerAdd; 