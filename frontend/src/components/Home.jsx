import React from 'react'
import './Home.css'
import { FormattedMessage } from 'react-intl';

function Home() {
  return (
    <div className="home container">
      <h2><FormattedMessage id="home.welcome" /></h2>
      <strong><FormattedMessage id="home.features" /></strong>
      <ul>
        <li><FormattedMessage id="home.feature.books" /></li>
        <li><FormattedMessage id="home.feature.customers" /></li>
        <li><FormattedMessage id="home.feature.borrowings" /></li>
      </ul>
    </div>
  )
}

export default Home 