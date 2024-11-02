# Table of contents

- Project Background/Overview
- Demo
- Features
- Documentation
- System Requirements
- Installation Guide
- Changelog
- Traceability Matrix

## Project background/overview

This project is a timetabling agent intended for staff members of a college to use manage subject, personnel and location data and allocate class timetables based on the available data. Our client, Victorian Institute of Technologies (VIT) requested a web application to streamline the process of creating timetables.

Strawhats proposes an easy to use, extendable, and reliable solution using an advanced tech stack. Simply upload your information from csv files or manually input data in our intuitive data management pages. Once all your information is in our system, click generate and a timetable will be created! Drag and drop and edit the events as much as you need with our sleek calendar interface. Export your creation effortlessly as a csv file, no training needed.

## Demo (link to hosted project) TO BE DONE idk who

## Features

**Sprint 3**

1. As a user, I should be able to securely log into the system and create an account for a specific user.
2. As a user, I should be able to add tutorials, lectures, and other types of classes so that students can be allocated to a particular class without a clash.
3. As a user, I should be able to generate an organized timetable based on data I’ve provided.
   **Sprint 4**
4. As a user, I should be able to move classes freely to different times and be assured that there are no clashes between students.
5. As a user, I should be able to export the created timetable to an Excel or .cal file for easy use.

## Documentation (user stories, architecture, test cases, other docs from Confluence – exported as PDF) STILL NEEDS TO BE DONE for ibrahim

put list of all documents here

## System requirements (tools/database and their versions)

NPM node package manager
PLEASE SOMEONE CHECK THIS BECAUSE I AM NOT SURE
ALSO HOW DO YOU SET UP MONGODB AND HOW DO YOU MAKE THE ENV FILE

## Installation guide (setup and configuration details to install/run your code)

### How to deploy using:

Frontend: Netlify

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

> **start commands**: gunicorn .app

This will make it run correctly.

3. **Set Environment Variables on Render:**

Go to the Environment tab in Render.

Add all required environment variables, including MongoDB credentials.
You can do this by opening the .env file in the backend folder then copy and pasting it into the prompt window.

Then it is possible to start the deployment , monitor logs for any issues.

> HELP WHEN I WAS WRITING THE GUIDE I GOT TO HERE AND IT FAILED AND I DON'T KNOW WHAT TO DO

4. **Configure Frontend:**

configure start command:

> npm run start

or

> npm run dev

install node nodules for our dependencies in the front end,

> npm install

all required packages should be in package.json

### How to run development server

1. Set up backend

create a new terminal

make sure you're in strawhatsvit/backend

> $ cd backend

install requirements

> $ pip install -r 'requirements.txt'

create a file called .env and get **contents from discord???? WE NEED TO CHANGE THIS**

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
- Fixed bug where the calendar displayed days of the week correctly

## Traceability matrix ADD LINK TO FILE
