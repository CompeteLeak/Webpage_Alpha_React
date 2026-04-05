import './App.css';
import ApexStats from './ApexStats';
import TeamWheel from './TeamWheel';
import About from './About';
import Footer from './Footer';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
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
          <li>
            <Link to="/TeamWheel"> Spin Team Wheel !</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<About></About>}></Route>
        <Route path="/apexStats" element={<ApexStats></ApexStats>}></Route>
        <Route path="/TeamWheel" element={<TeamWheel></TeamWheel>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
