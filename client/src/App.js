import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapContent from './pages/MapContent';
import './App.css';
import TourPage from './pages/TourPage';
import BaseRouter from './modules/router';
import { useEffect, useState } from 'react';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import LogOutBttn from './components/admin/LogOutBttn';
import CONSTANTS from './modules/constants';
export default function App() {
  const router = new BaseRouter();
  const [authToken, updAuthToken] = useState(null);
  const [backgrColor, updBackgrColor] = useState('#fff0');
  const [shadowOpacity, updShadowOpacity] = useState(0.855);
  const [navBttnColor, updNavBttnColor] = useState('#fff');
  const [navShadow, updNavShadow] = useState(0.25);

  useEffect(() => {
    updAuthToken(localStorage.getItem('maps-auth-token'));
    getMe();
  }, []);

  async function getMe() {

    setInterval(async () => {
      try {
        const token = localStorage.getItem('maps-auth-token');
        if (token) {
          const answer = await router.getMe(token);
          if (!answer.data) {
            updAuthToken(null);
          }
        }
      } catch (e) {
        console.error(e?.response?.data?.err);
        updAuthToken(null);
        localStorage.removeItem('maps-auth-token');
      }
    }, 15000)
  }

  return (
    <div>
      <nav className='nav-bar' style={{
        backgroundColor: backgrColor,
        boxShadow: `0 4px 4px rgba(0, 0, 0, ${navShadow})`
      }}>
        <a href="/" className='logo'
          style={{
            textShadow: `0px 0px 1dvw rgba(73, 73, 73, ${shadowOpacity}`,
            color: navBttnColor
          }}
        >RUSSIA-REGIONS.RU</a>
        {authToken && <div style={{ right: '5dvw', marginLeft: '1dvw' }}>
          <LogOutBttn shadowOpacity={shadowOpacity} navBttnColor={navBttnColor} updAuthToken={updAuthToken} />
          <a href={`http://${CONSTANTS.PAGE_API}/admin/`}><button className='admin-bttn'
            style={{
              textShadow: `0px 0px 1dvw rgba(73, 73, 73, ${shadowOpacity}`,
              color: navBttnColor,
              borderColor: navBttnColor
            }}>Администрирование</button></a>
        </div>}
      </nav >
      <Router >
        <Routes>
          <Route exact path='/' element={<MapContent
            updNavBttnColor={updNavBttnColor} updNavShadow={updNavShadow}
            updShadowOpacity={updShadowOpacity} updBackgrColor={updBackgrColor} router={router} />} />
          <Route path={'/tours/'} element={<TourPage
            updNavBttnColor={updNavBttnColor}
            updNavShadow={updNavShadow}
            updShadowOpacity={updShadowOpacity} updBackgrColor={updBackgrColor} router={router} authToken={authToken} />} />
          <Route path={'/tours/:url'} element={<TourPage
            updNavBttnColor={updNavBttnColor}
            updNavShadow={updNavShadow}
            updShadowOpacity={updShadowOpacity} updBackgrColor={updBackgrColor} router={router} authToken={authToken} />} />
          <Route path={'/admin/'} element={authToken ? <AdminPage
            updNavBttnColor={updNavBttnColor}
            updNavShadow={updNavShadow}
            updShadowOpacity={updShadowOpacity} updBackgrColor={updBackgrColor} router={router} />
            :
            <AuthPage
              updNavShadow={updNavShadow}
              updShadowOpacity={updShadowOpacity}
              updNavBttnColor={updNavBttnColor}
              router={router} updBackgrColor={updBackgrColor} updAuthToken={updAuthToken} />}
          />
        </Routes>
      </Router>
    </div >
  );
};