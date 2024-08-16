// Postman Test Script

// 1. Test getLastest API: 
// This test verifies that the getLastest API correctly returns the latest water level records for each CCTV ID.

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has latest records", function () {
    let jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array').that.is.not.empty;

    jsonData.forEach(function (record) {
        pm.expect(record).to.have.property('cctvID');
        pm.expect(record).to.have.property('dateTime');
        pm.expect(record).to.have.property('waterLevel');
        pm.expect(record).to.have.property('zone');
    });
});

// 2. Test getAll API: 
// This test ensures that the getAll API returns all water level records without any issues.
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has all records", function () {
    let jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array').that.is.not.empty;

    jsonData.forEach(function (record) {
        pm.expect(record).to.have.property('cctvID');
        pm.expect(record).to.have.property('dateTime');
        pm.expect(record).to.have.property('waterLevel');
        pm.expect(record).to.have.property('zone');
    });
});

// 3. Test download_bigquery_data API: 
// This test checks if the download_bigquery_data API correctly returns the CSV content for the specified CCTV ID and year.
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is a valid CSV", function () {
    let csvContent = pm.response.text();
    pm.expect(csvContent).to.be.a('string').that.is.not.empty;

    // Basic check for CSV content
    let lines = csvContent.split('\n');
    pm.expect(lines).to.have.length.greaterThan(1); // At least a header and one row
    let headers = lines[0].split(',');
    pm.expect(headers).to.include.members(["cctvID", "cameraName_Eng", "dateTime", "waterLevel", "zone"]);
});

pm.test("Response contains correct data", function () {
    let csvContent = pm.response.text();
    let lines = csvContent.split('\n');
    let dataLines = lines.slice(1); // Exclude header

    dataLines.forEach(function (line) {
        let columns = line.split(',');
        pm.expect(columns).to.have.length(5);
    });
});
