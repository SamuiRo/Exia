require("dotenv").config()

module.exports = {
    VIEWPORT_WIDTH: 1280,
    VIEWPORT_HEIGHT: 880,
    HEADLESS: false,
    NIKKE: true,
    HOYOLAB: true,
    GENSHIN_IMPACT: true,
    HONKAI_IMPACT3: true,
    HONKAI_STARRAIL: true,
    ZENLESS_ZONE_ZERO: true,
    GENSHIN_IMPACT_API: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=en-us&act_id=e202102251931481",
    HONKAI_STARRAIL_API: "https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202303301540311",
    HONKAI_IMPACT3_API: "https://sg-public-api.hoyolab.com/event/mani/sign?lang=en-us&act_id=e202110291205111",
    ZENLESS_ZONE_ZERO_API: "https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign",
    USERAGENT: process.env.USERAGENT,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    COOKIE: process.env.COOKIE,
    DEVICE_ID: process.env.DEVICE_ID,
}