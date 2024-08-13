import React from 'react';
import '../css/header.css';
import { Link } from 'react-router-dom'
import depaLogo from '../icons/depaLogo.png';
import thLogo from '../icons/th.png';
import enLogo from '../icons/en.png';

function HeaderEnglish() {
    return (
        <nav>
            <Link to ='/' className='title'>
                <img src ={depaLogo} style={{width: '40px', height: '34px'}}/>                
            </Link>
            <ul>
                <li>
                    <a href='/en'>Home</a>
                </li> 
                <li>
                    <a href='/en/dashboard'>Dashboard</a>
                </li>
                <li>
                    <a href='/en/manual'>Manual</a>
                </li>
                <li>
                    <a href=''><img src ={enLogo} width='20' height='20'/>  EN ▾</a>
                    <ul className='dropdown'>
                        <li><a href='/'><img src ={thLogo} width='20' height='20'/>  TH</a></li>
                        {/* <li><a href='/en'><img src ={enLogo} width='20' height='20'/>  EN</a></li> */}
                    </ul>
                    
                </li>  
            </ul>
        </nav>
    );
  }
export default HeaderEnglish;