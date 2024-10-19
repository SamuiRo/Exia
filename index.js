const { init } = require("./src/modules/browser/browser.module")
const { send_message_to_telegram, send_notification } = require("./src/modules/notification/notification")
const levelinfinite = require("./src/modules/nikke/levelinfinite")
const { http_genshinimpact, http_honkaistarrail, http_honkaiimpact3, http_zenlesszonezero } = require("./src/modules/hoyolab/index")
const { create_cron_job } = require("./src/utils/utils")

const { NIKKE, GENSHIN_IMPACT, HEADLESS, HONKAI_STARRAIL, ZENLESS_ZONE_ZERO, HONKAI_IMPACT3 } = require("./src/configs/app.config")

async function main() {
    let message = "MAIN: \n"
    try {
        // const context = await init("Exia", HEADLESS)

        // if (NIKKE) await levelinfinite.claim(context)

        if (GENSHIN_IMPACT) {
            create_cron_job('0 13 * * *', http_genshinimpact.claim);
            message += "Genshin Impact cron job scheduled \n"
            console.log("Genshin Impact cron job scheduled");
        }

        if (HONKAI_STARRAIL) {
            create_cron_job('10 13 * * *', http_honkaistarrail.claim);
            message += "Honkai Star Rail cron job scheduled \n"
            console.log("Honkai Star Rail cron job scheduled");
        }

        if (HONKAI_IMPACT3) {
            create_cron_job('20 13 * * *', http_honkaiimpact3.claim);
            message += "Honkai Impact 3d cron job scheduled \n"
            console.log("Honkai Impact 3d cron job scheduled");
        }

        if (HONKAI_IMPACT3) {
            create_cron_job('30 13 * * *', http_zenlesszonezero.claim);
            message += "Zenless Zone Zero cron job scheduled \n"
            console.log("Zenless Zone Zero cron job scheduled");
        }

        // if (HONKAI_STARRAIL) await http_honkaistarrail.claim()
        // if (HONKAI_IMPACT3) await http_honkaiimpact3.claim()
        // if (ZENLESS_ZONE_ZERO) await http_zenlesszonezero.claim()

    } catch (error) {
        console.log(error)
        send_message_to_telegram("MAIN: " + error.message)
    } finally {
        send_notification(message)
    }
}

main()