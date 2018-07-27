"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = __importStar(require("request-promise-native"));
var perf_hooks_1 = require("perf_hooks");
var fs_1 = require("fs");
var os_1 = require("os");
var async = __importStar(require("async"));
var newFile = fs_1.createWriteStream('./performance_log.csv', { autoClose: false });
newFile.on('close', function () {
    process.exit();
});
newFile.write("iteration, duration (ms)" + os_1.EOL);
var obs = new perf_hooks_1.PerformanceObserver(function (items) {
    var m = items.getEntries()[0];
    console.log(m);
    newFile.write(m.name + ", " + Math.round(m.duration) + os_1.EOL, function () { });
});
obs.observe({ entryTypes: ['measure'] });
// const url = 'http://localhost:5000/issues-f88d1/us-central1/helloWorld';
var url = 'https://us-central1-issues-f88d1.cloudfunctions.net/helloWorld';
function timeout(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.timeout = timeout;
function fakeSendRequest(iteration) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(iteration);
                    perf_hooks_1.performance.mark("start-" + iteration);
                    return [4 /*yield*/, timeout((Math.random() + 1) * 1000)];
                case 1:
                    _a.sent();
                    perf_hooks_1.performance.mark("end-" + iteration);
                    perf_hooks_1.performance.measure("" + iteration, "start-" + iteration, "end-" + iteration);
                    perf_hooks_1.performance.clearMarks("start-" + iteration);
                    perf_hooks_1.performance.clearMarks("end-" + iteration);
                    return [2 /*return*/];
            }
        });
    });
}
function sendRequest(iteration) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log(iteration);
                    perf_hooks_1.performance.mark("start-" + iteration);
                    return [4 /*yield*/, request.get({
                            url: url,
                            resolveWithFullResponse: true,
                            qs: { invocationNumber: iteration }
                        })];
                case 1:
                    res = _a.sent();
                    if (res.statusCode !== 200) {
                        throw new Error("Function failed, not status 200");
                        perf_hooks_1.performance.clearMarks("start-" + iteration);
                    }
                    if (res.body.includes('COLDSTART')) {
                        perf_hooks_1.performance.mark("end-" + iteration);
                        perf_hooks_1.performance.measure("" + iteration, "start-" + iteration, "end-" + iteration);
                        perf_hooks_1.performance.clearMarks("end-" + iteration);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1.message);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function loadTest(iterations, limit) {
    if (limit === void 0) { limit = 60; }
    return __awaiter(this, void 0, void 0, function () {
        var iterationsArray, i;
        return __generator(this, function (_a) {
            try {
                console.log("LoadTest is getting up and running.");
                iterationsArray = [];
                for (i = 1; i <= iterations; i++) {
                    iterationsArray.push(i);
                }
                console.log(iterationsArray.length);
                async.eachLimit(iterationsArray, limit, function (v, cb) {
                    sendRequest(v).then(function () { return cb(); });
                }, function (err) {
                    if (err) {
                        console.log("Something went wrong: " + err);
                        newFile.close();
                    }
                    else {
                        console.log("DONE doing load test");
                        newFile.close();
                    }
                });
            }
            catch (error) {
                console.log("Something went wrong: " + error.message);
            }
            return [2 /*return*/];
        });
    });
}
// loadTest(10000, 50);
