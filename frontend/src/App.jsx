
import "./App.css";
import Login from "./components/Login";
import GoalWindow from "./components/GoalWindow";

function App() {
  // return <GoalWindow />;
  // return <ChatWindow />;
  return <Login />;
  // Will display the goal window:
  // const showGoal = true;
  // return showGoal ? <GoalWindow /> : <Login />;

  //Will display the chat window: 
  // const showChat = true;
  // return showChat ? <ChatWindow /> : <GoalWindow />;

}

export default App;