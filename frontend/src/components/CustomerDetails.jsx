import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './entity-form.css';
import arrowLeftIcon from '../assets/arrow-left-short.svg';
import arrowRightIcon from '../assets/arrow-right-short.svg';

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const intl = useIntl();

  useEffect(() => {
    fetchCustomerDetails();
  }, [id, pagination.currentPage]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(
        `/clients/${id}/borrowings?page=${pagination.currentPage}`
      );
      setCustomer(response.data.client);
      setBorrowings(response.data.borrowings);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (err) {
      setError('Failed to fetch customer details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(intl.formatMessage({ id: 'customers.deleteConfirm' }))) return;

    try {
      await axios.delete(`/clients/${id}`);
      navigate('/customers');
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error:', err);
    }
  };

  if (loading) return <div className="loading"><FormattedMessage id="common.loading" /></div>;
  if (error) return <div className="error">{error}</div>;
  if (!customer) return <div className="error"><FormattedMessage id="customers.notFound" /></div>;

  return (
    <div className="entity-form container">
      <h2><FormattedMessage id="customers.details.title" /></h2>

      <button className="delete-button" onClick={handleDelete}>
        <FormattedMessage id="common.delete" />
      </button>

      <div className="form-group">
        <label><FormattedMessage id="customers.field.firstName" /></label>
        <input type="text" value={customer.first_name} readOnly />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="customers.field.lastName" /></label>
        <input type="text" value={customer.last_name} readOnly />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="customers.field.pesel" /></label>
        <input type="text" value={customer.PESEL} readOnly />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="customers.field.email" /></label>
        <input type="email" value={customer.email} readOnly />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="customers.field.phone" /></label>
        <input type="tel" value={customer.phone_number} readOnly />
      </div>

      <div className="button-group">
        <button className="edit-button" onClick={() => navigate(`/customers/${id}/edit`)}>
          <FormattedMessage id="common.edit" />
        </button>
        <button className="cancel-button" onClick={() => navigate('/customers')}>
          <FormattedMessage id="common.cancel" />
        </button>
      </div>

      <h3><FormattedMessage id="customers.borrowings.title" /></h3>
      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th><FormattedMessage id="borrowings.field.book" /></th>
            <th><FormattedMessage id="common.actions" /></th>
          </tr>
        </thead>
        <tbody>
          {borrowings.map(borrowing => (
            <tr key={borrowing.id}>
              <td>{borrowing.id}</td>
              <td>{borrowing.book_title}</td>
              <td>
                <button
                  className="details-button"
                  onClick={() => navigate(`/borrowings/${borrowing.id}`)}
                >
                  <FormattedMessage id="common.details" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {borrowings.length > 0 && (
        <div className="pagination">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          >
            <img src={arrowLeftIcon} alt="left arrow" />
          </button>
          <span>
            <FormattedMessage
              id="common.pagination"
              values={{
                current: pagination.currentPage,
                total: pagination.totalPages
              }}
            />
          </span>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          >
            <img src={arrowRightIcon} alt="right arrow" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomerDetails; 