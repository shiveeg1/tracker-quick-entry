
## Quick Data entry App for Tracker capture 

*WIP*

GSoC project to provide a quick data entry for tracker capture for DHIS2.

**Description**

The DHIS2 Tracker is a module for tracking entities across time and space through the context of a program, through several different stages within the program. It could be tracking patients through multiple visits for a health program, or tracking commodities like blood samples from a sample is taken, through a lab for analysis etc. Many DHIS2 Tracker projects need a substantial amount of test data in order to test reports and charts configured for the program. Because the metadata is different for each project, it is difficult to create a uniform import tool to import data from an arbitrary format like Excel.
The purpose for this project, is to create a web app for quick entry of test data in a tabular format based on a program’s metadata, with further possibilities for configuring which test data to be entered.

**Objectives**

The web app should communicate with a DHIS2 server through the Web API, and ideally be deployed and hosted as an integrated web app within DHIS 2. The web app should display a tabular form with one row containing fields for tracked entity attributes, and one row for each of the configured program stage, containing fields for all data elements configured for that program stage. Each field should have a label above the field, showing the name of the attribute/data element. Some additional fields are required on the program stage rows to enter program stage date, scheduled date etc. All mandatory fields should be clearly marked.

The first the page loads a table with rows to enter data required to register a new TEI (Tracked Entity Attribute) to the selected program. Selection of Org-Unit and respective programs under are provided too. After the TEI is registered, divs will be shown for entry of data-elments in the various program stages. Program stages can be repeatable. Each data-element is of specific type. The feilds rendered should handle the various data types for entry. After the details of the program stage are entered they should be stored on the server and visual response of the storage status should be given (green for success / red for error in storage).

Provide feature to register more TEIs. Handle creation of repeatable programs.

The app should also be configurable, enabling an administrator to decide which of the program’s configured metadata the end-user should be able to enter, so only the configured metadata within the app should be displayed to the end-users. Of course, all the program’s mandatory metadata (attributes and data elements) must be displayed to the end-user, and the administrator shouldn’t be able to deselect these.

**Tools and technologies**
JavaScript (ECMAScript 2015 (ES6)), ReactJS, Babel, Webpack, Material UI, D2, D2-UI, open-web app.
