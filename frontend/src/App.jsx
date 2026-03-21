
import "./App.css";
import Login from "./components/Login";
import GoalWindow from "./components/GoalWindow";

function App() {
  const showGoal = true;

  return showGoal ? <GoalWindow /> : <Login />;
}

export default App;