import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import UserForm from "./UserForm";
import GameApp from "./GameApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Loading from "./Loading";

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return <Loading />;
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
        <Route path="/game/:id">
          <GameApp/>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
