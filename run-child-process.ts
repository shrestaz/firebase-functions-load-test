import { spawnSync } from 'child_process';

/**
 * Read more about spawnSync her:
 * https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
 * @export
 * @param {string} program
 * @param {string[]} args
 * @returns {string}
 */
export function runChildProcess(program: string, args: string[]): string {
    console.log(`runChildProcess is now starting to run program: ${program}, with args: ${JSON.stringify(args)}`);
    const processResult = spawnSync(program, args);
    if (processResult.status === 1) {
        throw new Error(`runChildProcess failed with: ${processResult.stderr.toString()}`);
    }
    return processResult.stdout.toString().trim();
}
