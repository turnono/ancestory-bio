# AncestryBio Dash 🧬

A specialized LIMS (Laboratory Information Management System) for biotech labs focusing on biosynthetic cannabinoid production. Track enzyme promiscuity, visualize yield data, and manage microbial host repositories.

![AncestryBio Dash](https://img.shields.io/badge/Angular-17-red?logo=angular)
![Firebase](https://img.shields.io/badge/Firebase-10.8-orange?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?logo=tailwindcss)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-ff6384?logo=chartdotjs)

## ✨ Features

### 🔐 Authentication & Authorization
- Email/Password authentication via Firebase
- Role-based access control (Admin, Researcher, Lab Tech)
- Protected routes with auth guards
- User profile management

### 📊 Yield Tracker
- Track 1-to-many cannabinoid outputs (CBGA → THCA/CBDA/CBCA)
- Interactive Chart.js visualizations
- Batch management with detailed records
- Peak yield detection
- Stats dashboard

### 🧬 Enzyme Catalog
- Manage enzyme repository
- Track enzyme types (Ancestral, Modern, Intermediate)
- Specialization tracking (Promiscuous, THCA-specific, CBDA-specific, CBCA-specific)
- Metadata management (sequence, reconstruction method, confidence scores)

### 🦠 Organism Repository
- Microbial host management
- Taxonomy tracking
- Genomic file management
- Culture image gallery

### 🌳 Phylogenetic Tree (Coming Soon)
- D3.js interactive tree visualization
- Enzyme family evolution tracking
- Comparative analysis

### 🎨 Premium UI/UX
- Modern glassmorphic design
- Dark mode support
- Responsive layout
- Global navigation
- Empty states with clear CTAs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/turnono/ancestory-bio.git
   cd ancestory-bio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Create a Storage bucket
   - Copy your Firebase config to `src/environments/environment.ts`:
   
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       storageBucket: 'YOUR_STORAGE_BUCKET',
       messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
       appId: 'YOUR_APP_ID'
     }
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 📦 Project Structure

```
ancestory-bio/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Route guards
│   │   │   ├── models/          # Data models
│   │   │   └── services/        # Business logic services
│   │   ├── features/
│   │   │   ├── auth/            # Authentication
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── yield-tracker/   # Yield tracking
│   │   │   ├── enzymes/         # Enzyme management
│   │   │   ├── organisms/       # Organism management
│   │   │   └── phylogenetic-tree/
│   │   ├── app.component.ts     # Root component
│   │   └── app.routes.ts        # Routing configuration
│   ├── environments/            # Environment configs
│   └── styles.css               # Global styles
├── seed-data.js                 # Data seeding script
├── SEEDING.md                   # Seeding guide
└── README.md
```

## 🧪 Testing with Sample Data

To populate the database with sample data for testing:

1. Log in to the application
2. Open browser console (F12)
3. Copy the contents of `seed-data.js`
4. Paste into console and run `seedData()`
5. Refresh the page

See [SEEDING.md](SEEDING.md) for detailed instructions.

## 🛠️ Built With

- **[Angular 17](https://angular.dev)** - Frontend framework
- **[Firebase](https://firebase.google.com)** - Backend services
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS
- **[Chart.js](https://www.chartjs.org)** - Data visualization
- **[D3.js](https://d3js.org)** - Advanced visualizations (planned)

## 📱 PWA Support

The application is configured as a Progressive Web App with:
- Offline functionality (planned)
- Install to home screen
- Service worker caching

## 🔒 Security

- Firebase Authentication
- Firestore security rules
- Storage security rules
- Role-based access control
- Protected routes

## 📊 Data Models

### Batch
- Enzyme and organism associations
- CBGA input tracking
- Cannabinoid output percentages (THCA, CBDA, CBCA)
- Status tracking (in-progress, completed, peak-yield)
- Lab tech attribution

### Enzyme
- Type classification (Ancestral, Modern, Intermediate)
- Specialization (Promiscuous, THCA, CBDA, CBCA)
- Sequence data
- Reconstruction metadata
- Confidence scores

### Organism
- Taxonomy information
- Strain details
- Genomic file management
- Culture images
- Expressed enzymes

## 🚧 Roadmap

- [x] Authentication & Authorization
- [x] Global Navigation
- [x] Yield Tracker with Chart.js
- [x] Batch Management
- [x] Data Seeding Script
- [ ] Complete Enzyme Forms
- [ ] Complete Organism Forms
- [ ] D3.js Phylogenetic Tree
- [ ] CSV/PDF Export
- [ ] Real-time Notifications
- [ ] Advanced Search
- [ ] Mobile Optimization
- [ ] Unit & E2E Tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**AncestryBio Team**

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Firebase for backend infrastructure
- Chart.js for beautiful visualizations
- TailwindCSS for the design system

---

**Built with ❤️ for biotech research labs**
