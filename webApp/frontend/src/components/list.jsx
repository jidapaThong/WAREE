import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import '../css/list.css';
import DataCard from '../components/dataCard.jsx';
import DownloadButton from './downloadButton.jsx';
import {activeIcon, selectedIcon} from '../icons/marker';


function List() {
  const [selectedOption, setSelectedOption] = useState();
  
  const options = [
    {id:1, text: 'กล้องดูระดับน้ำคลองท่าใหญ่'},
    {id:2, text: 'กล้องดูระดับน้ำคลองหน้าเมือง'},
    {id:3, text: 'กล้องดูระดับน้ำคลองเลียบทางรถไฟ (แยกหมอปาน)'}
  ];

  const initialPosition = [8.426425,99.896187];
  const mapRef = useRef(null); // Reference current map
  const [selectedMarker, setSelectedMarker] = useState(null);
  const markers = [
    { id: 1, position: [8.399956561757051, 99.83347713947296], text: 'กล้องดูระดับน้ำคลองท่าใหญ่', lan: '8.3999565617570511', lon:'99.833477139472961', area:'คลองท่าใหญ่', district:'นคร', subdis:'นคร', province:'นครศรีธรรมราช'},
    { id: 2, position: [8.43438, 99.97097], text: 'กล้องดูระดับน้ำคลองหน้าเมือง',  lan: '8.40611717378089', lon:'99.965548423724144', area:'คลองหน้าเมือง', district:'นคร', subdis:'นคร', province:'นครศรีธรรมราช'},
    { id: 3, position: [8.419171258042145, 99.95445507433921], text: 'กล้องดูระดับน้ำคลองเลียบทางรถไฟ (แยกหมอปาน)', lan: '8.4191712580421445', lon:'99.954455074339208', area:'แยกหมอปาน', district:'นคร', subdis:'นคร', province:'นครศรีธรรมราช'}
  ];

  // Event handler for when an option is selected
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  let previousClickedMarker = null;
  const handleMarkerClick = (marker) => {
    // If a marker was previously clicked, clear its event and reset the icon
    if (previousClickedMarker) {
      previousClickedMarker.off('click', handleMarkerClick);
      previousClickedMarker.setIcon(activeIcon); // Reset the icon to the activeIcon
    }

    // Change the icon to selectedIcon for the clicked marker
    marker.setIcon(selectedIcon);

    // Set the current marker as the previously clicked marker
    previousClickedMarker = marker;

    // Add the 'click' event listener back to the marker for the next click
    marker.on('click', () => handleMarkerClick(marker));
  };

  //Dispay the plain map: the first time the map component is loaded
  useEffect(() => {
      mapRef.current = L.map('map').setView(initialPosition, 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      markers.forEach((marker) => {
        const markerLayer = L.marker(marker.position, {
          icon: activeIcon,
          title: marker.text
        }).addTo(mapRef.current);
        markerLayer.bindPopup(`<h3>${marker.text}</h3><p>ละติจูด: ${marker.lan}</p><p>ลองจิจูด: ${marker.lon}</p><p>พื้นที่: ${marker.area}</p><p>ตำบล: ${marker.district}, อำเภอ: ${marker.subdis}</p><p>จังหวัด: ${marker.province}</p>`);
        // // Add a click event handler to the marker
        markerLayer.on('click', () => handleMarkerClick(markerLayer));
      });
    return () => {
        mapRef.current.remove();
    };
  }, [mapRef, markers]);

  useEffect(() => {
    const map = mapRef.current;
    if (selectedOption  && map) {
      // Find the selected marker based on the selectedOption
     const selectedMarker = markers.find((marker) => marker.id === parseInt(selectedOption));
      if (selectedMarker) {
        // Fly to the selected marker's position when it changes
        map.flyTo(selectedMarker.position, 18);
      }
    }
  }, [selectedOption , markers, selectedMarker]);

  return (
      <div className='data-container'>
        <div className='option centered'> 
          <select className='form-select' onChange={handleOptionChange} value={selectedOption} style={{ fontSize: '20px' }}>
            <option value=''>เลือกตำแหน่งกล้องวงจรปิด</option>
            {options.map(({text, id}) => (
              <option value={id} key={id}>
                {text}
              </option>
            ))}
          </select>
        </div>

        <div className='map centered'>
          <div id="map" style={{ width: '80%', height: '90%'}} />
        </div>
        <div className='downloadButton centered'>
          <DownloadButton selectedCamera = {selectedOption}/>
        </div>
        <div className='datacard centered'>
        <DataCard selectedCamera = {selectedOption} options = {options}/>
        </div>
      </div>
  );
}
export default List;
