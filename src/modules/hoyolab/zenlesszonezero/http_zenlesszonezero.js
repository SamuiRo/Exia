const axios = require("axios")

const { ZENLESS_ZONE_ZERO_API, USERAGENT, COOKIE, DEVICE_ID } = require("../../../configs/app.config")
const { set_request_headers } = require("../../../utils/utils")
const { send_notification } = require("../../notification/notification")

async function claim() {
    let message = "Zenless Zone Zero \n"
    try {
        const headers = set_request_headers(COOKIE, USERAGENT, DEVICE_ID)

        const hoyolabResponse = await axios.post(ZENLESS_ZONE_ZERO_API, { act_id: "e202406031448091", lang: "en-us" }, { headers });
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