import React from 'react';
import Header from '../components/header.jsx';
import '../css/dashboard.css';

function Manual() {
    return (
      <React.Fragment>
        <section>
          <div className='container'>
            <div className='header'>
            <Header />
            </div>
            <div className='manual'>
              <p style={{ marginBottom: '20px' }}>คู่มือการใช้งานเว็บไซต์วารี</p>
              <iframe width="1200" height="550" src="https://www.youtube.com/embed/wWZOSK8hJpQ?si=kyEWup4rxv4f7CWV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
          </div>
        </section>
      </React.Fragment>    
    );
  }
export default Manual;