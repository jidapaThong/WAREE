import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import '../css/list.css';
import DataCardEnglish from '../components/dataCardEN.jsx';
import DownloadButtonEnglish from './downloadButtonEN.jsx';
import {activeIcon, selectedIcon} from '../icons/marker';

function ListEnglish() {
  const [selectedOption, setSelectedOption] = useState();
  
  const options = [
    {id:1, text: 'Tha Yai canal'},
    {id:2, text: 'Na Muang canal'},
    {id:3, text: 'Liap Thang Rot Fai canal'}
  ];
  
  const initialPosition = [8.426425,99.896187];
  const mapRef = useRef(null); // Reference current map
  const [selectedMarker, setSelectedMarker] = useState(null);
  const markers = [
    { id: 1, position: [8.399956561757051, 99.83347713947296], text: 'Tha Yai canal', lan: '8.3999565617570511', lon:'99.833477139472961', area:'Tha Yai canal', district:'Nakhon', subdis:'Nakhon', province:'Nakhon Si Thammarat'},
    { id: 2, position: [8.43438, 99.97097], text: 'Na Muang canal',  lan: '8.40611717378089', lon:'99.965548423724144', area:'Na Muang canal', district:'Nakhon', subdis:'Nakhon', province:'Nakhon Si Thammarat'},
    { id: 3, position: [8.419171258042145, 99.95445507433921], text: 'Liap Thang Rot Fai canal', lan: '8.4191712580421445', lon:'99.954455074339208', area:'Mor Pan Intersection', district:'Nakhon', subdis:'Nakhon', province:'Nakhon Si Thammarat'}
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
        markerLayer.bindPopup(`<h3>${marker.text}</h3><p>Latitude: ${marker.lan}</p><p>Longitude: ${marker.lon}</p><p>Area: ${marker.area}</p><p>Subdistrict: ${marker.district}, District: ${marker.subdis}</p><p>Province: ${marker.province}</p>`);
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
            <option value=''>Select CCTV camera location</option>
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
          <DownloadButtonEnglish selectedCamera = {selectedOption}/>
        </div>
        
        <div className='datacard centered'>
        <DataCardEnglish selectedCamera = {selectedOption} options = {options}/>
        </div>
        
      </div>
  );
}
export default ListEnglish;
