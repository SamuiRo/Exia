const { send_message_to_telegram } = require("../modules/notification/notification")
const { sleep } = require("../utils/utils")

// const { } = require("./honkaistarrail.selectors")

const url = "https://act.hoyolab.com/bbs/event/signin/hkrpg/e202303301540311.html?act_id=e202303301540311&hyl_auth_required=true&hyl_presentation_style=fullscreen&utm_source=hoyolab&utm_medium=tools&utm_campaign=checkin&utm_id=6&lang=en-us&bbs_theme=light&bbs_theme_device=1"

async function claim(context) {
    const message = {}
    let page
    try {
        page = await context.newPage()

        await page.goto(url, {
            waitUntil: "domcontentloaded",
        })
        await sleep(5000)

        console.log("loaded")

        const checked_stats = await get_honkai_checked_statistics(page)
        console.log(checked_stats)

        message.checked = checked_stats.checked_days
        message.missed = checked_stats.missed_days


        const active_day_selector = await get_active_day_element(page)
        const xpath = await get_active_day_element_xpath(page)

        await sleep(1000)

        console.log(active_day_selector)
        console.log(xpath)
        await page.click(xpath)

        console.log("Clicked")
        await sleep(5000)

        await page.waitForSelector("body > div.m-modal.m-dialog.components-pc-assets-__dialog_---common-dialog---MuR1Sk.components-pc-assets-__dialog_---common-dialog-sea---1XveKg > div.m-dialog-wrapper > div.m-dialog-body > div.components-pc-assets-__dialog_---dialog-body---1SieDs")
        const modal = await page.$("body > div.m-modal.m-dialog.components-pc-assets-__dialog_---common-dialog---MuR1Sk.components-pc-assets-__dialog_---common-dialog-sea---1XveKg > div.m-dialog-wrapper > div.m-dialog-body > div.components-pc-assets-__dialog_---dialog-body---1SieDs")

        try {
            const modal_text = await modal.innerText()
            message.text = modal_text
        } catch (error) {
            console.log(error)
        }

        try {
            const tommorow_reward_element = await modal.$("body > div.m-modal.m-dialog.components-pc-assets-__dialog_---common-dialog---MuR1Sk.components-pc-assets-__dialog_---common-dialog-sea---1XveKg > div.m-dialog-wrapper > div.m-dialog-body > div.components-pc-assets-__dialog_---dialog-body---1SieDs > div.components-pc-assets-__dialog_---sign-content---1PRShr > div")
            message.tommorow_reward = await tommorow_reward_element.innerText()
        } catch (error) {
            console.log(error)
        }

        await send_message_to_telegram(JSON.stringify(message))
    } catch (error) {
        console.log(error)
        send_message_to_telegram("Error while claiming Honkai SrarRail Daily")
    }
}

async function get_active_day_element(page) {
    try {
        const selector = await page.evaluate(() => {
            const container = document.querySelector(
                'body > div > div.components-pc-assets-__home_---scroller---ZF2lsm > div.components-pc-assets-__main-module_---wrapper---3O78Rf > div.components-pc-assets-__main-module_---main-module---3jY8-Z > div > div.components-pc-assets-__prize-list_---prize-list---3s4FAb.components-pc-assets-__prize-list_---prize-list-sea---3CblUM'
            );

            if (!container) return null;

            const elements = container.querySelectorAll('*');

            for (let element of elements) {
                const backgroundImage = window.getComputedStyle(element).backgroundImage;
                if (backgroundImage.includes('https://upload-static.hoyoverse.com/event/2023/04/21/5ccbbab8f5eb147df704e16f31fc5788_6285576485616685271.png')) {
                    // Повертаємо селектор елемента
                    return element.tagName.toLowerCase() + (element.id ? `#${element.id}` : '') +
                        (element.className ? `.${element.className.split(' ').join('.')}` : '');
                }
            }

            return null; // Якщо не знайдено
        });

        return selector
    } catch (error) {
        console.log(error)
        return null
    }
}

async function get_active_day_element_xpath(page) {
    try {
        const xpath = await page.evaluate(() => {
            const container = document.querySelector(
                'body > div > div.components-pc-assets-__home_---scroller---ZF2lsm > div.components-pc-assets-__main-module_---wrapper---3O78Rf > div.components-pc-assets-__main-module_---main-module---3jY8-Z > div > div.components-pc-assets-__prize-list_---prize-list---3s4FAb.components-pc-assets-__prize-list_---prize-list-sea---3CblUM'
            );

            if (!container) return null;

            const elements = container.querySelectorAll('*');

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const backgroundImage = window.getComputedStyle(element).backgroundImage;
                if (backgroundImage.includes('https://upload-static.hoyoverse.com/event/2023/04/21/5ccbbab8f5eb147df704e16f31fc5788_6285576485616685271.png')) {
                    // Генеруємо XPath на основі позиції елемента в списку
                    const index = i + 1;
                    return `(${container.tagName.toLowerCase()}/*)[${index}]`;
                }
            }

            return null;
        });

        return xpath
    } catch (error) {
        console.log(error)
    }
}

async function get_honkai_checked_statistics(page) {
    try {
        const checked_days_element = await page.$("body > div > div.components-pc-assets-__home_---scroller---ZF2lsm > div.components-pc-assets-__main-module_---wrapper---3O78Rf > div.components-pc-assets-__main-module_---main-module---3jY8-Z > div > div.components-pc-assets-__main-module_---header---3hMHBC.components-pc-assets-__main-module_---header-sea---1D_UPV > div:nth-child(1) > p.components-pc-assets-__main-module_---day---3Q5I5A.day")
        const checked_days = await checked_days_element.innerText()

        const missed_days_element = await page.$("body > div > div.components-pc-assets-__home_---scroller---ZF2lsm > div.components-pc-assets-__main-module_---wrapper---3O78Rf > div.components-pc-assets-__main-module_---main-module---3jY8-Z > div > div.components-pc-assets-__main-module_---header---3hMHBC.components-pc-assets-__main-module_---header-sea---1D_UPV > div.components-pc-assets-__main-module_---resign-area---289ngd > p")
        const missed_days = await missed_days_element.innerText()

        return { checked_days, missed_days }
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    claim
}

