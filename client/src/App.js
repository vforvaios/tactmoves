import PageNotFound from 'components/404/PageNotFound';
import Game from 'components/game/Game';
import Home from 'components/home/Home';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import 'semantic-ui-css/semantic.min.css';
import 'fontello/css/fontello.css';

const socket = io.connect(process.env.REACT_APP_SERVER_URL);

const App = () => (
  <HelmetProvider>
    <div className="row">
      <div className="wrapper">
        <div className="content">
          <Router>
            <Routes>
              <Route exact path="/" element={<Home socket={socket} />} />
              <Route
                path="/game/:room/:difficulty"
                element={<Game socket={socket} />}
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  </HelmetProvider>
);

export default App;
