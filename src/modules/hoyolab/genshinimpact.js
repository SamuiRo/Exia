const { send_message_to_telegram } = require("../notification/notification")
const { sleep } = require("../../utils/utils")

const { ACTIVE_DAY_ELEMENT, REWARDS_MODAL, REWARDS_MODAL_CONGRATS_MESSAGE, REWARDS_MODAL_SENDED_MESSAGE, REWARDS_MODAL_TOMMOROW_MESSAGE } = require("./genshinimpact.selectors")

async function claim(context) {
    const message = {}
    let page
    try {
        page = await context.newPage()

        await page.goto("https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481&hyl_auth_required=true&hyl_presentation_style=fullscreen&utm_source=hoyolab&utm_medium=tools&lang=en-us&bbs_theme=light&bbs_theme_device=1", {
            waitUntil: "domcontentloaded", // Чекаємо, поки всі запити завершаться
        })
        await sleep(5000)

        const active_day_element = await page.$(ACTIVE_DAY_ELEMENT)

        if (active_day_element) {
            message.reward = await active_day_element.innerText()
            await active_day_element.click();

            await sleep(5000)

            await page.waitForSelector(REWARDS_MODAL)

            const modal = await page.$(REWARDS_MODAL)

            try {
                const modal_text = await modal.innerText()
                message.text = modal_text
            } catch (error) {
                console.log(error)
            }

            try {
                const congrats_message_element = await modal.$(REWARDS_MODAL_CONGRATS_MESSAGE)
                const congrats_message = await congrats_message_element.innerText()
                message.congrats_message = congrats_message
            } catch (error) {
                console.log(error)
            }
            try {
                const rewards_sended_message_element = await modal.$(REWARDS_MODAL_SENDED_MESSAGE)
                const rewards_sended_message = await rewards_sended_message_element.innerText()
                message.rewards_sended = rewards_sended_message
            } catch (error) {
                console.log(error)
            }
            try {
                const tommorow_reward_message_element = await modal.$(REWARDS_MODAL_TOMMOROW_MESSAGE)
                const tommorow_reward_message = await tommorow_reward_message_element.innerText()
                message.tommorow_reward = tommorow_reward_message
            } catch (error) {
                console.log(error)
            }

            await sleep(10000)
        } else {
            message.reward = "Claimed"
        }

        const checked_stats = await get_genshin_checked_statistics(page)

        message.checked = checked_stats.checked_days
        message.missed = checked_stats.missed_days

    } catch (error) {
        console.log(error)
        send_message_to_telegram("Genshin: " + error.message)
    } finally {
        // if (page) await page.close()
        await send_message_to_telegram(JSON.stringify(message))
    }
}

async function get_genshin_checked_statistics(page) {
    try {
        const checked_days_element = await page.$("body > div > div.components-home-assets-__home_---home-content---1hcp1A > div > div.components-home-assets-__sign-content-test_---sign---3dbEui > div > div.components-home-assets-__sign-content-test_---sign-header---1D0KPJ > div.components-home-assets-__sign-content-test_---header-left---FkSAZA > div.components-home-assets-__sign-content-test_---day---r8ZbT6.day")
        const checked_days = await checked_days_element.innerText()

        const missed_days_element = await page.$("body > div > div.components-home-assets-__home_---home-content---1hcp1A > div > div.components-home-assets-__sign-content-test_---sign---3dbEui > div > div.components-home-assets-__sign-content-test_---sign-header---1D0KPJ > div.components-home-assets-__sign-content-test_---header-right---2noBH7 > div.components-home-assets-__sign-content-test_---miss-info---3yTxDm")
        const missed_days = await missed_days_element.innerText()

        return { checked_days, missed_days }
    } catch (error) {
        console.log(error)
    }
}

const urls = {
    genshin: "https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481&hyl_auth_required=true&hyl_presentation_style=fullscreen&utm_source=hoyolab&utm_medium=tools&lang=en-us&bbs_theme=light&bbs_theme_device=1",
    honkai_star: "https://act.hoyolab.com/bbs/event/signin/hkrpg/e202303301540311.html?act_id=e202303301540311&hyl_auth_required=true&hyl_presentation_style=fullscreen&utm_source=hoyolab&utm_medium=tools&utm_campaign=checkin&utm_id=6&lang=en-us&bbs_theme=light&bbs_theme_device=1",
    zenless: "https://act.hoyolab.com/bbs/event/signin/zzz/e202406031448091.html?act_id=e202406031448091&hyl_auth_required=true&hyl_presentation_style=fullscreen&utm_campaign=checkin&utm_id=8&utm_medium=tools&utm_source=hoyolab&lang=en-us&bbs_theme=light&bbs_theme_device=1",
    honkai_impact3: "https://act.hoyolab.com/bbs/event/signin-bh3/index.html?act_id=e202110291205111&utm_source=hoyolab&utm_medium=tools&bbs_theme=light&bbs_theme_device=1",
}

module.exports = {
    claim
}