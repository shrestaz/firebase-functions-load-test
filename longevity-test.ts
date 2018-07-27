import { runChildProcess } from "./run-child-process";
import { timeout } from './load-test';
import * as request from 'request-promise-native';
import { performance } from 'perf_hooks';

const baseUrl = 'your-base-url';

async function mainScript() {
    try {
        runChildProcess('firebase', ['deploy', '--only', 'functions:testLongevity']);
        await timeout(2000);
        // Wait 2 seconds, and make the function hot!
        let response = await request.get(`${baseUrl}/testLongevity`);
        console.log(`Function is HOT! Response was: ${response}`);
        // Now delete the function!
        runChildProcess('firebase', ['functions:delete', 'testLongevity', '--force']);
        performance.mark('delete_request')
        // Send request to the functions url, until the the response is not "I am alive!"
        while (response.includes('I am alive!')) {
            response = await request.get(`${baseUrl}/testLongevity`);
            await timeout(2000);
        }
        performance.mark('actually_deleted');
        performance.measure('Instance was alive after function deletion for', 'delete_request', 'actually_deleted');
    } catch (error) {
        console.log(`Unexpected error ${error.message}`);
    }
}

mainScript();
