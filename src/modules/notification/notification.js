const axios = require("axios")
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID } = require("../../configs/app.config")
const { object_to_string } = require("../../utils/utils")

/**
 * Відправляє повідомлення до Telegram каналу через бота.
 * 
 * @param {string} botToken - Токен вашого Telegram бота.
 * @param {string} chatId - ID каналу або чату, куди буде відправлено повідомлення (формат @channelusername або ID чату).
 * @param {string} message - Текст повідомлення для відправки.
 * @returns {Promise<void>} - Повертає проміс без результату після успішної відправки.
 * @throws {Error} - Кидає помилку, якщо запит не вдається.
 */
async function send_message_to_telegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await axios.post(url, {
            chat_id: TELEGRAM_CHANNEL_ID,
            text: message,
            // parse_mode: 'Markdown', // або 'HTML', якщо потрібно підтримувати форматування HTML
        });

        if (response.data.ok) {
            console.log('Повідомлення успішно відправлено');
        } else {
            throw new Error(`Помилка відправки повідомлення: ${response.data.description}`);
        }
    } catch (error) {
        console.error(`Помилка під час запиту до Telegram API: ${error.message}`);
        // throw error; // Кидає помилку, щоб обробити її у вищих рівнях програми
    }
}

async function send_notification(content) {
    try {
        const message = object_to_string(content)

        await send_message_to_telegram(message)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    send_message_to_telegram,
    send_notification
}