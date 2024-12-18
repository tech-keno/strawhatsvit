 
# Table of contents

- [Project Background/Overview](#project-backgroundoverview)
- [Demo](#demo-link-to-hosted-project)
- [Features](#features)
- [Documentation](#documentation)
- [System Requirements](#system-requirements-toolsdatabase-and-their-versions)
- [Installation Guide](#installation-guide-setup-and-configuration-details-to-installrun-your-code)
- [Changelog](#changelog)
- [Traceability Matrix](#traceability-matrix)

## Project Background/Overview

This project is a timetabling agent intended for staff members of a college to use manage subject, personnel and location data and allocate class timetables based on the available data. Our client, Victorian Institute of Technologies (VIT) requested a web application to streamline the process of creating timetables.

Strawhats proposes an easy to use, extendable, and reliable solution using an advanced tech stack. Simply upload your information from csv files or manually input data in our intuitive data management pages. Once all your information is in our system, click generate and a timetable will be created! Drag and drop and edit the events as much as you need with our sleek calendar interface. Export your creation effortlessly as a csv file, no training needed.

## Demo [(link to hosted project)](https://strawhatsvit-william.vercel.app/login)

### Login Credentials

To log in, try one of the following:

- **User**: `w`  
  **Password**: `w`

- **User**: `sam`  
  **Password**: `sam`

## Features

**Sprint 3**

1. As a user, I should be able to securely log into the system and create an account for a specific user.
2. As a user, be able to manage (create, view and edit) all data easily within the web app. 
3. As a user, I should be able to generate an organized timetable based on data I’ve provided. Students should be able to be allocated to classes without clashes.

**Sprint 4**

4. As a user, I should be able to move classes freely to different times and be assured that there are no clashes between students.
5. As a user, I should be able to export the created timetable to an Excel or .cal file for easy use.

## Documentation

- [Requirements](docs/requirements.pdf)
- [User Stories](docs/user_stories.pdf)
- [Architecture](docs/architecture.pdf)
- [Testing](docs/testing.pdf)

## System Requirements (Tools/Database and their Versions)

To run this project successfully, ensure your system meets the following requirements:

### Software Versions
- **Node.js**: v22.5.1
- **npm**: v10.8.2
- **Python**: v3.10.12
- **MongoDB**: v7.0.15
  
### Recommended Development Tools
- **Git**: For version control and cloning the repository.
- **Visual Studio Code** (or another IDE): For editing code.

### Browser Compatibility
The app is best viewed in the latest versions of Chrome, Firefox, or Safari.

---

Please install and configure these tools before running the project to avoid compatibility issues.

## Installation guide (setup and configuration details to install/run your code)

### How to deploy using:

Frontend: Vercel

Backend: Render

Frontend sends API calls to backend to fetch information.

Using: Fetch from frontend and Flask Routes in Backend.

### Steps for Deployment:

1. **Create a New Service on Render**

Go to Render’s dashboard and create a new Web Service.

Link it to the GitHub repository

2. **Configure Render Options:**

In Render's menu, fill in the fields so that

> **language**: python3

> **root directory**: backend

> **configure build command**: pip install -r "requirements.txt"

This is to install all the dependencies that is required for our product

> **start commands**: gunicorn app:app

This will make it run correctly.

3. **Set Environment Variables on Render:**

Go to the Environment tab in Render.

Add all required environment variables, including MongoDB credentials.
You can do this by opening the .env file in the backend folder then copy and pasting it into the prompt window.

Then it is possible to start the deployment , monitor logs for any issues.

4. **Configure Frontend:**

Go to Vercel and start deploying a new Project 

Connect to your version of this repo

configure to the frontend folder

Vercel will
install node nodules for our dependencies in the front end

all required packages should be in package.json

Connect to the vercel website!

### How to run development server

1. Set up backend

create a new terminal

make sure you're in strawhatsvit/backend

> $ cd backend

install requirements

> $ pip install -r 'requirements.txt'

create a file called .env and put in key

key gotten from creating one at https://www.mongodb.com/

run this command to start the backend

> $ python app.py

or

> $ python3 app.py

2. Set up frontend

start a new terminal

make sure you're in strawhatsvit/frontend

> $ cd frontend

install packages

> $ npm install

run the development server

> $ npm run dev

NOTE: Make sure URL is 127.0.0.1 for backend-frontend sync

## Changelog

**Sprint 1**

- Design phase

**Sprint 2**

- Set Up Back-End Infrastructure Flask and MongoDB
- Set Up Front-End Framework React with Node.js framework
- Set Up Daypilot api component

**Sprint 3**

- Dynamic Routing for Pages implemented
- Added file upload and CSV reading from user story 2
- Navbar with Dropdown & Logo Button developed
- Login Window developed from user story 1
- Login Authentication developed from user story 1
- Fixed bug where authentication only works on calendar page
- Timetable Display Window developed from user story 3
- Default Timetable Window developed from user story 3
- Data Input Pages (Buildings, Personnel, Study) developed from user story 2
- Timetable Allocation Algorithm developed from user story 3
- Implemented GitHub Actions for Automated Testing
- Fixed multiple YAML issues
- Changed MongoDB installation
- Save button functionality developed from user story 2

**Sprint 4**

- Connected timetable with back-end data
- Updated data import pages based on client feedback
- Added delete buttons to data management pages
- Import data from CSV developed from user story 2
- Fixed various bugs with allocation algorithm
- Integrated allocation algorithm with web application
- Developed clearer instructions and help panel for users based on feedback
- Fixed issues with the generate function by adding input checking and mistake highlighting
- Resolved integration issues with DayPilot API and backend connection
- Developed UI to edit events from user story 4 (drag and drop, form to change data)
- Fixed calendar event display to show information in the correct format
- Fixed bug where drag and drop wouldn't update information properly and would snap back if edited again
- Fixed bug where certain places would use "Monday" instead of "monday," which broke DayPilot
- Fixed bug where the calendar was not displaying correct data when moved/resized
- Fixed bug where the calendar displayed days of the week incorrectly

## Traceability Matrix

| Use case ID | User Story                                                                                                   | Test Cases | Test Result | Notes                                               |
|-------------|--------------------------------------------------------------------------------------------------------------|------------|-------------|-----------------------------------------------------|
| 1           | As a user, I can securely log into the system and create an account for a specific user.                     | TR-F-7     | Fail        | Feature not implemented                             |
|             |                                                                                                              | TR-F-8     | Pass        |                                                     |
|             |                                                                                                              | TR-F-9     | Pass        |                                                     |
|             |                                                                                                              | TR-B-1     | Pass        |                                                     |
|             |                                                                                                              | TR-B-2     | Pass        |                                                     |
| 2           | As a user, I can manage (view and edit) all data easily within the web app.                                  | TR-F-4     | Pass        |                                                     |
|             |                                                                                                              | TR-F-5     | Pass        |                                                     |
|             |                                                                                                              | TR-B-3     | Pass        |                                                     |
|             |                                                                                                              | TR-B-4     | Pass        |                                                     |
|             |                                                                                                              | TR-B-5     | Pass        |                                                     |
|             |                                                                                                              | TR-B-4     | Pass        |                                                     |
|             |                                                                                                              | TR-B-7     | Pass        |                                                     |
| 3           | As a user, I can generate an organized timetable based on data I’ve provided. Students should be allocated to classes without clashes. | TR-F-1     | Pass        |                                                     |
|             |                                                                                                              | TR-B-8     | Pass        |                                                     |
| 4           | As a user, I can move classes freely to different times and be assured that there are no clashes between students. | TR-F-2     | Pass        |                                                     |
|             |                                                                                                              | TR-F-3     | Pass        |                                                     |
| 5           | As a user, I can export the created timetable to an Excel or .cal file for easy use.                         | TR-F-6     | Fail        |                                                     |
| 6           | As a user, I can use multi-factor authentication to access the website.                                      |            |             | Feature was not implemented due to low priority and time constraints |
