import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Receiver } from './components/Receiver'
import { Sender } from './components/sender'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sender' element={<Sender />} />
        <Route path='/receiver' element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
