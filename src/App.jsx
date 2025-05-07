import { useState } from "react";
import clsx from "clsx";
import "./App.css";
import { languageArray } from "./language";
import { wordList } from "./wordList";

const getRandomWords = () => {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toUpperCase();
};


function App() {
  const [currentWord, setCurrentWord] = useState(getRandomWords());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [isGameOver, setisGameOver] = useState(false);

  function addGuessedLetters(letter) {
    if (guessedLetters.includes(letter)) return;

    const isWrong = !currentWord.toUpperCase().includes(letter);
    const newWrongCount = isWrong ? wrongCount + 1 : wrongCount;

    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
    if (isWrong) {
      setWrongCount(Math.min(newWrongCount, languageArray.length));
      if (newWrongCount == languageArray.length - 1) {
        setisGameOver(true);
        console.log("Game Over");
      }
    }
  }

  const languageChips = languageArray.map((chip, index) => {
    const isDead = index < wrongCount;
    return (
      <span
        key={chip.name}
        className={clsx("chip", {
          dead: isDead,
        })}
        style={{ backgroundColor: chip.backgroundcolor, color: chip.textcolor }}
      >
        {isDead ? <img src={"./dead.jpg"} alt="Dead" /> : chip.name}
      </span>
    );
  });

  const keys = "abcdefghijklmnopqrstuvwxyz";
  const keyElements = keys
    .toUpperCase()
    .split("")
    .map((key) => {
      const isInword = currentWord.toUpperCase().includes(key);
      const hasGuessed = guessedLetters.includes(key);

      return (
        <button
          key={key}
          className={clsx("key", {
            "key-correct": hasGuessed && isInword,
            "key-wrong": hasGuessed && !isInword,
          })}
          onClick={() => addGuessedLetters(key)}
          disabled={isGameOver || hasGuessed}
        >
          {key}
        </button>
      );
    });

  const isWin = currentWord
    .toUpperCase()
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  return (
    <>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in 8 attempts to save the programming world safe from
          Assembly
        </p>
      </header>
      {isGameOver ? (
        <div className="status-bar over">
          <h2>Game Over!</h2>
          <p>You are owned with Assembly</p>
        </div>
      ) : isWin ? (
        <div className="status-bar">
          <h2>You win!</h2>
          <p>Well done 🎉🎉</p>
        </div>
      ) : null}

      <div className="language-chips">{languageChips}</div>
      <div className="guessBox">
        {currentWord
          .toUpperCase()
          .split("")
          .map((letter, index) => (
            <span key={index} className="guess-word">
              {isGameOver ? letter : guessedLetters.includes(letter) ? letter : ""}
            </span>
          ))}
      </div>
      <div className="keyword-section">{keyElements}</div>
      {isGameOver || isWin? (
        <button
          className="newGameBtn"
          onClick={() => {
            setWrongCount(0);
            setGuessedLetters([]);
            setisGameOver(false);
            setCurrentWord(getRandomWords());
          }}
        >
          New Game
        </button>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
