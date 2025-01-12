# GovKonnect

 GovKonnect Web

GovKonnect Web is a modern platform showcasing barangay-level initiatives, fostering transparency, engagement, and accountability in Philippine governance. It aligns with SDG 16 (Strong Institutions), SDG 9 (Innovation), and SDG 10 (Reduced Inequalities), addressing key challenges like corruption, inefficiency, and limited citizen participation.

## Key Features

- **Interactive Barangay Map**: Navigate barangay information visually.
- **Latest Announcements**: AI-powered summarization of barangay updates.
- **Barangay Projects**: Display project details with dynamic images.
- **E-Services**: Seamless access to digital services.
- **Transparency Documents**: Enhance visibility and trust.

## Tech Stack
- **Frontend**: React, Next.js 13+ with App Router
- **Backend**: Firebase Firestore
- **AI Integration**: Hugging Face
- **Styling**: Tailwind CSS, Material UI

## Installation

### Prerequisites

- Node.js (v18 or later)
- Firebase account

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/DavidBatoDev/Exuvians.git
   cd Exuvians/client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the `client` folder and add the following:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
innolympics-web/
├── client/                # Frontend application
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utilities and configuration files
│   ├── pages/             # Page components
│   ├── public/            # Static assets
│   └── styles/            # Styling files
├── scripts/               # Automation scripts
└── README.md              # Project documentation
```

## API Endpoints

### AI Summarization Endpoint
**GET** `/api/summarize`

#### Query Parameters
- `uuid`: The unique identifier for a barangay.

## Deployment

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Start the Application**:
   ```bash
   npm start
   ```

3. **Deploy to Vercel**:
   - Connect your repository to [Vercel](https://vercel.com/).
   - Set up the environment variables in the Vercel dashboard.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a Pull Request.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
