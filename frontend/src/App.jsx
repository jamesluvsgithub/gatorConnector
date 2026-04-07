import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import GoalWindow from "./components/GoalWindow";
import ChatWindow from "./components/ChatWindow";

function App() {
  return <GoalWindow />;
  // return <ChatWindow />;
  // return <Login />;
}

export default App;