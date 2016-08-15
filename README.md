
## Quick Data entry App for Tracker capture 

GSoC project to provide a quick data entry for tracker capture for DHIS2.

**Description**

The DHIS2 Tracker is a module for tracking entities across time and space through the context of a program, through several different stages within the program. It could be tracking patients through multiple visits for a health program, or tracking commodities like blood samples from a sample is taken, through a lab for analysis etc. Many DHIS2 Tracker projects need a substantial amount of test data in order to test reports and charts configured for the program. Because the metadata is different for each project, it is difficult to create a uniform import tool to import data from an arbitrary format like Excel. The purpose for this project, is to create a web app for quick entry of test data in a tabular format based on a program’s metadata, with further possibilities for configuring which test data to be entered.

**Workflow of the app**

1. Sidebar provided to select the org unit for which the program's data is to be entered.
2. After selecting the org unit the programs registered under that org unit are loaded which you can select.
3. On selecting the program a table is rendrered using the program's meta data is rendered. The cols are the TEI attributes. Each row saves the the TEI registration data on clicking "save". 
4. If the TEI is successfully registered a collapsible card opens with the Program stages for that program the TEI is registered for. 
5. On clicking the stage button a modal opens where new events can be created. Multiple events can be created for repeatable programs. 
6. The data elements are postted to the API on clicking save.

This app is intended to provide a faster tabular data entry option for tracker capture. Also this apps moves the server side rendered app to client side provider faster UI interatcitons and reducing the XHR requests. 

**Demo**

This is the link to the demo : https://youtu.be/7Wes6vskmnM

**Tools and technologies**

JavaScript (ECMAScript 2015 (ES6)), ReactJS, Babel, Webpack, Material UI, D2, D2-UI, open-web app.
