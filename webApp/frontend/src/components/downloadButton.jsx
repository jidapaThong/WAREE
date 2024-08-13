import React, { useState, useEffect } from 'react';

const DownloadButton = ({ selectedCamera }) => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    // Fetch the latest years (adjust as needed)
    const currentYear = new Date().getFullYear();
    const latestYears = Array.from({ length: 2 }, (_, index) => currentYear - index);
    setYears(latestYears);
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleDownload = async () => {
    if (selectedYear && selectedCamera) {
      console.log(`Downloading data for year ${selectedYear} from cctvID ${selectedCamera}`);
      try {
        const response = await fetch(`http://27.254.145.207:8000/download/${selectedCamera}/${selectedYear}`);
        if (!response.ok) {
          throw new Error("File download failed");
        }
        const blob = await response.blob();
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            const filename = `waterLevelData_cctvId${selectedCamera}_year${selectedYear}.csv`;
            downloadLink.download = filename;
            downloadLink.click();
      } catch (error) {
        console.error('Error downloading data:', error);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '20px', marginBottom: '10px' }}>ดาวน์โหลดข้อมูลระดับน้ำ:</p>
      {/* <select id="DownloadButton" onChange={handleYearChange} value={selectedYear} style={{ fontSize: '20px', width: '110px',textAlign: 'center' }}> */}
      <select id="DownloadButton" onChange={handleYearChange} value={selectedYear} style={{ fontSize: '20px', width: '110px',textAlign: 'center',height: '40px',borderRadius:'1em', border: '3px solid #7BB1EF' }}>
        <option value="" disabled>ปี</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {/* <button onClick={handleDownload} disabled={!selectedCamera || !selectedYear} style={{ marginLeft: '100px', fontSize: '20px',width: '130px',height: '40px',borderRadius:'1em'}}> */}
      <button onClick={handleDownload} disabled={!selectedCamera || !selectedYear} style={{ marginLeft: '100px', fontSize: '20px',width: '130px',height: '50px',borderRadius:'1em', border:'transparent', backgroundColor: selectedCamera && selectedYear ? '#B2DAFF' : 'initial'}}>
        ดาวน์โหลด
      </button>
    </div>
  );
};
export default DownloadButton;


// const handleDownload = async () => {
  //   // try {
  //   //   const response = await fetch('/api/download'); // Assuming you have an Express server to handle the download request
  //   //   const blob = await response.blob();
  //   //   const url = window.URL.createObjectURL(blob);
  //   //   const a = document.createElement('a');
  //   //   a.href = url;
  //   //   a.download = 'bigquery_data.csv';
  //   //   document.body.appendChild(a);
  //   //   a.click();
  //   //   document.body.removeChild(a);
  //   // } catch (error) {
  //   //   console.error('Error downloading data:', error);
  //   // }
  // };