import './App.css'
import { BrowserRouter, NavLink, Link, Routes, Route } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Home from './components/Home'
import Books from './components/Books'
import Customers from './components/Customers'
import Borrowings from './components/Borrowings'
import BookDetails from './components/BookDetails'
import BookEdit from './components/BookEdit'
import CustomerDetails from './components/CustomerDetails'
import CustomerEdit from './components/CustomerEdit'
import BorrowingDetails from './components/BorrowingDetails'
import BorrowingEdit from './components/BorrowingEdit'
import BookAdd from './components/BookAdd'
import CustomerAdd from './components/CustomerAdd'
import BorrowingAdd from './components/BorrowingAdd'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import UserMenu from './components/UserMenu'
import RoleBasedRender from './components/RoleBasedRender'
import { LanguageProvider } from './contexts/LanguageContext'
import LanguageSelector from './components/LanguageSelector'
import NotFound from './components/NotFound'

function AppContent() {
  const { user } = useAuth();

  return (
    <div>
      <header className="header">
        <LanguageSelector />
        <h1><FormattedMessage id="app.title" /></h1>
        <div className="auth-buttons">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login">
                <FormattedMessage id="auth.login" />
              </Link>
              <Link to="/register">
                <FormattedMessage id="auth.register" />
              </Link>
            </>
          )}
        </div>
      </header>
      <nav className="nav">
        <NavLink to="/">
          <FormattedMessage id="nav.home" />
        </NavLink>
        <NavLink to="/books">
          <FormattedMessage id="nav.books" />
        </NavLink>
        <RoleBasedRender allowedRoles={['user', 'admin']}>
          <NavLink to="/customers">
            <FormattedMessage id="nav.customers" />
          </NavLink>
          <NavLink to="/borrowings">
            <FormattedMessage id="nav.borrowings" />
          </NavLink>
        </RoleBasedRender>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/books/:id/edit" element={<BookEdit />} />
        <Route path="/books/add" element={<BookAdd />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
        <Route path="/customers/:id/edit" element={<CustomerEdit />} />
        <Route path="/customers/add" element={<CustomerAdd />} />
        <Route path="/borrowings" element={<Borrowings />} />
        <Route path="/borrowings/:id" element={<BorrowingDetails />} />
        <Route path="/borrowings/:id/edit" element={<BorrowingEdit />} />
        <Route path="/borrowings/add" element={<BorrowingAdd />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App
