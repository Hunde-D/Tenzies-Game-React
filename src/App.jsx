import { useEffect, useState } from "react";
import "./App.css";
import Die from "./components/Die";
import Status from "./components/Status";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false);
  const [totalRolls, setTotalRolls] = useState(0);
  const [bestRolls, setBestRolls] = useState(
    parseInt(localStorage.getItem("bestRolls")) || 0
  );

  const [bestTime, setBestTime] = useState(
    parseFloat(localStorage.getItem("bestTime")) || 0.0
  );
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    const win = dice.every(
      (die) => die.isHeld === true && die.value === dice[0].value
    );
    if (win) {
      setTenzies(true);
      setTimerActive(false);
      const time = seconds / 100;

      if (bestRolls === 0 || totalRolls < bestRolls) {
        setBestRolls(totalRolls);
        localStorage.setItem("bestRolls", totalRolls.toString());
      }
      if (bestTime === 0 || time < bestTime) {
        setBestTime(time);
        localStorage.setItem("bestTime", time.toString());
      }
    }
  }, [dice, bestTime, timerActive]);

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
    if (totalRolls === 0) {
      setSeconds(0); // Reset seconds on the first roll of a new game
      setTimerActive(true);
    }
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
        setSeconds(0); // Reset seconds on the first roll of a new game
        setTimerActive(true);
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
      setTimerActive(false); // Stop the timer
      setSeconds(0);
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
      <div className="hero">
        <Status
          className="stat"
          bestTime="best-time"
          title="Best Time:"
          statValue={bestTime}
        />
        <h1 className="title">
          <i>Tenzies</i>
          <img src={"/diceIcon.png"} alt="dice icon" />
        </h1>
        <div className="timer">{seconds / 100}</div>
      </div>
      <p className="instructions">
        Roll until all dice are the same. Click <br />
        each die to freeze it at its current value between rolls.
      </p>

      <div className="dice--container">{dieElement}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll Dice"}
      </button>
      <div className="roll-status">
        <Status className="stat" title="Rolls:" statValue={totalRolls} />
        <Status
          className="stat "
          bestTitle="best-stat"
          title="Best Rolls:"
          statValue={bestRolls}
        />
      </div>
    </main>
  );
}

export default App;
