export const logger = {
    panic (userMsg: string, internalMsg: string) {
        console.error('\x1b[31m', `ERROR__: ${userMsg}.\n ${internalMsg}`);
        process.exitCode = 9;
        process.exit();
    },
    error (userMsg: string, internalMsg: string) {
        console.error('\x1b[31m', `ERROR__: ${userMsg}.\n ${internalMsg}`);
    },
    warn (userMsg: string, internalMsg: string) {
        console.warn('\x1b[33m', `WARN__: ${userMsg}.\n ${internalMsg}`);
    },
    dir (...data: any) {
        console.dir(data, {colors: true, depth: 3})
    },
    log(...data: any) {
        console.log('\x1b[92m', `LOG__: `, data);
    }
}


process.on('exit', (code) => console.warn('\x1b[33m', `WARN__: Process exit with code: ${code}`));