import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Register from './pages/register/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
