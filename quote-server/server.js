import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();


app.use(cors());

const getQuotes = async (url) => {
  const response = await fetch(url);
  return response.json();
};

app.get("/", (req, res) => {
  res.send("Welcome to Fathi's Quote Server! Use /quotes/random or /quotes to get quotes.");
});

app.get("/quotes", async (req, res) => {
  const pageNumber = req.query.page || 1;
  const allQuotes = await getQuotes(`https://api.quotable.io/quotes?page=${pageNumber}`);
  res.send(allQuotes);
});

app.get("/quotes/random", async (req, res) => {
  const randomQuoteResponse = await fetch("https://api.quotable.io/random");
  const randomQuote = await randomQuoteResponse.json();
  res.send(randomQuote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Quote server is running on port ${PORT}`);
});