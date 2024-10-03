const { init } = require("./src/modules/browser/browser.module")
const { send_message_to_telegram } = require("./src/modules/notification/notification")
const levelinfinite = require("./src/modules/nikke/levelinfinite")
const { genshinimpact } = require("./src/modules/hoyolab/index")

const { NIKKE, GENSHIN_IMPACT } = require("./src/configs/app.config")

async function main() {
    try {
        const context = await init("Exia", false)

        if (NIKKE) await levelinfinite.claim(context)

        if (GENSHIN_IMPACT) await genshinimpact.claim(context)

    } catch (error) {
        console.log(error)
        send_message_to_telegram("MAIN: " + error.message)
    }
}

main()