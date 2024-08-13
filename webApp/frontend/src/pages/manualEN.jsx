import React from 'react';
import HeaderEnglish from '../components/headerEN.jsx';
import '../css/dashboard.css';

function ManualEnglish() {
    return (
      <React.Fragment>
        <section>
          <div className='container'>
            <div className='header'>
            <HeaderEnglish />
            </div>
            <div className='manual'>
              <p style={{ marginBottom: '20px' }}>The Waree Website User Manual</p>
              <iframe width="1200" height="550" src="https://www.youtube.com/embed/u_YjxSJ1Jos?si=5DwNA787Lu9pwG2k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
          </div>
        </section>
      </React.Fragment>    
    );
  }
  
export default ManualEnglish;