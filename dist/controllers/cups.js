"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printFile = printFile;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
// Universal CUPS printer name (configured in CUPS admin)
const PRINTER_NAME = 'epson';
function printFile(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("afgdgvdav");
        return new Promise((resolve, reject) => {
            // Build CUPS command flags from options
            const flags = [
                `-d ${PRINTER_NAME}`,
                `-n ${options.copies}`,
                `-o ColorModel=${options.colorMode === 'color' ? 'RGB' : 'Black'}`,
                `-o sides=${options.duplex === 'double' ? 'two-sided-long-edge' : 'one-sided'}`,
                `-o media=${options.paperSize}`
            ].join(' ');
            const command = `lp ${flags} ${filePath}`;
            (0, child_process_1.exec)(command, (error, stdout) => {
                var _a;
                if (error)
                    return reject('Print failed');
                // Extract CUPS job ID from stdout
                const jobId = ((_a = stdout.match(/request id is (\S+)/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
                resolve(jobId);
                // Cleanup file after printing
                fs_1.default.unlink(filePath, (err) => {
                    if (err)
                        console.error('Failed to delete:', filePath);
                });
            });
        });
    });
}
