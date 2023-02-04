const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require('axios');
const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload-leave")
    .setDescription("upload file .mp3 to leave")
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
    const directory = "./files/leave";
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        if (file.endsWith(".mp3")) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      }
    });

    const url = attachment.attachment;
    const filepath = path.join(directory, attachment.name);
    downloadFile(url, filepath).then(() => { interaction.reply(`Upload file \`${attachment.name}\` to \`leave\` successfully.`); }).catch((err) => console.log(err));
    
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