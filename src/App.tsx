import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom"
import Gallery from "./Gallery"
import List from "./List"
import Navbar from "./Navbar"
import ArtworkDetail from "./ArtworkDetail"

function App() {
  return (
    <Router basename={"/mp2"}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Gallery/>}/>
        <Route path="/list" element={<List/>}/>
        <Route path="artwork/:id/:next" element={<ArtworkDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;