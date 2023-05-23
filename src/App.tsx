import { Route, Routes } from 'react-router-dom'
// import MainMenu from './pages/MainMenu'
import ConnectFour from './pages/ConnectFour'
import Rules from './pages/Rules'
import { inject } from '@vercel/analytics'

const App = () => {
  inject()

  return (
    <div className="App">
      <Routes>
        <Route index element={<ConnectFour />} />
        <Route path='rules' element={<Rules />} />
        {/* <Route path='connect-four' element={<ConnectFour />} /> */}
      </Routes>
    </div>
  )
}

export default App
