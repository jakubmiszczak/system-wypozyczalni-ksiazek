import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './entity-form.css';

function BookAdd() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [book, setBook] = useState({
    title: '',
    author: '',
    release_date: '',
    genre: '',
    price: '',
    stock: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    release_date: '',
    genre: '',
    price: '',
    stock: '',
    general: ''
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return !value.trim() ? intl.formatMessage({ id: 'books.validation.title' }) : '';
      case 'author':
        return !value.trim() ? intl.formatMessage({ id: 'books.validation.author' }) : '';
      case 'release_date':
        return !value ? intl.formatMessage({ id: 'books.validation.releaseDate' }) : '';
      case 'genre':
        return !value.trim() ? intl.formatMessage({ id: 'books.validation.genre' }) : '';
      case 'price':
        if (!value) return intl.formatMessage({ id: 'books.validation.price.required' });
        const numericPrice = parseFloat(value);
        if (isNaN(numericPrice)) return intl.formatMessage({ id: 'books.validation.price.number' });
        if (numericPrice <= 0) return intl.formatMessage({ id: 'books.validation.price.positive' });
        if (numericPrice > 1000000) return intl.formatMessage({ id: 'books.validation.price.tooHigh' });
        return '';
      case 'stock':
        if (!value) return intl.formatMessage({ id: 'books.validation.stock.required' });
        const numericStock = parseInt(value);
        if (isNaN(numericStock)) return intl.formatMessage({ id: 'books.validation.stock.number' });
        if (numericStock < 0) return intl.formatMessage({ id: 'books.validation.stock.nonNegative' });
        if (numericStock > 1000000) return intl.formatMessage({ id: 'books.validation.stock.tooHigh' });
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(book).forEach(field => {
      const error = validateField(field, book[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    newErrors.general = isValid ? '' : intl.formatMessage({ id: "validation.fixErrors" });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('/books', book);
      navigate('/books');
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: err.response?.data?.error || intl.formatMessage({ id: 'books.error.create' })
      }));
      console.error('Error creating book:', err);
    }
  };

  return (
    <div className="entity-form container">
      <h2><FormattedMessage id="books.add.title" /></h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label><FormattedMessage id="books.field.title" /></label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
          />
          {errors.author && <div className="error-message">{errors.author}</div>}
        </div>

        <div className="form-group">
          <label>Release Date</label>
          <input
            type="date"
            name="release_date"
            value={book.release_date}
            onChange={handleChange}
          />
          {errors.release_date && <div className="error-message">{errors.release_date}</div>}
        </div>

        <div className="form-group">
          <label>Genre</label>
          <input
            type="text"
            name="genre"
            value={book.genre}
            onChange={handleChange}
          />
          {errors.genre && <div className="error-message">{errors.genre}</div>}
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={book.price}
            onChange={handleChange}
          />
          {errors.price && <div className="error-message">{errors.price}</div>}
        </div>

        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={book.stock}
            onChange={handleChange}
          />
          {errors.stock && <div className="error-message">{errors.stock}</div>}
        </div>

        <div className="button-group">
          <button type="submit">
            <FormattedMessage id="common.save" />
          </button>
          {errors.general && <div className="error-message general">{errors.general}</div>}
          <button type="button" className="cancel-button" onClick={() => navigate('/books')}>
            <FormattedMessage id="common.cancel" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookAdd; 