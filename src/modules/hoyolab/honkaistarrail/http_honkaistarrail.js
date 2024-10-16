const axios = require("axios")
const { HONKAI_STARRAIL_API, USERAGENT, COOKIE, DEVICE_ID } = require("../../../configs/app.config")
const { set_request_headers } = require("../../../utils/utils")

async function claim() {
    let message = {}
    try {
        const headers = set_request_headers(COOKIE, USERAGENT, DEVICE_ID)

        const hoyolabResponse = await axios.post(HONKAI_STARRAIL_API, {}, { headers });
        const responseJson = hoyolabResponse.data;
        const bannedCheck = responseJson.data?.gt_result?.is_risk;

        console.log(responseJson)

        if (responseJson?.message === "OK") message.result = "Claimed"
        if (bannedCheck) message.banned = "CAPTCHA ERROR"


        const ifEverythingOK = {
            retcode: 0,
            message: 'OK',
            data: {
                code: '',
                risk_code: 0,
                gt: '',
                challenge: '',
                success: 0,
                is_risk: false
            }
        }

    } catch (error) {
        console.log(error)
        message.error = error.message
    }
}

module.exports = {
    claim
}