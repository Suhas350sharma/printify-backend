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
Object.defineProperty(exports, "__esModule", { value: true });
exports.printQueue = void 0;
const cups_1 = require("./cups");
class PrintQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }
    enqueue(job) {
        this.queue.push(job);
        this.processNext();
    }
    processNext() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isProcessing || this.queue.length === 0)
                return;
            this.isProcessing = true;
            const job = this.queue.shift();
            try {
                console.log(job.filePath);
                yield (0, cups_1.printFile)(job.filePath, job.options);
            }
            catch (error) {
                console.error('Failed job:', job.filePath, error);
            }
            finally {
                this.isProcessing = false;
                this.processNext(); // Process next job
            }
        });
    }
}
exports.printQueue = new PrintQueue();
