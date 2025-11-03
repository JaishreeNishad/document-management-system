# React

# Document Management App

This project is a comprehensive Document Management Application built using React, Bootstrap , and Axios. It is designed for both mobile and web devices and includes features for login/logout, document preview, search, date filtering, and file upload.

## Features

- **User Authentication**:

  - Login with mobile OTP validation
  - Secure session management using local storage
  - Logout functionality

- **Document Upload**:

  - Date Picker for selecting document date
  - Dropdown for selecting category: _Personal_ or _Professional_
  - Dynamic second dropdown:
    - If "Personal" is selected, loads names (e.g., John, Tom, Emily)
    - If "Professional" is selected, loads departments (e.g., Accounts, HR, IT, Finance)
  - Tag input field with suggestions and chip style display:
    - Fetches pre-existing tags from the API
    - Automatically saves new tags
  - File upload:
    - Only allows Image (PNG, JPEG) and PDF file types
  - Remarks field for additional document information

- **Document Search & Preview**:

  - Search feature with filters for date range, tags, and uploader
  - Responsive table layout for search results
  - Document preview page with PDF and image display capabilities

- **Responsive Design**:
  - Built with Bootstrap using responsive design classes, ensuring optimal display on both mobile and desktop environments.

## Technology Stack

- **Frontend**: React
- **Styling**: Bootstrap 5.3.8
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Installation

1. **Clone the repository:**

   ```bash
   git clone  https://github.com/JaishreeNishad/document-management-system.git

   cd document-management-system
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Bootstrap Setup:**

Bootstrap is automatically loaded from npm and imported in `src/index.js`. You don’t need any extra configuration.

4. **Run the Application:**
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000` by default.

## Configuration

- **API Endpoints:**

  - **Generate OTP**: `POST https://apis.allsoft.co/api/documentManagement/generateOTP`
  - **Validate OTP**: `POST https://apis.allsoft.co/api/documentManagement/validateOTP`
  - **Upload File**: `POST https://apis.allsoft.co/api/documentManagement/saveDocumentEntry`
  - **Search Document**: `POST https://apis.allsoft.co/api/documentManagement/searchDocumentEntry`
  - **Document Tags**: `POST https://apis.allsoft.co/api/documentManagement/documentTags`

- **Authentication Context:**
  The user token is stored in local storage after OTP validation and accessed via React Context in `src/context/AuthContext.js`.

- **Routing:**
  The application uses React Router DOM for client-side routing. Routes are defined in `src/App.js` and include login, upload, search, and preview pages.
