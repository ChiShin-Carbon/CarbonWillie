# Intelligent Carbon Footprint Verification (CFV) and Carbon Fee Assessment Management System

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-CC2927?logo=microsoftsqlserver&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)

## Table of Contents
- [Abstract](#abstract)
- [Technology Stack](#technology-stack)
- [System Overview](#system-overview)
- [System Demo](#system-demo)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Carbon News Service](#carbon-news-service)

---

## Abstract

With the escalating climate crisis, Carbon Footprint Verification (CFV) has become essential for emission management and reduction. Taiwan's government actively promotes corporate carbon footprint verification, yet the health examination industry faces challenges due to high energy consumption, complex operations, and data integration issues.

To address this, this study develops an intelligent CFV management system tailored for the industry. Using React for the front end and FastAPI for the back end, it integrates SQL Server for comprehensive functionalities. The system leverages large language models (LLM) and retrieval-augmented generation (RAG) to enhance data accessibility and decision-making, while web scraping ensures up-to-date emission factors and policy news.

This system streamlines CFV, improves data accuracy, and aids enterprises in formulating effective carbon reduction strategies.

## Technology Stack

| Technology | Description |
|---|---|
| React | Front-end Development |
| FastAPI | Back-end Development |
| SQL Server | Database Management |
| Web Scraping | Automated Data Collection |
| OpenAI API | Large Language Model Integration |
| LLM | Intelligent Knowledge Processing |
| RAG | Domain Knowledge Retrieval |
| Visual Studio Code | Development Environment |

## System Overview

> Overview of the project background, features, and project outcomes.

<a href="https://youtu.be/ui26MhRhWRM" target="_blank">
  <img src="https://img.youtube.com/vi/ui26MhRhWRM/maxresdefault.jpg" 
       alt="System Overview" 
       width="450">
</a>

## System Demo

> Demonstration of the system workflow and key functionalities.

<a href="https://youtu.be/9fn0XUY7q-E" target="_blank">
  <img src="https://img.youtube.com/vi/9fn0XUY7q-E/maxresdefault.jpg" 
       alt="System Demo" 
       width="450">
</a>

---

## Installation Guide

### Prerequisites

Before running this project, make sure the following tools are installed:
- Git
- Visual Studio Code
- Node.js
- Python 3.x
- pip

### Frontend Setup

**1. Clone Repository**

```shell
git clone https://github.com/ChiShin-Carbon/CarbonWillie.git
```

**2. Navigate to Frontend Directory**

```shell
cd template
```

**3. Install Frontend Dependencies**

```shell
npm install axios @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome react-select react-medium-image-zoom react-markdown @react-pdf-viewer/core @react-pdf-viewer/default-layout pdfjs-dist@3.11.174 react-tooltip
```

**Dependency Description**
| Category | Package | Description |
|---|---|---|
| HTTP Request | axios | Communicates with backend APIs |
| Icons | @fortawesome/* | Provides icon components |
| Dropdown | react-select | Provides searchable dropdown components |
| Image Zoom | react-medium-image-zoom | Enables image zoom functionality |
| Markdown | react-markdown | Displays Markdown content |
| PDF Viewer | @react-pdf-viewer/* | Displays PDF documents |
| Tooltip | react-tooltip | Provides UI tooltip components |

**4. Start Frontend Server**

```shell
npm start
```

### Backend Setup

**1. Prepare RAG Data**

Download the **「RAG Document」** folder from [FJCU_Undergraduate_Final_Project_CFV_System](https://drive.google.com/drive/folders/1oZ9VgixFKYfPM46qH0rcFPQp3ve7nxf9?usp=sharing), then copy it to the `template/fastapi` directory.

**2. Configure Environment Variables**

Create a file named `.env` in the `template` directory:

```env
OPENAI_API_KEY=your_openai_key
VITE_TINYMCE_API_KEY=your_tinymce_key
MISTRAL_API_KEY=your_mistral_key
SERPAPI_API_KEY=your_serpapi_key
HUGGINGFACE_TOKEN=your_huggingface_token
```

**3. Navigate to the Backend Directory**

```shell
cd fastapi
```

**4. Install Python Dependencies**

```shell
pip install -r requirements.txt
```

**5. Run FastAPI Server**

```shell
py -m uvicorn main:app --reload
```

### Carbon News Service

**1. Open a New Terminal**

Navigate to the Carbon News directory:

```shell
cd template/fastapi
```

**2. Install Required Packages**

```shell
pip install requests flask newsapi-python Flask-CORS
```

**3. Start Carbon News Service**

```shell
python carbon_news.py
```

### Run Frontend Application

Open another terminal:

```shell
cd template
```

```shell
npm start
```
