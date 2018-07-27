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
var run_child_process_1 = require("./run-child-process");
var load_test_1 = require("./load-test");
var request = __importStar(require("request-promise-native"));
var perf_hooks_1 = require("perf_hooks");
var baseUrl = 'your-base-url';
function mainScript() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    run_child_process_1.runChildProcess('firebase', ['deploy', '--only', 'functions:testLongevity']);
                    return [4 /*yield*/, load_test_1.timeout(2000)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, request.get(baseUrl + "/testLongevity")];
                case 2:
                    response = _a.sent();
                    console.log("Function is HOT! Response was: " + response);
                    // Now delete the function!
                    run_child_process_1.runChildProcess('firebase', ['functions:delete', 'testLongevity', '--force']);
                    perf_hooks_1.performance.mark('delete_request');
                    _a.label = 3;
                case 3:
                    if (!response.includes('I am alive!')) return [3 /*break*/, 6];
                    return [4 /*yield*/, request.get(baseUrl + "/testLongevity")];
                case 4:
                    response = _a.sent();
                    return [4 /*yield*/, load_test_1.timeout(2000)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 6:
                    perf_hooks_1.performance.mark('actually_deleted');
                    perf_hooks_1.performance.measure('Instance was alive after function deletion for', 'delete_request', 'actually_deleted');
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.log("Unexpected error " + error_1.message);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
mainScript();
