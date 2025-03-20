# DevTinder

- Created a vite+react+tailwindcss project
- Install daisyui
- add Navbar component (./src/components/Navbar.jsx)
- install react-router-dom
- add Body component (./src/components/Body.jsx)
- add Footer component (./src/components/Footer.jsx)
- add routes
- add Login page (./src/pages/Login.jsx)


   - install axios 
    - cors -- install cors in backend => add middleware : origin, creditials: true
    - whenever you are making api call so pass axios => {withCredentials: true}

    -- install react-redux -- npm install @reduxjs/toolkit
    docs: https://redux-toolkit.js.org/tutorials/quick-start

    -- create a configureStore => store.js 
    -- provider => create slice => add reducer to configureStore


    - you should not be access to add other route without login
    - If token is not present => redirect to login



## Routes
/ -- Feed
/login -- Login
/register -- Register
/connections -- Connections

## Features
- Login
- Register
- Connections
- Feed