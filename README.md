# 🤖 Dialogflow Testing Tools 🧪

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.12-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Dialogflow-Testing-FF9800?style=for-the-badge&logo=dialogflow&logoColor=white" alt="Dialogflow"/>
</div>

<div align="center">
  <p><strong>A modern web application for testing Dialogflow agents (CX & ES) with elegant UI and powerful features</strong></p>
</div>

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🛠️ Features](#️-features)
- [🚀 Getting Started](#-getting-started)
- [📊 Testing Capabilities](#-testing-capabilities)
- [🧩 Architecture](#-architecture)
- [🔍 Usage Examples](#-usage-examples)
- [⚙️ Configuration](#️-configuration)
- [📈 Project Structure](#-project-structure)

## ✨ Overview

<div align="center">
  <div style="position: relative; padding-bottom: 56.25%; height: 0;">
    <a href="https://www.loom.com/embed/b7ddf774e05240f996e033c13793f77f?sid=efa37ab9-5b91-482d-b7c6-43bc0359dacc" target="_blank">
      <img src="https://cdn.loom.com/sessions/thumbnails/b7ddf774e05240f996e033c13793f77f-with-play.gif" width="600" alt="Dialogflow Testing Demo Video" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    </a>
  </div>
  <p><em>Click on the image to watch the demo video</em></p>
</div>

Dialogflow Testing Tools is a comprehensive web application designed to help developers test and validate both Dialogflow CX and ES agents. This tool provides an intuitive interface for sending test queries, evaluating responses, and improving conversational AI experiences.

## 🛠️ Features

<div align="center">
  <table>
    <tr>
      <th>Feature</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>🔄 Dual Platform Support</td>
      <td>Test both Dialogflow CX and ES agents from a single interface</td>
    </tr>
    <tr>
      <td>📝 Interactive Testing</td>
      <td>Send queries and view formatted JSON responses in real-time</td>
    </tr>
    <tr>
      <td>📊 CSV Bulk Testing</td>
      <td>Upload CSV files with multiple test cases and run automated tests</td>
    </tr>
    <tr>
      <td>🤖 Automated Test Execution</td>
      <td>Run batch tests and get comprehensive results with pass/fail status</td>
    </tr>
    <tr>
      <td>🌐 Multi-language Support</td>
      <td>Test agents in various languages to ensure global coverage</td>
    </tr>
    <tr>
      <td>🎯 Intent Validation</td>
      <td>Verify intent matching and parameter extraction</td>
    </tr>
    <tr>
      <td>🔍 Response Analysis</td>
      <td>Detailed breakdown of agent responses and fulfillment</td>
    </tr>
    <tr>
      <td>📈 Test Results Dashboard</td>
      <td>Visual summary of test execution with detailed turn-by-turn analysis</td>
    </tr>
    <tr>
      <td>🌙 Dark Mode Support</td>
      <td>Comfortable testing experience in all lighting conditions</td>
    </tr>
  </table>
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python 3.8+ (for CSV testing backend)
- Google Cloud Platform account with Dialogflow API enabled
- Dialogflow CX or ES agent
- Google Cloud credentials (service account JSON file)

### Installation Steps

#### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Yash-Kavaiya/Dialogflow-Testing.git
cd Dialogflow-Testing/dialogflow-testing-tools

# Install dependencies
npm install

# Start the development server
npm start
```

Your frontend application will be available at http://localhost:3000

#### Backend Setup (for CSV Testing)

```bash
# Navigate to backend directory
cd ../backend

# Install Python dependencies
pip install -r requirements.txt

# Set up Google Cloud credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"

# Start the Flask server
python app.py
```

Your backend API will be available at http://localhost:5000

See [backend/README.md](backend/README.md) for detailed backend setup and API documentation.

## 📊 Testing Capabilities

```mermaid
graph TD
    A[User Input] --> B[Test Configuration]
    B --> C{Agent Type}
    C -->|Dialogflow CX| D[CX Testing Pipeline]
    C -->|Dialogflow ES| E[ES Testing Pipeline]
    D --> F[Process Response]
    E --> F
    F --> G[Display Results]
    
    style A fill:#f9d5e5,stroke:#333
    style B fill:#eeeeee,stroke:#333
    style C fill:#e6f7ff,stroke:#333
    style D fill:#d5f5e3,stroke:#333
    style E fill:#d5f5e3,stroke:#333
    style F fill:#fdebd0,stroke:#333
    style G fill:#f2d7d5,stroke:#333
```

### Testing Process

1. **Configuration**: Enter your Project ID, Agent ID, and Location (for CX)
2. **Query Input**: Type your test utterance or phrase
3. **Processing**: Send request to Dialogflow API
4. **Analysis**: Review the structured response
5. **Iteration**: Refine your agent based on test results

## 🧩 Architecture

<div align="center">
  <table>
    <tr>
      <th colspan="2">Component Architecture</th>
    </tr>
    <tr>
      <td width="200"><strong>Frontend</strong></td>
      <td>
        • React with TypeScript<br>
        • Tailwind CSS for styling<br>
        • React Router for navigation
      </td>
    </tr>
    <tr>
      <td><strong>API Integration</strong></td>
      <td>
        • Dialogflow CX API<br>
        • Dialogflow ES API<br>
        • RESTful service architecture
      </td>
    </tr>
    <tr>
      <td><strong>State Management</strong></td>
      <td>
        • React hooks for local state<br>
        • Context API for global state (planned)
      </td>
    </tr>
    <tr>
      <td><strong>Testing</strong></td>
      <td>
        • Jest for unit testing<br>
        • React Testing Library for component testing
      </td>
    </tr>
  </table>
</div>

## 🔍 Usage Examples

### Basic Testing

<blockquote>
<p>💡 <strong>Tip:</strong> Start with simple queries to verify basic functionality before testing more complex scenarios.</p>
</blockquote>

1. Select your agent type (CX or ES)
2. Enter your Google Cloud Project ID
3. Provide your Agent ID (and location for CX agents)
4. Enter a test query (e.g., "Hello" or "I need help")
5. Click "Run Test"
6. Review the formatted JSON response

### CSV Bulk Testing

For automated testing with multiple test cases:

1. Navigate to the **CSV Testing** page
2. Configure your agent settings (Project ID, Agent ID, Location)
3. Download the sample CSV template or prepare your own
4. Upload your CSV file with test cases
5. Review the parsed test cases
6. Click "Run Tests" to execute all test cases
7. View detailed results with pass/fail status

**CSV Format Example:**
```csv
test_id,conversation,expected_intent,language_code
test_1,Hi|I want to book a flight|Tomorrow,booking.flight,en
test_2,Hello|I need help,help.general,en
test_3,Cancel my order|Order number 12345,order.cancel,en
```

### Advanced Testing Scenarios

| Scenario | Test Input | What to Verify |
|----------|------------|----------------|
| Intent Recognition | "What's the weather like today?" | Correct intent matching |
| Entity Extraction | "Book a meeting on June 15th at 2pm" | Date and time parameters |
| Fallback Handling | "xyzabcdefg" | Proper fallback behavior |
| Context Management | Multi-turn conversation | Context persistence |
| Webhook Integration | "Process my order" | Fulfillment responses |
| Bulk Testing | Upload CSV with 100+ test cases | Automated regression testing |

## ⚙️ Configuration

The application works with standard Dialogflow configuration parameters:

- **Project ID**: Your Google Cloud project identifier
- **Agent ID**: The unique identifier for your Dialogflow agent
- **Location**: Geographic location (for Dialogflow CX only)
- **Language Code**: ISO language code (defaults to en-US)

### Environment Setup

For backend integration, you'll need to set up authentication:

```
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/credentials.json
```

## 📈 Project Structure

```
Dialogflow-Testing/
├── dialogflow-testing-tools/  # React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Home.tsx       # Main testing interface
│   │   │   ├── CSVTesting.tsx # CSV bulk testing interface
│   │   │   ├── About.tsx      # About page
│   │   │   ├── Header.tsx     # Navigation header
│   │   │   └── ...
│   │   ├── services/          # API services
│   │   │   └── dialogflowService.ts
│   │   ├── App.tsx            # Main application component
│   │   ├── index.tsx          # Entry point
│   │   └── ...
│   ├── package.json           # Dependencies and scripts
│   └── README.md              # Frontend documentation
├── backend/                   # Flask Backend (CSV Testing)
│   ├── app.py                 # Flask API endpoints
│   ├── csv_test_runner.py     # Test execution engine
│   ├── requirements.txt       # Python dependencies
│   ├── README.md              # Backend documentation
│   ├── uploads/               # CSV file uploads
│   └── results/               # Test results storage
└── README.md                  # Main project documentation
```

---

<div align="center">
  <p>📫 <strong>Have questions or feedback?</strong> Open an issue on GitHub or contribute to the project!</p>
  <p>⭐ <strong>If you find this tool useful, please star the repository!</strong> ⭐</p>
  <p>Built with ❤️ by <a href="https://github.com/Yash-Kavaiya">Yash Kavaiya</a></p>
</div>
