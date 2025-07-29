const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  try {
    const { image, uid } = req.body;
    if (!uid || !image) return res.status(400).send('UID or image missing');

    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64, 'base64');

    await bot.telegram.sendPhoto(uid, { source: imgBuffer });
    res.status(200).send('✅ Image delivered');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Sending error');
  }
}; 
