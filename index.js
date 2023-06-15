const { Client, GatewayIntentBits } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => { console.log(`!!!Logged in as ${client.user.tag}!`) })

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // bark command
  if (interaction.commandName === 'bark') {
    interaction.reply("Woof Woof Woof");
  }

  // pekofy command
  if (interaction.commandName === 'pekofy') {
    const text = interaction.options.get('text')?.value;
    interaction.reply(`${replaceRandomWordWithPeko(text)}`);
  }

  // help command
  if (interaction.commandName === 'help') {
    interaction.reply("`/bark` to let Fuuko bark\n`/pekofy` to randomly pekofy a word in a sentence\n`/addquote` to add a quote\n`/showquotes` to show all the quotes\n`/getquote` to get a random quote or with index number to get a specific quote\n`/deletequote` delete a quote");
  }

  databaseQuoteCommands(interaction);
})

// commands that use the replit database
async function databaseQuoteCommands(interaction) {
  // addquote command
  if (interaction.commandName === 'addquote') {
    const quote = interaction.options.get('quote')?.value; // get the 'quote' parameter from the command. 
    try {
      db.get("quotes").then(quotes => { // the key 'quotes' does not exist. Database is empty.
        if (!quotes || quotes.length < 1) {
          db.set("quotes", [quote]) // create the key 'quotes' and add the quote to as value to it.
        } else { // there are quotes in the database.
          quotes.push(quote)
          db.set("quotes", quotes)
        }   
      })
      interaction.reply("New quote added");
    } catch (error) {
      console.log('An error occurred:', error.message);
    }
  }

  //showquotes command
  if (interaction.commandName === 'showquotes') {
    try {
      if (db.get('quotes')) {
        const quotes = await db.get("quotes")
        if (!quotes) {
          interaction.reply("No quotes found");
        } else {
          let longString = ``;
          quotes.forEach(function(quote, index) { // Show all the quotes and the index
            longString += `#${index}:   ${quote}\n`
          });
          interaction.reply(`${longString}`)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //deletequote command
  if (interaction.commandName === 'deletequote') {
    const index = interaction.options.get('index')?.value;
    try {
      const quotes = await db.get("quotes")
      if (!quotes) {
        interaction.reply("No quotes found");
      } else {
        if (quotes.length > index && index >= 0) { // Check if the index exist
          quotes.splice(index, 1)
          db.set('quotes', quotes)
          interaction.reply("Quote deleted")
          if (quotes.length === 0) {
            db.empty();
          }
        }
        else {
          interaction.reply("Index not found")
        }
      }
    } catch (error) {
      console.log(error.message);
      interaction.reply("Index not found")
    }
  }

  //getquote
  if (interaction.commandName === 'getquote') {
    try {
      if (db.get('quotes')) {
        const quotes = await db.get("quotes")
        if (!quotes) {
          interaction.reply("No quotes found");
        } else {
          const index = interaction.options.get('index')?.value;
          if (quotes.length > index && index >= 0) { // index has been given and the index exist
            interaction.reply(`${quotes[index]}`)
          } else { // index has not been given or it does not exist
            if (index < 0 || index >= quotes.length) { // index does not exist
              interaction.reply("Index not found")
            } else { // get a random quote when no index has been given
              const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
              interaction.reply(`${randomQuote}`)
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

// a function to replace 1 random word in a sentence with the word peko
function replaceRandomWordWithPeko(text) {
  const sentences = text.split(".");
  const newSentences = [];

  for (let sentence of sentences) {
    const words = sentence.split(" ");
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      words[randomIndex] = "peko";
    }

    const newSentence = words.join(" ");
    newSentences.push(newSentence);
  }

  const newText = newSentences.join(". ");
  return newText;
}

// create a webserver. Ping the webserver using another website to make the discord bot run 24/7
const express = require('express')
const app = express();
const port = 8080

app.get('/', (req, res) => res.send('Something Something.'))
app.listen(port, () => { console.log(`Your app is listening a http://localhost:${port}`) })

client.login(process.env['TOKEN'])


