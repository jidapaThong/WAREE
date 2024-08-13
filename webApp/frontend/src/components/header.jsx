import React from 'react';
import '../css/header.css';
import { Link } from 'react-router-dom'
import depaLogo from '../icons/depaLogo.png';
import thLogo from '../icons/th.png';
import enLogo from '../icons/en.png';

function Header() {
    return (
        <nav>
            <Link to ='/' className='title'>
                <img src ={depaLogo} style={{width: '40px', height: '34px'}}/>
                
            </Link>
            <ul>
                <li>
                    <a href='/'>หน้าหลัก</a>
                </li> 
                <li>
                    <a href='/dashboard'>แดชบอร์ด</a>
                </li>
                <li>
                    <a href='/manual'>คู่มือ</a>
                </li>
                <li>
                    <a href=''><img src ={thLogo} width='20' height='20'/>  TH ▾</a>
                    <ul className='dropdown'>
                        {/* <li><a href='/'><img src ={thLogo} width='20' height='20'/>  TH</a></li> */}
                        <li><a href='/en'><img src ={enLogo} width='20' height='20'/>  EN</a></li>
                    </ul>
                    
                </li>  
            </ul>
        </nav>
    );
  }
  
export default Header;

// <a href=''>ภาษา ▾</a>
//                     <ul className='dropdown'>
//                         <li><a href='/'><img src ={thLogo} width='20' height='20'/>  TH</a></li>
//                         <li><a href='/en'><img src ={enLogo} width='20' height='20'/>  EN</a></li>
//                     </ul>