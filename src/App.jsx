import { useState } from 'react';
import './App.css';
import ApexStats from './ApexStats';
import About from './About';
import Footer from './Footer';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <Link to="/">About Me</Link>{' '}
          </li>
          <li>
            <Link to="/apexStats">Apex Stuff</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<About></About>}></Route>
        <Route path="/apexstats" element={<ApexStats></ApexStats>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
