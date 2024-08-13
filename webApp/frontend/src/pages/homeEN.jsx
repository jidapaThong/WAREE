import React from 'react';
import HeaderEnglish from '../components/headerEN.jsx';
import ListEnglish from '../components/listEN.jsx';
import '../css/home.css';

function HomeEnglish() {
    return (
      <React.Fragment>
        <section>
          <div className='container'>
            <div className='header'>
              <HeaderEnglish />
            </div>
            <div className='list'>
              <ListEnglish />
            </div>
          </div>
        </section>
      </React.Fragment>    
    );
  }
  
export default HomeEnglish;