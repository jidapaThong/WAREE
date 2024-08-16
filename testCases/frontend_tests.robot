*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://27.254.145.207/  
${BROWSER}    Chrome
${CAMERA_1}    Camera 1
${CAMERA_2}    Camera 2
${CAMERA_3}    Camera 3

*** Test Cases ***

Open Application And Verify Title
    [Documentation]    Open the web application and verify the title.
    Open Browser    ${URL}    ${BROWSER}
    Title Should Be    "WAREE" 
    Maximize Browser Window

Select Camera 1 And Verify Data
    [Documentation]    Select Camera 1 and verify that the correct data is displayed.
    Click Element    xpath=//h1[text()="${CAMERA_1}"]
    Page Should Contain Element    xpath=//p[contains(text(), 'ระดับน้ำ')]
    Page Should Contain Element    xpath=//img[@alt="Green Status"]
    Page Should Contain Element    xpath=//p[contains(text(), '250 - 300 เซนติเมตร')]

Select Camera 2 And Verify Data
    [Documentation]    Select Camera 2 and verify that the correct data is displayed.
    Click Element    xpath=//h1[text()="${CAMERA_2}"]
    Page Should Contain Element    xpath=//p[contains(text(), 'ระดับน้ำ')]
    Page Should Contain Element    xpath=//img[@alt="Yellow Status"]
    Page Should Contain Element    xpath=//p[contains(text(), '170 - 180 เซนติเมตร')]

Select Camera 3 And Verify Data
    [Documentation]    Select Camera 3 and verify that the correct data is displayed.
    Click Element    xpath=//h1[text()="${CAMERA_3}"]
    Page Should Contain Element    xpath=//p[contains(text(), 'ระดับน้ำ')]
    Page Should Contain Element    xpath=//img[@alt="Red Status"]
    Page Should Contain Element    xpath=//p[contains(text(), '300 - 400 เซนติเมตร')]

Close Application
    [Documentation]    Close the web application.
    Close Browser
