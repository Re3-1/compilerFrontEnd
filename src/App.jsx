import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import './App.css'
import { TimelineComponent } from './pages/result'
import { InputD } from './pages/InputD'

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/result' element={<TimelineComponent></TimelineComponent>} ></Route>
        <Route path='/' element={<InputD></InputD>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
