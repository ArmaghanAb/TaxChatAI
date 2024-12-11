# TaxChatAI

A professional chat interface for querying tax-related questions and retrieving AI-generated responses, designed with modern web technologies. This project demonstrates input validation, API integration, and database management.

---

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)


---

## Description

This project provides a user-friendly interface for querying tax-related questions. It validates user inputs, generates responses using a backend API, and stores the queries and responses in a MySQL database for auditing purposes. A history feature allows users to view past interactions. Non-tax-related prompts are rejected but still stored in the database with an error message.

---

## Features

- **Interactive Chat Interface**: Users can input tax-related questions and receive real-time responses.
- **Input Validation**: Ensures that only tax-related prompts are processed.
- **Data Storage**: Prompts and responses are saved in a MySQL database.
- **History Viewing**: Displays past interactions in a separate window.
- **Error Handling**: Provides meaningful feedback for invalid inputs or server issues.
- **Customizable Branding**: Placeholder for company-specific branding.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL (with `mysql2` library)
- **API Integration**: Axios
- **Other Tools**: CORS for cross-origin requests

---

## Installation and Setup

### Prerequisites

1. Install [Node.js](https://nodejs.org/).
2. Install MySQL and set up a local server.

### Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd tax-chat-ui
