const { CronJob } = require("cron")

async function sleep(time) {
    return new Promise((resolve, reject) => {
        console.log("Wait for " + time)
        setTimeout(() => {
            resolve(time)
        }, time)
    })
}

function set_request_headers(cookie, useragent, device_id = null) {
    const headers = {
        Cookie: cookie,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'sec-ch-ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'User-Agent': useragent,
        'Content-Type': 'application/json;charset=UTF-8',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'x-rpc-platform': '4',
        'sec-ch-ua-mobile': '?0',
        'x-rpc-app_version': '',
        'x-rpc-device_name': '',
        'sec-ch-ua-platform': '"Windows"',
        'Referer': 'https://act.hoyolab.com/',
        'Origin': 'https://act.hoyolab.com',
    }

    if (device_id) headers["x-rpc-device_id"] = device_id

    return headers
}

function create_cron_job(cronTime, task, timeZone = 'Europe/Kiev') {
    return new CronJob(cronTime, async () => {
        try {
            await task();
            console.log(`Task completed successfully: ${task.name}`);
        } catch (error) {
            console.error(`Error in task ${task.name}: ${error.message}`);
        }
    }, null, true, timeZone);
}

function object_to_string(obj) {
    return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
}

module.exports = {
    sleep,
    set_request_headers,
    create_cron_job,
    object_to_string
}