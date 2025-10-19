import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Support from './pages/Support';
import ContributorProfile from './pages/ContributorProfile';
import Sidebar from './pages/components/Sidebar';
import Header from './pages/components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container">
          <Sidebar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contributor/:address" element={<ContributorProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
