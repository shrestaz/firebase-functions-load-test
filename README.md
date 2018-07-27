## Load testing: Cloud Functions for Firebase

This project is created to load test a function and observe the cold start of its instance(s). [Performance Timing API](https://nodejs.org/api/perf_hooks.html#perf_hooks_class_performanceobserver) is used to calculate the spin up time of the cold starts.

The output is then written to a CSV file, aptly name `performance_log.csv` in the projects root directory, which then can be used to map in charts for better visualization.

### Pre-requisites:
- [Node](https://www.npmjs.com/get-npm)
- Typescript `npm i -g typescript`
- Firebase tools `npm install -g firebase-tools`
- [Create and deploy (if not already)  a **Hello World** Cloud Function for Firebase](https://medium.com/@carlosazaustre/how-to-create-your-first-cloud-function-for-firebase-17711831a67c)

To run the project:
1. Clone the project: `git clone https://github.com/shrestaz/firebase-functions-load-test`
2. Navigate into the folder.
3. Exeute `npm i`
4. Input your Firebase project-id in url variable (line 21) of load-test.ts 
`const url = 'https://us-central1-<project-id>.cloudfunctions.net/helloWorld';`
6. `npm run -s start`