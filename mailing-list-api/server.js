import express from "express";

const app = express();
app.use(express.json());

const lists = new Map();
lists.set("staff", ["talea@techtonica.org", "michelle@techtonica.org"]);
lists.set("cohort-h1-2020", ["ali@techtonica.org", "humail@techtonica.org", "khadar@techtonica.org"]);

// Get all lists
app.get("/lists", (req, res) => {
  const listsArray = Array.from(lists.keys());
  res.status(200).json({ lists: listsArray });
});

// Get members of a specific list
app.get("/lists/:name", (req, res) => {
  const listName = req.params.name;
  const list = lists.get(listName);
  if (list) {
    res.status(200).json({ name: listName, members: list });
  } else {
    res.status(404).json({ error: "List not found" });
  }
});

// Delete a list
app.delete("/lists/:name", (req, res) => {
  const listName = req.params.name;
  if (lists.delete(listName)) {
    res.status(200).json({ message: `Deleted ${listName} successfully!` });
  } else {
    res.status(404).json({ error: "List not found" });
  }
});

// Update or create a list
app.put("/lists/:name", (req, res) => {
  const listName = req.params.name;
  const { name, members } = req.body;

  if (listName.toLowerCase() !== name.toLowerCase()) {
    res.status(400).json({ error: `Path (${listName}) & JSON body ("name": ${name}) do not match` });
    return;
  }

  lists.set(listName, members);
  if (lists.has(listName)) {
    res.status(200).json({ message: `List ${listName} has been updated` });
  } else {
    res.status(201).json({ message: `New list ${listName} has been created` });
  }
});

const PORT = 3003;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default server;

