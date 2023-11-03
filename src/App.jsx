
import './App.css';
import Chat from "./components/Chat";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
          <Route path='/support' element={<Dashboard />}>
            <Route path=':orderId' element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
