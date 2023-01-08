const { SlashCommandBuilder } = require("@discordjs/builders");

const con = require("../db.js");

const { comboLookup } = require("../logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sorgu")
    .setDescription("mernis 2023.")
    .addStringOption((option) =>
      option
        .setName("ad")
        .setDescription("The name to search for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("soyadıı")
        .setDescription("The namee to search for.")
        .setRequired(true)
    ) 
 .addStringOption((option) =>
      option
        .setName("il")
        .setDescription("The nameee to search for.")
        .setRequired(true)
    ),
   
  async execute(interaction) {
    const username = interaction.user.username;
    const discriminator = interaction.user.discriminator;
    const user = username + "#" + discriminator;

    const domain = interaction.options.getString("ad");
    const soyadı = interaction.options.getString("soyadıı");
    const ill = interaction.options.getString("il");
    const combolist = interaction.options.getBoolean("combolist");

    comboLookup(domain);
    console.log("Finding combos for: " + domain + " for: " + user);
    // find the any domain that contains the domain
  con.query(`SELECT * FROM 101m WHERE ADI = '${domain}' AND SOYADI = '${soyadı}' AND NUFUSIL = '${ill}'`,
  // con.query(
    //  `SELECT * FROM 101m WHERE ADI ${domain}`,
      [interaction.guild.id],
      (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          // make username:password
          let combos = "";
          if (combolist) {
            combos = result.map(
              (combo) => combo.SOYADI + ":" + combo.DOGUMTARIHI
            );
          } else {
            combos = result.map(
              (combo) =>
                "TC: " +
                combo.TC +
                "\nADI: " +
                combo.ADI +				
                "\nSOYADI: " +
                combo.SOYADI +
                "\nDOGUM TARIHI: " +
                combo.DOGUMTARIHI +
                "\nNUFUSIL: " +
                combo.NUFUSIL+
                "\nILCE: " +
                combo.NUFUSILCE +
                "\nANNESININ ADI: " +
                combo.ANNEADI +
                "\nANNETC: " +
                combo.ANNETC+
                "\nBABAADI: " +
                combo.BABAADI+	
                "\nBABA TCSI: " +
                combo.BABATC+					
                "\n"
            );
          }

          combos = combos.join("\n");
          interaction.reply({
            files: [
              {
                attachment: Buffer.from(combos),
                name: "combos.txt",
              },
            ],
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: ":x: No combos found.",
            ephemeral: true,
          });
        }
      }
    );
  },
};