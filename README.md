# Next.js 14 + Firebase Project with TailwindCSS Auto-Sorting
Made by Adrian Angelo Abelarde & Dzelle Faith Tan

![image](https://github.com/drianlarde/nextjs14-server-actions-firebase-boilerplate/assets/69323240/7b574986-e84b-4163-9027-7a5d12ac7caa)

This project demonstrates the integration of Next.js 14 Server Actions with Firebase for building scalable web applications, leveraging the utility-first CSS framework TailwindCSS with auto-sorting for a clean and maintainable codebase.

## Features

- **Next.js 14 Server Actions**: Utilize the latest Next.js features for server-side logic directly within your pages or API routes.
- **Firebase Integration**: Seamlessly connect to Firebase for authentication, database, storage, and more.
- **TailwindCSS**: Implement responsive and stylish designs easily with TailwindCSS.
- **Auto-Sorting**: Automatically sort TailwindCSS classes and import statements for readability and consistency.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (14.x or later)
- npm or Yarn
- Git (for version control)

## Setup

1. **Clone the repository**:

```bash
git clone https://github.com/drianlarde/nextjs14-server-actions-firebase-boilerplate.git
cd your-project-directory
```

2. **Install dependencies**:

Using npm:
```bash
npm install
```

3. **Configure Firebase**:

Create a `.env.local` file in your project root and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""
```

For auto-sorting TailwindCSS classes, install the necessary plugins or configure your code formatter accordingly.

4. **Run the development server**:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view your project.

---

This template covers basic aspects of the project setup and structure. You can customize it further based on the specific needs of your project, such as detailed Firebase setup, TailwindCSS customization, or adding more sections about deployment, testing, and so on.
