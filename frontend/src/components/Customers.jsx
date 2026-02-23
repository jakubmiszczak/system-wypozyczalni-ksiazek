import { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './ListComponent.css';
import arrowLeftIcon from '../assets/arrow-left-short.svg';
import arrowRightIcon from '../assets/arrow-right-short.svg';

function Customers() {
  const intl = useIntl();
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchCustomers = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`/clients?page=${page}&limit=10`);
      setCustomers(response.data.clients);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.fetchFailed' }, { item: 'customers' }));
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(intl.formatMessage({ id: 'customers.deleteConfirm' }))) {
      try {
        await axios.delete(`/clients/${id}`);
        fetchCustomers(pagination.currentPage);
      } catch (err) {
        setError(intl.formatMessage({ id: 'error.deleteFailed' }, { item: 'customer' }));
        console.error('Error deleting customer:', err);
      }
    }
  };

  if (loading) return <div className="loading"><FormattedMessage id="common.loading" /></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-component container">
      <h2><FormattedMessage id="customers.title" /></h2>
      <button className="add-button" onClick={() => window.location.href = '/customers/add'}>
        <FormattedMessage id="common.add" />
      </button>

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
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.PESEL}</td>
              <td className="actions">
                <button
                  onClick={() => window.location.href = `/customers/${customer.id}`}
                >
                  <FormattedMessage id="common.details" />
                </button>
                <button
                  onClick={() => window.location.href = `/customers/${customer.id}/edit`}
                >
                  <FormattedMessage id="common.edit" />
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                >
                  <FormattedMessage id="common.delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={pagination.currentPage === 1 || pagination.totalPages === 0}
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
        >
          <img src={arrowLeftIcon} alt="left arrow" />
        </button>
        <span>
          {pagination.totalPages === 0
            ? <FormattedMessage id="common.noRecords" />
            : <FormattedMessage
              id="common.pagination"
              values={{
                current: pagination.currentPage,
                total: pagination.totalPages
              }}
            />
          }
        </span>
        <button
          disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
        >
          <img src={arrowRightIcon} alt="right arrow" />
        </button>
      </div>
    </div>
  );
}

export default Customers; 