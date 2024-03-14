import { useEffect, useState } from "react";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false);
  const [totalRolls, setTotalRolls] = useState(0);
  const [bestRolls, setBestRolls] = useState(
    parseInt(localStorage.getItem("bestRolls")) || 0
  );

  const [startTime, setStartTime] = useState(null);
  const [gameDuration, setGameDuration] = useState(null);

  useEffect(() => {
    const win = dice.every(
      (die) => die.isHeld === true && die.value === dice[0].value
    );
    if (win) {
      setTenzies(true);

      if (bestRolls === 0 || bestRolls > totalRolls) {
        localStorage.setItem("bestRolls", totalRolls.toString());
        setBestRolls(totalRolls);
      }
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  // setDice(newDice);
  function rollDice() {
    if (!tenzies) {
      if (totalRolls === 0) {
        setStartTime(new Date());
      }
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setTotalRolls((rolls) => rolls + 1);
    } else {
      setTotalRolls(0);
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  const dieElement = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click <br />
        each die to freeze it at its current value
        <br /> between rolls.
      </p>
      <div className="dice--container">{dieElement}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll Dice"}
      </button>
      <div className="roll-status">
        {totalRolls > 0 && (
          <div className="roll-count">
            <h3>Rolls:</h3>
            <p>{totalRolls}</p>
          </div>
        )}
        {tenzies && (
          <div className="roll-count">
            <h3>Best Rolls:</h3>
            <p>{bestRolls}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
