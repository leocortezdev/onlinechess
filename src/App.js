import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import UserForm from "./UserForm";
import GameApp from "./GameApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return "loading";
  }
  if (error) {
    return "error";
  }
  if (!user) {
    return <UserForm />;
  }
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home></Home>
        </Route>
        <Route>
          <GameApp path="/game/:id"/>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
