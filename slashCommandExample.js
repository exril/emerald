/** @format */

const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: ["example", "slash", "commands"], // Max is 3
  description: "",
  category: "information",
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],

  options: [
    {
      name: "example_args",
      description: "Example",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "example_args",
      description: "Example",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "example_args",
      description: "Example",
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
    },
    {
      name: "example_args",
      description: "Type",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Create",
          value: "create",
        },
        {
          name: "Delete",
          value: "delete",
        },
      ],
    },
  ],

  execute: async (client, interaction) => {
    //your command code here
    /*examples
    
    @ example embed

    let embed = new client.embed()
      .title(`some title here`)
      .desc(`some description here`)
      .thumb(`Link/URI to thumbnail here`)
      .img(`Link/URI to image here`);

    # can also use native methods like .setTitle .setFooter and so on . . ..



    @ example button (primary)
    let button = new client.button().primary(`customId`, `label`,`emoji`,<disabled : true or false  | defaults to false>)

    @ example button (secondary)
    let button = new client.button()secondary.(`customId`, `label`,`emoji`,<disabled : true or false  | defaults to false>)

    @ example button (success)
    let button = new client.button().success(`customId`, `label`,`emoji`,<disabled : true or false  | defaults to false>)

    @ example button (danger)
    let button = new client.button().danger(`customId`, `label`,`emoji`,<disabled : true or false  | defaults to false>)
    
    @ example button (link)
    let button = new client.button().link(`label`, `uri`).setEmoji(`emoji`)
    */
  },
};
