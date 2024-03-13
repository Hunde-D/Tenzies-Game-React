import { useEffect, useState } from "react";
import "./App.css";
import Die from "./Die";

function App() {
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(Math.ceil(Math.random() * 6));
    }
    return newDice;
  }
  const [dice, setDice] = useState(allNewDice);
  // setDice(newDice);
  function rollDice() {
    setDice(allNewDice);
  }

  const dieElement = dice.map((die) => <Die value={die} />);

  return (
    <main>
      <div className="dice--container">{dieElement}</div>
      <button className="roll-dice" onClick={rollDice}>
        Roll
      </button>
    </main>
  );
}

export default App;
