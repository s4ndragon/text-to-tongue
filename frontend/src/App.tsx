// App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <h1>LinguaLearn</h1>
          </div>
          <nav className="main-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/history" className="nav-link">
              History
            </Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>Language Learning Assistant &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
