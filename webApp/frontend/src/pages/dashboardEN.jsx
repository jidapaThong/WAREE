import React from 'react';
import HeaderEnglish from '../components/headerEN.jsx';
import '../css/dashboard.css';

function DashboardEnglish() {
    return (
      <React.Fragment>
        <section>
          <div className='dashboard-container'>
            <div className='header'>
              <HeaderEnglish />
            </div>
            <div className='dashboard-report centered'>
                <iframe title="waterDashboard_eng" width="1150" height="700" src="https://app.powerbi.com/view?r=eyJrIjoiZjY1M2U0YzItYTgyNi00OTAzLTgyNWQtNmUyZjQxNjIwOGU2IiwidCI6IjRhNGY3YjUyLTBlMDUtNDQxNS04NDU0LTc2ODliMDBhODdiMiIsImMiOjEwfQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe>
            </div>
          </div>
        </section>
      </React.Fragment> 
    );
}
export default DashboardEnglish;
