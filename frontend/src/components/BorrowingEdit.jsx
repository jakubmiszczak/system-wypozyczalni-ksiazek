import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './entity-form.css';

function BorrowingEdit() {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();
  const [borrowing, setBorrowing] = useState({
    status: '',
    quantity: '',
    borrow_date: '',
    client_id: '',
    book_id: ''
  });
  const [clients, setClients] = useState([]);
  const [books, setBooks] = useState([]);
  const [errors, setErrors] = useState({
    status: '',
    quantity: '',
    borrow_date: '',
    client_id: '',
    book_id: '',
    general: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchBorrowing(),
      fetchClients(),
      fetchBooks()
    ]).finally(() => setLoading(false));
  }, [id]);

  const validateField = (name, value) => {
    switch (name) {
      case 'client_id':
        return !value ? intl.formatMessage({ id: "borrowings.validation.client.required" }) : '';
      case 'book_id':
        return !value ? intl.formatMessage({ id: "borrowings.validation.book.required" }) : '';
      case 'borrow_date':
        return !value ? intl.formatMessage({ id: "borrowings.validation.date.required" }) : '';
      case 'quantity':
        if (!value) return intl.formatMessage({ id: "borrowings.validation.quantity.required" });
        const numericQuantity = parseInt(value);
        if (isNaN(numericQuantity)) return intl.formatMessage({ id: "borrowings.validation.quantity.number" });
        if (numericQuantity < 1) return intl.formatMessage({ id: "borrowings.validation.quantity.positive" });
        
        const selectedBook = books.find(book => book.id === parseInt(borrowing.book_id));
        if (selectedBook && numericQuantity > selectedBook.stock) {
          return intl.formatMessage(
            { id: "borrowings.validation.quantity.exceedsStock" },
            { available: selectedBook.stock }
          );
        }
        if (numericQuantity > 1000) return intl.formatMessage({ id: "borrowings.validation.quantity.tooHigh" });
        return '';
      case 'status':
        return !value ? intl.formatMessage({ id: "borrowings.validation.status.required" }) :
          !['borrowed', 'returned'].includes(value) ? intl.formatMessage({ id: "validation.invalidStatus" }) : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(borrowing).forEach(field => {
      const error = validateField(field, borrowing[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    newErrors.general = isValid ? '' : intl.formatMessage({ id: "validation.fixErrors" });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const fetchBorrowing = async () => {
    try {
      const response = await axios.get(`/borrowings/${id}/details`);
      setBorrowing({
        status: response.data.borrowing.status,
        quantity: response.data.borrowing.quantity,
        borrow_date: response.data.borrowing.borrow_date,
        client_id: response.data.client.id,
        book_id: response.data.book.id
      });
    } catch (err) {
      setErrors(prev => ({ ...prev, general: intl.formatMessage({ id: 'borrowings.error.fetch' }) }));
      console.error('Error fetching borrowing:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('/clients/select-options');
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books/select-options');
      setBooks(response.data);
    } catch (err) {
      setErrors(prev => ({ ...prev, general: intl.formatMessage({ id: 'error.fetchBooks' }) }));
      console.error('Error fetching books:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`/borrowings/${id}`, borrowing);
      navigate(`/borrowings/${id}`);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: err.response?.data?.error || intl.formatMessage({ id: 'error.updateFailed' }, { item: intl.formatMessage({ id: 'borrowings.title' }) })
      }));
      console.error('Error updating borrowing:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBorrowing(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  if (loading) return <div className="loading"><FormattedMessage id="common.loading" /></div>;

  return (
    <div className="entity-form container">
      <h2><FormattedMessage id="borrowings.edit.title" /></h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label><FormattedMessage id="borrowings.field.client" /></label>
          <select
            name="client_id"
            value={borrowing.client_id}
            onChange={handleChange}
          >
            <option value=""><FormattedMessage id="common.selectOption" values={{ field: intl.formatMessage({ id: "borrowings.field.client" }) }} /></option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.client_id && <div className="error-message">{errors.client_id}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="borrowings.field.book" /></label>
          <select
            name="book_id"
            value={borrowing.book_id}
            onChange={handleChange}
          >
            <option value=""><FormattedMessage id="common.selectOption" values={{ field: intl.formatMessage({ id: "borrowings.field.book" }) }} /></option>
            {books.map(book => (
              <option key={book.id} value={book.id} disabled={book.stock < 1}>
                {book.title} ({book.stock} <FormattedMessage id="books.field.available" />)
              </option>
            ))}
          </select>
          {errors.book_id && <div className="error-message">{errors.book_id}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="borrowings.field.date" /></label>
          <input
            type="date"
            name="borrow_date"
            value={borrowing.borrow_date}
            onChange={handleChange}
          />
          {errors.borrow_date && <div className="error-message">{errors.borrow_date}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="borrowings.field.quantity" /></label>
          <input
            type="number"
            name="quantity"
            value={borrowing.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <div className="error-message">{errors.quantity}</div>}
        </div>

        <div className="form-group">
          <label><FormattedMessage id="borrowings.field.status" /></label>
          <select
            name="status"
            value={borrowing.status}
            onChange={handleChange}
          >
            <option value=""><FormattedMessage id="common.selectOption" values={{ field: intl.formatMessage({ id: "borrowings.field.status" }) }} /></option>
            <option value="borrowed"><FormattedMessage id="borrowings.status.borrowed" /></option>
            <option value="returned"><FormattedMessage id="borrowings.status.returned" /></option>
          </select>
          {errors.status && <div className="error-message">{errors.status}</div>}
        </div>

        <div className="button-group">
          <button type="submit"><FormattedMessage id="common.save" /></button>
          {errors.general && <div className="error-message general">{errors.general}</div>}
          <button type="button" className="cancel-button" onClick={() => navigate(`/borrowings/${id}`)}>
            <FormattedMessage id="common.cancel" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default BorrowingEdit; 