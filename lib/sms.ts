require('dotenv').config();
import btoa from 'btoa';
import axios from 'axios';
import https from 'https';

import { env } from '@/env'

const api_key = env.SMS_API;
const secret_key = env.SMS_SECRET;
const content_type = 'application/json';
const source_addr = env.SMS_SENDER;

console.log(api_key)
console.log(secret_key)
console.log(content_type)
console.log(source_addr)
console.log(env.SMS_URL)


const SMSOptions = {
    headers: {
        'Content-Type': content_type,
        Authorization: 'Basic ' + btoa(api_key + ':' + secret_key),
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
};

function SMSDispatch() {
  axios
    .post(
      "https://apisms.beem.africa/v1/send",
      {
        source_addr: "INFO",
        schedule_time: "",
        encoding: 0,
        message: "Hello World",
        recipients: [
          {
            recipient_id: 1,
            dest_addr: "255659860313",
          },
        ],
      },
      {
        headers: {
          "Content-Type": content_type,
          Authorization: "Basic " + btoa(api_key + ":" + secret_key),
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    )
    .then((response) => console.log(response, api_key + ":" + secret_key))
    .catch((error) => console.error(error.response.data));
}

SMSDispatch();

export default SMSDispatch;