const { init } = require("./src/modules/browser/browser.module")
const { NIKKE, HOYOLAB } = require("./src/configs/app.config")

async function browser_init() {
    try {
        const context = await init("Exia", false)

        if (NIKKE) {
            const levelinfinite = await context.newPage();
            await levelinfinite.goto("https://pass.levelinfinite.com/rewards")
        }

        if (HOYOLAB) {
            const hoyolab = await context.newPage()
            await hoyolab.goto("https://www.hoyolab.com/home")
        }
    } catch (error) {
        console.log(error)
    }
}

browser_init()
