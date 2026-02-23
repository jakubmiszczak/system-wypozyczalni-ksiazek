import { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../utils/axios';
import './ListComponent.css';
import arrowLeftIcon from '../assets/arrow-left-short.svg'
import arrowRightIcon from '../assets/arrow-right-short.svg'
import RoleBasedRender from './RoleBasedRender'

function Books() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    fetchBooks(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchBooks = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`/books?page=${page}&limit=10`);
      setBooks(response.data.books);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(intl.formatMessage({ id: 'books.deleteConfirm' }))) {
      try {
        await axios.delete(`/books/${id}`);
        fetchBooks(pagination.currentPage);
      } catch (err) {
        setError('Failed to delete book');
        console.error('Error deleting book:', err);
      }
    }
  };

  if (loading) return <div className="loading"><FormattedMessage id="common.loading" /></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-component container">
      <h2><FormattedMessage id="books.title" /></h2>
      <RoleBasedRender allowedRoles={['admin']}>
        <button className="add-button" onClick={() => window.location.href = '/books/add'}>
          <FormattedMessage id="common.add" />
        </button>
      </RoleBasedRender>

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
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{new Date(book.release_date).getFullYear()}</td>
              <td className="actions">
                <button onClick={() => window.location.href = `/books/${book.id}`}>
                  <FormattedMessage id="common.details" />
                </button>
                <RoleBasedRender allowedRoles={['admin']}>
                  <button onClick={() => window.location.href = `/books/${book.id}/edit`}>
                    <FormattedMessage id="common.edit" />
                  </button>
                  <button onClick={() => handleDelete(book.id)}>
                    <FormattedMessage id="common.delete" />
                  </button>
                </RoleBasedRender>
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

export default Books; 