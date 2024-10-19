const axios = require("axios")

const { HONKAI_IMPACT3_API, USERAGENT, COOKIE, DEVICE_ID } = require("../../../configs/app.config")
const { set_request_headers } = require("../../../utils/utils")
const { send_notification } = require("../../notification/notification")

async function claim() {
    let message = "Honkai Impact 3d \n"
    try {
        const headers = set_request_headers(COOKIE, USERAGENT, DEVICE_ID)

        const hoyolabResponse = await axios.post(HONKAI_IMPACT3_API, {}, { headers });
        const responseJson = hoyolabResponse.data;
        const bannedCheck = responseJson.data?.gt_result?.is_risk;

        console.log(responseJson)

        if (responseJson?.message === "OK") message += "Status: Claimed \n"
        if (bannedCheck) message += "Error: Capcha Error"
    } catch (error) {
        console.log(error)
        message += error.message
    } finally {
        await send_notification(message)
    }
}

module.exports = {
    claim
}