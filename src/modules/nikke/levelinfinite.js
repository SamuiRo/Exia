const { send_message_to_telegram } = require("../notification/notification")
const { sleep } = require("../../utils/utils")

const { CONGRATULATION_MODAL_OKAY, DAILY_PLAY_GAMES_CLAIMED, DAILY_SIGNIN_IMG_UNCLAIMED, DAILY_SIGNIN_BUTTON } = require("./levelinfinite.selector")

const url = "https://pass.levelinfinite.com/rewards"

async function claim(context) {
    const message = {
        header: "Levelinfinite Claim"
    }
    let page
    try {
        page = await context.newPage()

        await page.goto(url, {
            waitUntil: "domcontentloaded", // Чекаємо, поки всі запити завершаться
        })
        await sleep(5000)

        const modal = await page.$(CONGRATULATION_MODAL_OKAY)
        if (modal) {
            await modal.click()
            await sleep(5000)
        }

        message.balance_before = await get_levelinfinite_statistics(page)

        await sleep(5000)

        const unclaimed = await page.$(DAILY_SIGNIN_IMG_UNCLAIMED);

        if (unclaimed) {
            // Перевіряємо, чи є у цього елементу клас "opacity-100"
            const hasClass = await unclaimed.evaluate((el) => el.classList.contains('opacity-100'));

            if (hasClass) {
                // await imgElement.click(); // Виконуємо клік по елементу
                await page.click(DAILY_SIGNIN_BUTTON)

                await page.waitForSelector(CONGRATULATION_MODAL_OKAY)
                await page.click(CONGRATULATION_MODAL_OKAY)

                message.congrats = "Congratulation +100"
            } else {
                message.dailystatus = "Signin coins received"
                console.log('Елемент не має класу "opacity-100".');
            }
        } else {
            console.log('Елемент <img> із зазначеним src не знайдено.');
        }

        await sleep(3000)

        const play_games = await page.$(DAILY_PLAY_GAMES_CLAIMED)

        message.playstatus = play_games ? "Play reward reseived" : "Play reward not received"

        await sleep(3000)

        message.balance_after = await get_levelinfinite_statistics(page)

        await send_message_to_telegram(JSON.stringify(message))
        await sleep(3000)
    } catch (error) {
        console.log(error)
        // send_message_to_telegram("LI Claim: " + error.message)
    } finally {
        if (page) await page.close()
    }
}

async function get_levelinfinite_statistics(page) {
    try {
        await page.waitForSelector("#app-points > div > div > div > div:nth-child(1) > div.relative.inline-flex.w-full.items-center.justify-center.text-white.h-\\[122px\\].mb-\\[var\\(--dc-40\\)\\] > div.relative.box-border.whitespace-nowrap.text-center.text-\\[color\\:var\\(--color-text-white\\)\\].mr-\\[6px\\].flex.h-full.items-center.pt-\\[16px\\].text-\\[length\\:var\\(--font-size-90\\)\\] > span.absolute.left-0.right-0.cursor-pointer.text-center.\\!font-\\[PoppinsMedium\\]");

        // Отримуємо текст із елемента
        const balance = await page.innerText("#app-points > div > div > div > div:nth-child(1) > div.relative.inline-flex.w-full.items-center.justify-center.text-white.h-\\[122px\\].mb-\\[var\\(--dc-40\\)\\] > div.relative.box-border.whitespace-nowrap.text-center.text-\\[color\\:var\\(--color-text-white\\)\\].mr-\\[6px\\].flex.h-full.items-center.pt-\\[16px\\].text-\\[length\\:var\\(--font-size-90\\)\\] > span.absolute.left-0.right-0.cursor-pointer.text-center.\\!font-\\[PoppinsMedium\\]");

        return balance
    } catch (error) {
        console.log(error)
        send_message_to_telegram("LI Stats: " + error.message)
        return "Could not get an account balance"
    }
}

module.exports = {
    claim
}
