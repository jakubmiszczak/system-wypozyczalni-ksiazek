import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found container">
      <h2><FormattedMessage id="error.notFound.title" /></h2>
      <p><FormattedMessage id="error.notFound.message" /></p>
      <button onClick={() => navigate('/')}>
        <FormattedMessage id="error.notFound.backHome" />
      </button>
    </div>
  );
}

export default NotFound; 