import './App.css';
import { BrowserRouter, Router } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import HomePage from './pages/HomePage/HomePage';
import BoardPage from './pages/BoardPage/BoardPage';
import RequireAuth from '../src/components/RequireAuth/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <RequireAuth>
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <Route path='/board/:id' component={BoardPage}/>
          <Route path='/login' component={LoginPage}/>
          <Route path='/register' component={RegistrationPage}/>
        </Switch>
      </RequireAuth>
  </BrowserRouter>

  );
}

export default App;
