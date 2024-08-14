import React, { Component, useEffect, useRef, useState } from 'react';
import '../css/dataCard.css';
import greenStatusIcon from "../icons/greenStatus.png";
import redStatusIcon from "../icons/redStatus.png";
import yellowStatusIcon from "../icons/yellowStatus.png";
import greenTextIcon from "../icons/greenText.png";
import redTextIcon from "../icons/redText.png";
import yellowTextIcon from "../icons/yellowText.png";
import loadingIcon from "../icons/loading.gif";

class DataCard extends Component {
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
      const formattedDateTime = `${date} เวลา ${time}`; // Concatenate date and time
      return formattedDateTime;
  }
  
    render() {
      const { selectedCamera, options } = this.props;
      const { data } = this.state;
      const selectedOption = options.find(option => option.id === parseInt(selectedCamera));

      return (
        <section>
          <div className='top-card-name'><h1>{selectedOption ? selectedOption.text : "เลือกตำแหน่งกล้องวงจรปิด"}</h1></div>
          <div className='separator' /><div>
          {data.map((item) => (
              item.cctvID === parseInt(selectedCamera) && (
              <div className='card-data-container' key={item.cctvID}>  
                  <div>
                      {item.zone === 0 && (
                          <div className='card-data'>
                          <p>สถานะระดับน้ำ</p>
                          <img src={greenStatusIcon} alt='Green Status' className='statusIcon'/> 
                          <img src={greenTextIcon} alt='Green Status Text' className='statusTextIcon'/> 
                          {/* <p>สถานะ: ปกติ</p> */}
                          </div>
                      )}
                      {item.zone === 1 && (
                          <div className='card-data'>
                          <p>สถานะระดับน้ำ</p>
                          <img src={yellowStatusIcon} alt='Yellow Status' className='statusIcon'/>
                          <img src={yellowTextIcon} alt='Yellow Status Text' className='statusTextIcon'/> 
                          {/* <p>สถานะ: เฝ้าระวัง</p> */}
                          </div>
                      )}
                      {item.zone === 2 && (
                          <div className='card-data'>
                          <p>สถานะระดับน้ำ</p>
                          <img src={redStatusIcon} alt='Red Status' className='statusIcon'/>
                          <img src={redTextIcon} alt='Red Status Text' className='statusTextIcon'/> 
                          {/* <p>สถานะ: วิกฤต</p> */}
                          </div>
                      )}
                      <div className='separator' /></div>
                      {item.cctvID === 1 && (
                        <div>
                          <p>ระดับน้ำ</p>
                          <p style={{marginTop: '5px', fontSize: '35px'}}>{item.waterLevel}</p>
                          <p style={{marginTop: '10px', marginBottom: '5px'}}>ความสูงระดับน้ำ</p>
                          {item.waterLevel === 1 && (
                            <p style={{fontSize: '30px'}}>250 - 300 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p style={{fontSize: '30px'}}>300 - 350 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p style={{fontSize: '30px'}}>350 - 400 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p style={{fontSize: '30px'}}>400 - 450 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p style={{fontSize: '30px'}}>450 - 500 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p style={{fontSize: '30px'}}>500 - 550 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p style={{fontSize: '30px'}}>550 - 600 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p style={{fontSize: '30px'}}>600 - 650 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p style={{fontSize: '30px'}}>650 - 700 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 10 && (
                            <p style={{fontSize: '30px'}}>700 เซนติเมตร ขึ้นไป</p>
                          )}
                        </div>
                      )}
                      {item.cctvID === 2 && (
                        <div>
                          <p>ระดับน้ำ</p>
                          <p style={{marginTop: '5px', fontSize: '35px'}}>{item.waterLevel}</p>
                          <p style={{marginTop: '10px', marginBottom: '5px'}}>ความสูงระดับน้ำ</p>
                          {item.waterLevel === 1 && (
                            <p style={{fontSize: '30px'}}>150 - 170 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p style={{fontSize: '30px'}}>170 - 180 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p style={{fontSize: '30px'}}>180 - 200 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p style={{fontSize: '30px'}}>200 - 220 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p style={{fontSize: '30px'}}>220 - 240 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p style={{fontSize: '30px'}}>240 - 260 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p style={{fontSize: '30px'}}>260 - 280 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p style={{fontSize: '30px'}}>280 - 300 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p style={{fontSize: '30px'}}>300 - 320 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 10 && (
                            <p style={{fontSize: '30px'}}>320 - 340 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 11 && (
                            <p style={{fontSize: '30px'}}>340 - 360 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 12 && (
                            <p style={{fontSize: '30px'}}>360 - 380 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 13 && (
                            <p style={{fontSize: '30px'}}>380 - 400 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 14 && (
                            <p style={{fontSize: '30px'}}>400 เซนติเมตร ขึ้นไป</p>
                          )}
                        </div>
                      )} 
                      {item.cctvID === 3 && (
                        <div>
                          <p>ระดับน้ำ</p>
                          <p style={{marginTop: '5px', fontSize: '35px'}}>{item.waterLevel}</p>
                          <p style={{marginTop: '10px', marginBottom: '5px'}}>ความสูงระดับน้ำ</p>
                          {item.waterLevel === 1 && (
                            <p style={{fontSize: '30px'}}>80 - 100 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p style={{fontSize: '30px'}}>100 - 120 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p style={{fontSize: '30px'}}>120 - 140 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p style={{fontSize: '30px'}}>140 - 150 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p style={{fontSize: '30px'}}>150 - 200 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p style={{fontSize: '30px'}}>200 - 240 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p style={{fontSize: '30px'}}>240 - 300 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p style={{fontSize: '30px'}}>300 - 400 เซนติเมตร</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p style={{fontSize: '30px'}}>400 เซนติเมตร ขึ้นไป</p>
                          )}
                        </div>
                      )}
                      <p style={{marginTop: '20px', fontSize: '16px'}}>อัพเดทล่าสุด วันที่ {this.formatDateTime(item.dateTime)} น.</p>  
              </div>
              )
          ))}
        </div>
        </section>
      );
    }
  }
export default DataCard;
