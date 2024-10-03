require("dotenv").config()

module.exports = {
    VIEWPORT_WIDTH: 1280,
    VIEWPORT_HEIGHT: 880,
    HEADLESS: true,
    NIKKE: true,
    HOYOLAB: true,
    GENSHIN_IMPACT: true,
    HONKAI_IMPACT3: true,
    HONKAI_STARRAIL: true,
    ZENLESS_ZONE_ZERO: true,
    USERAGENT: process.env.USERAGENT,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
}