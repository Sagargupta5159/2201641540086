import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import URLShortener from './components/URLShortener';
import Redirect from './components/Redirect';

function App() {
    return (
        <Router>
            <div className="app">
                <Switch>
                    <Route exact path="/" component={URLShortener} />
                    <Route path="/r/:shortCode" component={Redirect} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;