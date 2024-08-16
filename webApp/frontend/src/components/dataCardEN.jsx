import React, { Component, useEffect, useRef, useState } from 'react';
import '../css/dataCard.css';

import greenStatusIcon from "../icons/greenStatus.png";
import redStatusIcon from "../icons/redStatus.png";
import yellowStatusIcon from "../icons/yellowStatus.png";
import greenTextIcon from "../icons/greenTextEng.png";
import redTextIcon from "../icons/redTextEng.png";
import yellowTextIcon from "../icons/yellowTextEng.png";

class DataCardEnglish extends Component {
    constructor() {
      super();
      this.state = {
        data: [],
      };
    }

    componentDidMount() {
        this.fetchData();
        this.interval = setInterval(this.fetchData, 30000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    fetchData = () => {
        fetch('http://27.254.145.207:8000/waterLevel/latest')
          .then((response) => response.json())
          .then((data) => {
            this.setState({ data });
          });
         
    };
        
    formatDateTime(dateTime) {
      const utcDateTime = new Date(dateTime); 
      const localDateTime = utcDateTime.toLocaleString('en-GB', { timeZone: 'UTC'});
      const [date, time] = localDateTime.split(', '); // Split into date and time parts
      const formattedDateTime = `${date} at ${time}`; // Concatenate date and time
      return formattedDateTime;
  }
  
    render() {
      const { selectedCamera, options } = this.props;
      const { data } = this.state;
      const selectedOption = options.find(option => option.id === parseInt(selectedCamera));

      return (
        <section>
          <div className='top-card-name'><h1>{selectedOption ? selectedOption.text : "Select CCTV camera location"}</h1></div>
          <div className='separator' /><div>
          {data.map((item) => (
              item.cctvID === parseInt(selectedCamera) && (
              <div className='card-data-container' key={item.cctvID}>  
                  <div>
                      {item.zone === 0 && (
                          <div className='card-data'>
                          <p>Water Level Zone</p>
                          <img src={greenStatusIcon} alt='Green Status' className='statusIcon'/> 
                          <img src={greenTextIcon} alt='Green Status Text' className='statusTextIcon'/> 
                          </div>
                      )}
                      {item.zone === 1 && (
                          <div className='card-data'>
                          <p>Water Level Zone</p>
                          <img src={yellowStatusIcon} alt='Yellow Status' className='statusIcon'/>
                          <img src={yellowTextIcon} alt='Yellow Status Text' className='statusTextIcon'/> 
                          </div>
                      )}
                      {item.zone === 2 && (
                          <div className='card-data'>
                          <p>Water Level Zone</p>
                          <img src={redStatusIcon} alt='Red Status' className='statusIcon'/>
                          <img src={redTextIcon} alt='Red Status Text' className='statusTextIcon'/> 
                          </div>
                      )}
                      <div className='separator' /></div>
                      {item.cctvID === 1 && (
                        <div>
                          <p>Water Level</p>
                          <p style={{marginTop: '5px', fontSize: '35px'}}>{item.waterLevel}</p>
                          <p style={{marginTop: '10px', marginBottom: '5px'}}>Water Level Height</p>
                          {item.waterLevel === 1 && (
                            <p style={{fontSize: '30px'}}>250 - 300 centimeter</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p style={{fontSize: '30px'}}>300 - 350 centimeter</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p style={{fontSize: '30px'}}>350 - 400 centimeter</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p style={{fontSize: '30px'}}>400 - 450 centimeter</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p style={{fontSize: '30px'}}>450 - 500 centimeter</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p style={{fontSize: '30px'}}>500 - 550 centimeter</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p style={{fontSize: '30px'}}>550 - 600 centimeter</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p style={{fontSize: '30px'}}>600 - 650 centimeter</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p style={{fontSize: '30px'}}>650 - 700 centimeter</p>
                          )}
                          {item.waterLevel === 10 && (
                            <p style={{fontSize: '30px'}}>700 centimeter up</p>
                          )}
                        </div>
                      )}
                      {item.cctvID === 2 && (
                        <div>
                          <p>Water Level</p>
                          <p style={{marginTop: '5px', fontSize: '35px'}}>{item.waterLevel}</p>
                          <p style={{marginTop: '10px', marginBottom: '5px'}}>Water Level Height</p>
                          {item.waterLevel === 1 && (
                            <p style={{fontSize: '30px'}}>150 - 170 centimeter</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p style={{fontSize: '30px'}}>170 - 180 centimeter</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p style={{fontSize: '30px'}}>180 - 200 centimeter</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p style={{fontSize: '30px'}}>200 - 220 centimeter</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p style={{fontSize: '30px'}}>220 - 240 centimeter</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p style={{fontSize: '30px'}}>240 - 260 centimeter</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p style={{fontSize: '30px'}}>260 - 280 centimeter</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p style={{fontSize: '30px'}}>280 - 300 centimeter</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p style={{fontSize: '30px'}}>300 - 320 centimeter</p>
                          )}
                          {item.waterLevel === 10 && (
                            <p style={{fontSize: '30px'}}>320 - 340 centimeter</p>
                          )}
                          {item.waterLevel === 11 && (
                            <p style={{fontSize: '30px'}}>340 - 360 centimeter</p>
                          )}
                          {item.waterLevel === 12 && (
                            <p style={{fontSize: '30px'}}>360 - 380 centimeter</p>
                          )}
                          {item.waterLevel === 13 && (
                            <p style={{fontSize: '30px'}}>380 - 400 centimeter</p>
                          )}
                          {item.waterLevel === 14 && (
                            <p style={{fontSize: '30px'}}>400 centimeter up</p>
                          )}
                        </div>
                      )} 
                      {item.cctvID === 3 && (
                        <div>
                          <p>Water Level</p>
                          <p style={{marginTop: '5px', fontSize: '35px'}}>{item.waterLevel}</p>
                          <p style={{marginTop: '10px', marginBottom: '5px'}}>Water Level Height</p>
                          {item.waterLevel === 1 && (
                            <p style={{fontSize: '30px'}}>80 - 100 centimeter</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p style={{fontSize: '30px'}}>100 - 120 centimeter</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p style={{fontSize: '30px'}}>120 - 140 centimeter</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p style={{fontSize: '30px'}}>140 - 150 centimeter</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p style={{fontSize: '30px'}}>150 - 200 centimeter</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p style={{fontSize: '30px'}}>200 - 240 centimeter</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p style={{fontSize: '30px'}}>240 - 300 centimeter</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p style={{fontSize: '30px'}}>300 - 400 centimeter</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p style={{fontSize: '30px'}}>400 centimeter up</p>
                          )}
                        </div>
                      )}
                      <p style={{marginTop: '20px', fontSize: '16px'}}>Last updated on {this.formatDateTime(item.dateTime)}</p>                    
              </div>
              )
          ))}
        </div>
        </section>
      );
    }
  }
export default DataCardEnglish;
