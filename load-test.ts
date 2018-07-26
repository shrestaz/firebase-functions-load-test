import * as request from 'request-promise-native';
import { Response } from 'request';
import { performance, PerformanceObserver } from 'perf_hooks';
import { createWriteStream } from 'fs';
import { EOL } from 'os';
import * as async from 'async';

const newFile = createWriteStream('./performance_log.csv', { autoClose: false });
newFile.on('close', () => {
    process.exit();
});
newFile.write(`iteration, duration (ms)${EOL}`);

const obs = new PerformanceObserver((items) => {
    const m = items.getEntries()[0];
    console.log(m);
    newFile.write(`${m.name}, ${Math.round(m.duration)}${EOL}`, () => { });
});
obs.observe({ entryTypes: ['measure'] });

// const url = 'http://localhost:5000/issues-f88d1/us-central1/helloWorld';
const url = 'https://us-central1-issues-f88d1.cloudfunctions.net/helloWorld';

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fakeSendRequest(iteration: number): Promise<void> {
    console.log(iteration);
    performance.mark(`start-${iteration}`);
    await timeout((Math.random() + 1) * 1000);
    performance.mark(`end-${iteration}`);
    performance.measure(`${iteration}`, `start-${iteration}`, `end-${iteration}`);
    performance.clearMarks(`start-${iteration}`);
    performance.clearMarks(`end-${iteration}`);
}

async function sendRequest(iteration: number): Promise<void> {
    try {
        console.log(iteration);
        performance.mark(`start-${iteration}`);
        const res = await request.get({
            url,
            resolveWithFullResponse: true,
            qs: { invocationNumber: iteration }
        }) as Response;
        if (res.statusCode !== 200) {
            throw new Error(`Function failed, not status 200`);
            performance.clearMarks(`start-${iteration}`)
        }
        if (res.body.includes('COLDSTART')) {
            performance.mark(`end-${iteration}`);
            performance.measure(`${iteration}`, `start-${iteration}`, `end-${iteration}`);
            performance.clearMarks(`end-${iteration}`);
        }
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

async function loadTest(iterations: number, limit = 60) {
    try {
        console.log(`LoadTest is getting up and running.`);
        const iterationsArray: number[] = [];
        for (let i = 1; i <= iterations; i++) {
            iterationsArray.push(i);
        }
        console.log(iterationsArray.length);
        async.eachLimit(iterationsArray, limit, (v, cb) => {
            sendRequest(v).then(() => cb());
        }, (err) => {
            if (err) {
                console.log(`Something wen't wrong: ${err}`);
                newFile.close();
            } else {
                console.log(`DONE doing load test`);
                newFile.close();
            }
        });
    } catch (error) {
        console.log(`Something wen't wrong: ${error.message}`);
    }
}

loadTest(10000, 50);
