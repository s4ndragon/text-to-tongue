// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/history">History</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        <footer>
          <p>Text-to-Speech App &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
