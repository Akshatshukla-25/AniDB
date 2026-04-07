import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import AnimeDetails from './pages/AnimeDetails';
import Watchlist from './pages/Watchlist';
import Aurora from './components/Aurora';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Aurora
          colorStops={['#0088ff', '#000000', '#0044ff']}
          blend={0.5}
          amplitude={1.2}
          speed={0.5}
        />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
