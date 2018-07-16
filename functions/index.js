// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const {
  dialogflow,
  BasicCard,
  Image,
  SimpleResponse,
} = require('actions-on-google');
const functions = require('firebase-functions');
const fetch = require('isomorphic-fetch');

const URL = 'https://gist.githubusercontent.com/planetoftheweb/98f35786733c8cccf81e/raw/f3dad774ed1fe20b36011b1261bb392ee759b867/data.json';
const BACKGROUND_IMAGE = 'https://lh3.googleusercontent.com/t53m5nzjMl2B_9Qhwc81tuwyA2dBEc7WqKPlzZJ9syPUkt9VR8lu4Kq8heMjJevW3GVv9ekRWntyqXIBKEhc5i7v-SRrTan_=s688';

const app = dialogflow({debug: true});

// Retrieve data from the external API.
app.intent('Default Welcome Intent', (conv) => {
  // Note: Moving this fetch call outside of the app intent callback will
  // cause it to become a global var (i.e. it's value will be cached across
  // function executions).
  return fetch(URL)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((json) => {
      const len = json.length;
      const artist = json[Math.floor(Math.random() * len)];
      conv.close(new SimpleResponse({
        text: artist.name,
        speech: artist.bio,
      }));
      if (conv.screen) {
        conv.close(new BasicCard({
          text: artist.name,
          title: artist.bio,
          image: new Image({
            url: BACKGROUND_IMAGE,
            alt: 'DevRel Quote',
          }),
        }));
      }
    });
});

exports.quotes = functions.https.onRequest(app);
