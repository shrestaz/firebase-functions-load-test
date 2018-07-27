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
'use strict';

import * as functions from 'firebase-functions'

let executions = 0;

export const helloWorld = functions.https.onRequest((request, response) => {
    executions++;
    const invocationNumber = request.query.invocationNumber;
    const info = `Execution number: '${executions}', invocationNumber: ${invocationNumber}` 
    console.log(info);
    if (executions === 1) {
        response.send(`COLDSTART. ${info}`);
        return;
    }
    response.send(`Hello from Firebase, execution number: ${executions}!\n\n`);
});
