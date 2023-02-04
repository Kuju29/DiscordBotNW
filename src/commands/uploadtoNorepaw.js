const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require('axios');
const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload-noRespawn")
    .setDescription("upload file .mp3 to noRespawn")
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("File .mp3 only").setRequired(true)
    ),
  async execute(interaction) {
    handleFileJoin(interaction);
  },
};

async function handleFileJoin(interaction) {
  const attachment = interaction.options.getAttachment("file");
  if (!attachment) return interaction.reply("No file attached.");
  if (attachment.name.endsWith(".mp3")) {
    const directory = "./files";
    const filepath = path.join(directory, "noRespawn.mp3");
    if (fs.existsSync(filepath)) {
      fs.unlink(filepath, (err) => {
        if (err) throw err;
      });
    }
    
    const url = attachment.attachment;
    downloadFile(url, filepath).then(() => { interaction.reply(`Upload file \`noRespawn.mp3\` to \`join\` successfully.`); }).catch((err) => console.log(err));
    
  } else {
    return interaction.reply("Only .mp3 files are allowed.");
  }
}

async function downloadFile(url, filepath) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });

  response.data.pipe(fs.createWriteStream(filepath));
}