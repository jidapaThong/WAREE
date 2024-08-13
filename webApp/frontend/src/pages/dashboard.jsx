import React from 'react';
import Header from '../components/header.jsx';
import '../css/dashboard.css';

function Dashboard() {
    return (
      <React.Fragment>
        <section>
          <div className='dashboard-container'>
            <div className='header'>
              <Header />
            </div>
            <div className='dashboard-report centered'>
              <iframe title="waterDashboard_Thai" width="1150" height="700" src="https://app.powerbi.com/view?r=eyJrIjoiZjYzMThiNGMtY2ZhMC00OWE5LWI3NTgtZjQwYWQ3M2Y0ZDQwIiwidCI6IjRhNGY3YjUyLTBlMDUtNDQxNS04NDU0LTc2ODliMDBhODdiMiIsImMiOjEwfQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe>
            </div>
          </div>
        </section>
      </React.Fragment> 
    );
}
export default Dashboard;
