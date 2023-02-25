import './App.css';
import{Routes,BrowserRouter,Route} from "react-router-dom"
import Login from './Components/login.js'
function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
      <Route element={<Login/>} exact path="/login"/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
