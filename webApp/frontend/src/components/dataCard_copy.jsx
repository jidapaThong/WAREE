import React, { Component, useEffect, useRef, useState } from 'react';
// import axios from 'axios';
import '../css/dataCard.css';
//import { Link } from "react-router-dom";
//import {greenStatusIcon, redStatusIcon, yellowStatusIcon} from '../icons/marker.jsx';

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
        // isLoading: false,
      };
    }

    componentDidMount() {
        // Fetch data initially
        this.fetchData();
        // Set up a periodic data update every 1 seconds (you can adjust the interval)
        this.interval = setInterval(this.fetchData, 30000);
    }
    componentWillUnmount() {
        // Clear the interval when the component is unmounted to prevent memory leaks
        clearInterval(this.interval);
    }
    // fetchData = () => {
    //     fetch('http://127.0.0.1:8000/waterLevel/latest')
    //       .then((response) => response.json())
    //       .then((data) => {
    //         this.setState({ data });
    //       })
    //       .catch((error) => {
    //         console.error('Error fetching data:', error);
    //       });
    // };


    fetchData = () => {
      // this.setState({isLoading: true});

        fetch('http://27.254.145.207:8000/waterLevel/latest')
          .then((response) => response.json())
          .then((data) => {
            // this.setState({ data , isLoading: false });
            this.setState({ data });
          });
         
    };
    
  
    formatDateTime(dateTime) {
      const formattedDate = new Date(dateTime).toLocaleString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'});
      const formattedTime = new Date(dateTime).toLocaleString('en-GB', {hour: '2-digit',minute: '2-digit',second: '2-digit'});
      const formattedDateTime = `${formattedDate} เวลา ${formattedTime}`;
  
     
      return formattedDateTime;
    }
  
    render() {
      const { selectedCamera, options } = this.props;
      // const { data, isLoading } = this.state;
      const { data } = this.state;
      const selectedOption = options.find(option => option.id === parseInt(selectedCamera));

      return (
        // <section className='card'>
        <section className='card'>
          <div className='top-card-name'><h1>{selectedOption ? selectedOption.text : "เลือกตำแหน่งกล้องวงจรปิด"}</h1></div>
          <div className='separator' /><div>
          {data.map((item) => (
              item.cctvID === parseInt(selectedCamera) && (
              <div className='card-data-container' key={item.cctvID}>  
                  <div>
                      {item.zone === 0 && (
                          <div className='card-data'>
                          <p>สถานะระดับน้ำในคลอง</p>
                          <img src={greenStatusIcon} alt='Green Status' className='statusIcon'/> 
                          <img src={greenTextIcon} alt='Green Status Text' className='statusTextIcon'/> 
                          {/* <p>สถานะ: ปกติ</p> */}
                          </div>
                      )}
                      {item.zone === 1 && (
                          <div className='card-data'>
                          <p>สถานะระดับน้ำในคลอง</p>
                          <img src={yellowStatusIcon} alt='Yellow Status' className='statusIcon'/>
                          <img src={yellowTextIcon} alt='Yellow Status Text' className='statusTextIcon'/> 
                          {/* <p>สถานะ: เฝ้าระวัง</p> */}
                          </div>
                      )}
                      {item.zone === 2 && (
                          <div className='card-data'>
                          <p>สถานะระดับน้ำในคลอง</p>
                          <img src={redStatusIcon} alt='Red Status' className='statusIcon'/>
                          <img src={redTextIcon} alt='Red Status Text' className='statusTextIcon'/> 
                          {/* <p>สถานะ: วิกฤต</p> */}
                          </div>
                      )}
                      <div className='separator' /></div>
                      {item.cctvID === 1 && (
                        <div>
                          <p>ระดับน้ำ {item.waterLevel}</p>
                          {item.waterLevel === 1 && (
                            <p>ความสูงของระดับน้ำ 250 - 300 cm</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p>ความสูงของระดับน้ำ 300 - 350 cm</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p>ความสูงของระดับน้ำ 350 - 400 cm</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p>ความสูงของระดับน้ำ 400 - 450 cm</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p>ความสูงของระดับน้ำ 450 - 500 cm</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p>ความสูงของระดับน้ำ 500 - 550 cm</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p>ความสูงของระดับน้ำ 550 - 600 cm</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p>ความสูงของระดับน้ำ 600 - 650 cm</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p>ความสูงของระดับน้ำ 650 - 700 cm</p>
                          )}
                          {item.waterLevel === 10 && (
                            <p>ความสูงของระดับน้ำ 700 cm ขึ้นไป</p>
                          )}
                        </div>
                      )}
                      {item.cctvID === 2 && (
                        <div>
                          <p>ระดับน้ำ {item.waterLevel}</p>
                          {item.waterLevel === 1 && (
                            <p>ความสูงของระดับน้ำ 150 - 170 cm</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p>ความสูงของระดับน้ำ 170 - 180 cm</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p>ความสูงของระดับน้ำ 180 - 200 cm</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p>ความสูงของระดับน้ำ 200 - 220 cm</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p>ความสูงของระดับน้ำ 220 - 240 cm</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p>ความสูงของระดับน้ำ 240 - 260 cm</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p>ความสูงของระดับน้ำ 260 - 280 cm</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p>ความสูงของระดับน้ำ 280 - 300 cm</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p>ความสูงของระดับน้ำ 300 - 320 cm</p>
                          )}
                          {item.waterLevel === 10 && (
                            <p>ความสูงของระดับน้ำ 320 - 340 cm</p>
                          )}
                          {item.waterLevel === 11 && (
                            <p>ความสูงของระดับน้ำ 340 - 360 cm</p>
                          )}
                          {item.waterLevel === 12 && (
                            <p>ความสูงของระดับน้ำ 360 - 380 cm</p>
                          )}
                          {item.waterLevel === 13 && (
                            <p>ความสูงของระดับน้ำ 380 - 400 cm</p>
                          )}
                          {item.waterLevel === 14 && (
                            <p>ความสูงของระดับน้ำ 400 cm ขึ้นไป</p>
                          )}
                        </div>
                      )} 
                      {item.cctvID === 3 && (
                        <div>
                          <p>ระดับน้ำ {item.waterLevel}</p>
                          {item.waterLevel === 1 && (
                            <p>ความสูงของระดับน้ำ 80 - 100 cm</p>
                          )}
                          {item.waterLevel === 2 && (
                            <p>ความสูงของระดับน้ำ 100 - 120 cm</p>
                          )}
                          {item.waterLevel === 3 && (
                            <p>ความสูงของระดับน้ำ 120 - 140 cm</p>
                          )}
                          {item.waterLevel === 4 && (
                            <p>ความสูงของระดับน้ำ 140 - 150 cm</p>
                          )}
                          {item.waterLevel === 5 && (
                            <p>ความสูงของระดับน้ำ 150 - 200 cm</p>
                          )}
                          {item.waterLevel === 6 && (
                            <p>ความสูงของระดับน้ำ 200 - 240 cm</p>
                          )}
                          {item.waterLevel === 7 && (
                            <p>ความสูงของระดับน้ำ 240 - 300 cm</p>
                          )}
                          {item.waterLevel === 8 && (
                            <p>ความสูงของระดับน้ำ 300 - 400 cm</p>
                          )}
                          {item.waterLevel === 9 && (
                            <p>ความสูงของระดับน้ำ 400 cm ขึ้นไป</p>
                          )}
                        </div>
                      )}  
                      <p>อัพเดทล่าสุด {this.formatDateTime(item.dateTime)}</p>
                      {/* <p>อัพเดทล่าสุด {item.dateTime}</p> */}
                  
              </div>
              )
          ))}
        </div>
        </section>
      );
    }
  }
export default DataCard;

// const formattedDateTime = new Date(dateTime).toLocaleString('en-GB', {
    //   day: '2-digit',
    //   month: '2-digit',
    //   year: 'numeric'});
 
    
    //  function formatDateTime(dateTime) {
    //   const formattedDateTime = new Date(dateTime).toLocaleString('en-GB', {
    //     day: 'numeric',
    //     month: 'numeric',
    //     year: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     second: 'numeric',
    //   });
    //   return formattedDateTime;
    // }
  
    
    // function formatDateTime(dateTime) {
    //   const formattedDateTime = new Date(dateTime).toLocaleString('en-GB', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit',
    //     // hour12: false,
    //     // timeZone: 'UTC',
    //   });
    //   return formattedDateTime;
    // }
    
  

    



// new version
//  {data.map((item) => (
//     item.cctvID === parseInt(selectedCamera) && (
//       <div key={item.cctvID}>
//         <p>CCTV ID: {item.cctvID}</p>
//         <p>Water Level: {item.waterLevel}</p>
//       </div>
//     )
//     ))}