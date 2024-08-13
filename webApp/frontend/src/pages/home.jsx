import React from 'react';
import Header from '../components/header.jsx';
import List from '../components/list.jsx';
import '../css/home.css';

function Home() {
    return (
      <React.Fragment>
        <section>
          <div className='container'>
            <div className='header'>
            <Header />
            </div>
            <div className='list'>
            <List />
            </div>
          </div>
        </section>
      </React.Fragment>    
    );
  }
  
export default Home;