/**
 * A script to register discord slash commands in the discord server
 **/

const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')

const commands = [
  {
    name: 'help',
    description: 'See all the commands',
  },
  {
    name: 'showquotes',
    description: 'Show all the quotes',
  },
  {
    name: 'addquote',
    description: 'Add a quote',
    options: [
      {
        name: 'quote',
        description: 'Enter your quote',
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },
  {
    name: 'getquote',
    description: 'Get a quote',
    options: [
      {
        name: 'index',
        description: 'Enter index number to get a specific quote from the list',
        type: ApplicationCommandOptionType.Number,
        required: false,
      }
    ]
  },
  {
    name: 'deletequote',
    description: 'Delete a quote',
    options: [
      {
        name: 'index',
        description: 'Enter index number to delete a specific quote from the list',
        type: ApplicationCommandOptionType.Number,
        required: true,
      }
    ]
  },
  {
    name: 'bark',
    description: 'Make Fuuko bark',
  },
  {
    name: 'pekofy',
    description: 'Pekofy a sentence or multiple sentences',
    options: [
      {
        name: 'text',
        description: 'Enter text',
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },

];

const rest = new REST({ version: '10' }).setToken(process.env['TOKEN']);

(async () => {
  try {
    console.log("registering slash commands");
    await rest.put(
      Routes.applicationCommands(process.env['CLIENT_ID']),
      { body: commands }
    )
    console.log("registered slash commands");
  } catch (error) {
    console.log(error)
  }
})();