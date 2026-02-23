import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './entity-form.css';
import arrowLeftIcon from '../assets/arrow-left-short.svg';
import arrowRightIcon from '../assets/arrow-right-short.svg';
import RoleBasedRender from './RoleBasedRender';
import { useAuth } from '../contexts/AuthContext';

function BookDetails() {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  useEffect(() => {
    if (user && ['admin', 'user'].includes(user.role)) {
      fetchBookBorrowings();
    }
  }, [id, pagination.currentPage]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`/books/${id}`);
      setBook(response.data);
    } catch (err) {
      setError(intl.formatMessage({ id: 'books.error.fetch' }));
      console.error('Error fetching book details:', err);
    }
  };

  const fetchBookBorrowings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/books/${id}/borrowings?page=${pagination.currentPage}&limit=10`
      );
      setBorrowings(response.data.borrowings);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.fetchFailed' }, { item: intl.formatMessage({ id: 'borrowings.title' }) }));
      console.error('Error fetching borrowings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(intl.formatMessage({ id: 'books.deleteConfirm' }))) return;

    try {
      await axios.delete(`/books/${id}`);
      navigate('/books');
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.deleteFailed' }, { item: intl.formatMessage({ id: 'books.field.title' }) }));
      console.error('Error:', err);
    }
  };

  if (loading && !book) return <div className="loading"><FormattedMessage id="common.loading" /></div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error"><FormattedMessage id="books.notFound" /></div>;

  return (
    <div className="entity-form container">
      <h2><FormattedMessage id="books.details.title" /></h2>

      <RoleBasedRender allowedRoles={['admin']}>
        <button className="delete-button" onClick={handleDelete}>
          <FormattedMessage id="common.delete" />
        </button>
      </RoleBasedRender>

      <div className="form-group">
        <label><FormattedMessage id="books.field.title" /></label>
        <input type="text" value={book.title} disabled />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="books.field.author" /></label>
        <input type="text" value={book.author} disabled />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="books.field.releaseDate" /></label>
        <input type="number" value={new Date(book.release_date).getFullYear()} disabled />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="books.field.genre" /></label>
        <input type="text" value={book.genre} disabled />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="books.field.price" /></label>
        <input type="number" value={book.price} disabled />
      </div>

      <div className="form-group">
        <label><FormattedMessage id="books.field.stock" /></label>
        <input type="number" value={book.stock} disabled />
      </div>

      <div className="button-group">
        <RoleBasedRender allowedRoles={['admin']}>
          <button className="edit-button" onClick={() => navigate(`/books/${id}/edit`)}>
            <FormattedMessage id="common.edit" />
          </button>
        </RoleBasedRender>
        <button className="cancel-button" onClick={() => navigate('/books')}>
          <FormattedMessage id="common.cancel" />
        </button>
      </div>

      <RoleBasedRender allowedRoles={['admin', 'user']}>
        <h3><FormattedMessage id="borrowings.title" /></h3>
        <table className="list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><FormattedMessage id="borrowings.field.client" /></th>
              <th><FormattedMessage id="common.actions" /></th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map(borrowing => (
              <tr key={borrowing.id}>
                <td>{borrowing.id}</td>
                <td>{borrowing.client_name}</td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => navigate(`/borrowings/${borrowing.id}`)}>
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
      </RoleBasedRender>
    </div>
  );
}

export default BookDetails; 