import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './entity-form.css';

function BorrowingDetails() {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();
  const [borrowing, setBorrowing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBorrowingDetails();
  }, [id]);

  const fetchBorrowingDetails = async () => {
    try {
      const response = await axios.get(`/borrowings/${id}/details`);
      setBorrowing(response.data);
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.fetchFailed' }, { item: 'borrowing' }));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(intl.formatMessage({ id: 'borrowings.deleteConfirm' }))) return;

    try {
      await axios.delete(`/borrowings/${id}`);
      navigate('/borrowings');
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.deleteFailed' }, { item: 'borrowing' }));
      console.error('Error:', err);
    }
  };

  if (loading) return <div className="loading"><FormattedMessage id="common.loading" /></div>;
  if (error) return <div className="error">{error}</div>;
  if (!borrowing) return <div className="error"><FormattedMessage id="borrowings.notFound" /></div>;

  return (
    <div className="entity-form container">
      <h2><FormattedMessage id="borrowings.details.title" /></h2>
      <div className="header-row">
        <div className="created-by">
          <FormattedMessage id="common.createdBy" values={{ username: borrowing.borrowing.username }} />
        </div>
        <button className="delete-button" onClick={handleDelete}>
          <FormattedMessage id="common.delete" />
        </button>
      </div>

      <div className="form-group">
        <label><FormattedMessage id="borrowings.field.client" /></label>
        <input
          type="text"
          value={`${borrowing.client.first_name} ${borrowing.client.last_name}`}
          readOnly
        />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="borrowings.field.book" /></label>
        <input
          type="text"
          value={borrowing.book.title}
          readOnly
        />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="borrowings.field.date" /></label>
        <input
          type="date"
          value={borrowing.borrowing.borrow_date}
          readOnly
        />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="borrowings.field.quantity" /></label>
        <input
          type="number"
          value={borrowing.borrowing.quantity}
          readOnly
        />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="borrowings.field.status" /></label>
        <input
          type="text"
          value={borrowing.borrowing.status}
          readOnly
        />
      </div>

      <div className="button-group">
        <button className="edit-button" onClick={() => navigate(`/borrowings/${id}/edit`)}>
          <FormattedMessage id="common.edit" />
        </button>

        <button className="cancel-button" onClick={() => navigate('/borrowings')}>
          <FormattedMessage id="common.cancel" />
        </button>
      </div>

      <h3><FormattedMessage id="books.details.title" /></h3>
      <table className="list-table">
        <thead>
          <tr>
            <th><FormattedMessage id="books.field.title" /></th>
            <th><FormattedMessage id="books.field.author" /></th>
            <th><FormattedMessage id="books.field.releaseDate" /></th>
            <th><FormattedMessage id="common.actions" /></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{borrowing.book.title}</td>
            <td>{borrowing.book.author}</td>
            <td>{borrowing.book.release_date}</td>
            <td>
              <button
                className="details-button"
                onClick={() => navigate(`/books/${borrowing.book.id}`)}
              >
                <FormattedMessage id="common.details" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3><FormattedMessage id="customers.details.title" /></h3>
      <table className="list-table">
        <thead>
          <tr>
            <th><FormattedMessage id="customers.field.firstName" /></th>
            <th><FormattedMessage id="customers.field.lastName" /></th>
            <th><FormattedMessage id="customers.field.pesel" /></th>
            <th><FormattedMessage id="common.actions" /></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{borrowing.client.first_name}</td>
            <td>{borrowing.client.last_name}</td>
            <td>{borrowing.client.PESEL}</td>
            <td>
              <button
                className="details-button"
                onClick={() => navigate(`/customers/${borrowing.client.id}`)}
              >
                <FormattedMessage id="common.details" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BorrowingDetails; 