/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 // code from the tutorial link: https://dialogflow.com/docs/tutorial-build-an-agent/create-fulfillment-using-webhook

'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

// Enter your calendar ID and service account JSON below.
const calendarId = 'pat2ctf3qgvguukr9mm1pqehmc@group.calendar.google.com'; // Example: 6ujc6j6rgfk02cp02vg6h38cs0@group.calendar.google.com
const serviceAccount = {
  "type": "service_account",
  "project_id": "marysbikeshop-5c50d",
  "private_key_id": "03d7f539ac585356b715823e4f15bf6c3dafdadd",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCigKEz1xNo6cRp\nHPYP7ZZzfU5/YS2wvZSrAjLuAWAPBfQ/acH8mIpc3bW4thdJ9o+taxVOZR6M6Twm\nir03vcmCZcCSf65YZFcFRnaw1K988J7FTY8jE/42NF9aZ/3lCXMZ5dd+jdwWXXDl\nzInctY0JUQEHHv5iTZ7QUFxAngk6iLr0P48g76gsOkywrDP/XDPYhYBXJx040+oE\nPRHjoFcnU1dMIbV7eWFDOaeYYoYHZKTOEpQont4536bfbfHy2CCCL01JEGi4jjJG\n4q4ftXpx7fcY1WHJTdsjGazD2Y+Gz0rnc9Ll8Z8C7LNJ8ZDe4IyMHXGVLcvIgnFW\n2rhV8u29AgMBAAECggEABlxrpMaSO29/KFraXdZ4w0MeYuX64GK/21Z+3VFr6Fqk\nJUFSDHadtUHoSTBTjdSwlThOXdDYSLED5rNw1UZ53nh2MZeny2luGX8nH3mvaY5W\n0nzqkb6sGy9p+a4oF9tgATnoTr0s9JvU/ZOdR+i8FqdT0Fx9ul7RWymczKGfgBRm\nNiVScv1BNmoObYiQtylZsCYi1H1rp1/lHKc1HD069RDyttCGitiTYrjrZXfxl9JI\nhLQqabALUkSvEqTrLHrfTHsjFYphFNIJPevAy2//qWPHMd7SuO0Og/SvozIghf4I\n9Pw6GoPLbW8U0J1xC/OGS5glJn5LuOHARz8ZCQobXwKBgQDZfVIYOYgcfqBU3rbj\nr8lozMQJXW4Se5bdCZqquKIWmEC92elmhAmh8qVV95QFBG5qlsClhSe1ft3qYGnD\nTT7L/YxnzB36c6DCy1d/+W1m9Mm+oKS49GYVGLhoU9WQQhZ0MvnclQ2lxsEvvSFH\nkXnY7ByBSr6aMCy0t4AfB7BB+wKBgQC/RsaNtUdLF3UPv+tMfZpvwTxY2TjDp15X\n0+lnrBZdd+cyMVw8bIoQLm/47n4RLnuKYzQmXoU778R1fwL7EMp6AmlLZQo1F4RS\nnq/WTHo0g4i3nWHYwBUYXEa7BDR6jXO0uXhAV25urRNsS8k1ERfdfHISCglR6MYY\naxqjfiU5pwKBgQC7dNfYh2X44W+CF0BduTsJOEzToZLpHVsoA0orUd5rSSmsOXGB\n6dZ/nqvBEBalyG7/Mhaz07QpLENL63PdYOv6WPy2zmkcYKM0op01caBJOD3XL5Eq\n1YRTNK5lRbTylPPTjchsxpAvzcLfSc2waQQz4zaiffEQ5urxjKRCmpbiFwKBgQCY\nRPOTpBhZQxdBrnrWrbbf+GjeIi76Mqb8LArHKUu0pNs8LedLgux17UHeXZ2md+aJ\nSGgfk2dlS36OOspYrAlED99a0djKYypHy2QXqVIvs/aGlZdrQZ6JggwcnUBZv3m5\nCV0de3zCRq4LrFlFEZJ6E7OLgMnilvf8QGc4eBeSSQKBgH21aUXsX9ZHy137mIhB\np74oXUvYF02ZVV5BaiNrAkvd5KQjriJ9AKMCA6MF2nYgIKtHlcLqPtA26us5YwEi\nI782LStwsEvZytwTt6bN7/ddPYwTnFJIQAfUOHN5vfOTmauGaCgbFcnJQl7Otc7H\n6H8HE7zI9/GQ81S6G0b1Xj4a\n-----END PRIVATE KEY-----\n",
  "client_email": "bike-shop-calendar@marysbikeshop-5c50d.iam.gserviceaccount.com",
  "client_id": "108689371194793449384",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/bike-shop-calendar%40marysbikeshop-5c50d.iam.gserviceaccount.com"
}; // The JSON object looks like: { "type": "service_account", ... }

// Set up Google Calendar service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // It enables lib debugging statements

const timeZone = 'America/Denver';  // Change it to your time zone
const timeZoneOffset = '-06:00';         // Change it to your time zone offset

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  function makeAppointment (agent) {
    // Use the Dialogflow's date and time parameters to create Javascript Date instances, 'dateTimeStart' and 'dateTimeEnd',
    // which are used to specify the appointment's time.
    const appointmentDuration = 1;// Define the length of the appointment to be one hour.
    const dateTimeStart = convertParametersDate(agent.parameters.date, agent.parameters.time);
    const dateTimeEnd = addHours(dateTimeStart, appointmentDuration);
    const appointmentTimeString = getLocaleTimeString(dateTimeStart);
    const appointmentDateString = getLocaleDateString(dateTimeStart);
    // Check the availability of the time slot and set up an appointment if the time slot is available on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd).then(() => {
      agent.add(`Got it. I have your appointment scheduled on ${appointmentDateString} at ${appointmentTimeString}. See you soon. Good-bye.`);
    }).catch(() => {
      agent.add(`Sorry, we're booked on ${appointmentDateString} at ${appointmentTimeString}. Is there anything else I can do for you?`);
    });
  }
  let intentMap = new Map();
  intentMap.set('Make Appointment', makeAppointment);  // It maps the intent 'Make Appointment' to the function 'makeAppointment()'
  agent.handleRequest(intentMap);
});

function createCalendarEvent (dateTimeStart, dateTimeEnd) {
  return new Promise((resolve, reject) => {
    calendar.events.list({  // List all events in the specified time period
      auth: serviceAccountAuth,
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there exists any event on the calendar given the specified the time period
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create an event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: 'Vet Appointment',
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd}}
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}

// A helper function that receives Dialogflow's 'date' and 'time' parameters and creates a Date instance.
function convertParametersDate(date, time){
  return new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('-')[0] + timeZoneOffset));
}

// A helper function that adds the integer value of 'hoursToAdd' to the Date instance 'dateObj' and returns a new Data instance.
function addHours(dateObj, hoursToAdd){
  return new Date(new Date(dateObj).setHours(dateObj.getHours() + hoursToAdd));
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this time in English.
function getLocaleTimeString(dateObj){
  return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: timeZone });
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this date in English. 
function getLocaleDateString(dateObj){
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: timeZone });
}