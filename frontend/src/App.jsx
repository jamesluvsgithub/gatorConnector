import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import GoalWindow from "./components/GoalWindow";
import ChatWindow from "./components/ChatWindow";

function App() {
  // Will display the goal window:
  // const showGoal = true;
  // return showGoal ? <GoalWindow /> : <Login />;

  //Will display the chat window: 
  const showChat = true;
  return showChat ? <ChatWindow /> : <GoalWindow />;

}

export default App;