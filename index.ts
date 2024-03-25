import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { getFiveLetterWords, getRandomWord, isFiveLetterWord, toUpperCase } from "./words";
import axios, { Axios } from "axios";

dotenv.config();

const app : Express = express();

const fetchData = async () => {
  try {
    const response = await axios.get<string[]>("https://raw.githubusercontent.com/similonap/word-guess-api/main/words.json");
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

const WORDS = ["water", "bread", "frenzy","tower", "creepy", "donkey", "fruit", "bloom", "music", "pause", "sport", "market", "floor", "walking","prize", "chant", "swoop", "quill", "plume", "crisp", "sweep", "grace"];

let randomWord = "water";

app.get("/words", async (req, res) => {
    let data = await fetchData();
    let array:string[] = toUpperCase(data);
    res.render("words", {array: array,
    check: isFiveLetterWord})
});

app.post("/guess", (req, res) => {
  let word = req.body.guess;
  let displayWord:string = getRandomWord(WORDS)
  if (isFiveLetterWord(word)) {
    checkWord(word,displayWord);
  }
  res.render("guess",  
  {
    guess:word,
    displayedWord:displayWord
  })
});
app.get("/guess", (req, res) => {
   res.render("guess")
});

app.get("/restart", (req, res) => {
    
});

app.get("/", (req, res) => {
    res.render("index", {
    })
});

function createNewWord() {
  randomWord += " " + getRandomWord(WORDS);
  return randomWord;
}

function checkWord(guess: string, target: string): string[] {  
    guess = guess.toUpperCase();
    target = target.toUpperCase();
    let result = ['X', 'X', 'X', 'X', 'X']; // Initially set all to 'X' for gray
    let targetCopy = target.split('');
  
    // First pass for correct positions (Green)
    for (let i = 0; i < 5; i++) {
      if (guess[i] === target[i]) {
        result[i] = 'G'; // Green for correct position
        targetCopy[i] = '_'; // Mark as used
      }
    }
  
    // Second pass for correct letters in the wrong position (Yellow)
    for (let i = 0; i < 5; i++) {
      if (result[i] !== 'G' && targetCopy.includes(guess[i])) {
        result[i] = 'Y'; // Yellow for correct letter in wrong position
        targetCopy[targetCopy.indexOf(guess[i])] = '_'; // Mark as used
      }
    }

    return result.map(value => value === 'X' ? 'gray' : value === 'G' ? 'green' : 'yellow');
}

app.listen(app.get("port"), () => {
    createNewWord();
    console.log("Server started on http://localhost:" + app.get('port'));
});