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
exports.uploadfiles = void 0;
exports.processFiles = processFiles;
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const fs_1 = __importDefault(require("fs"));
const printqueue_1 = require("./printqueue");
const db_1 = require("../db");
// Temporary storage for uploaded files
const upload = (0, multer_1.default)({ dest: "temp_uploads/" });
exports.uploadfiles = upload.array("files");
function processFiles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }
            let totalNumberOfSheets = 0;
            let totalAmount = 0;
            let processedFiles = [];
            let errors = [];
            for (const file of req.files) {
                const { originalname, path: filePath } = file;
                // Required fields from req.body
                const { colorMode, side, papersize, numberofcopies } = req.body;
                // Validate required fields
                if (!colorMode || !side || !papersize || !numberofcopies) {
                    errors.push({ filename: originalname, message: "Missing required fields" });
                    continue; // Skip this file and process others
                }
                // Convert numberofcopies to a number
                const copies = Number(numberofcopies);
                if (isNaN(copies) || copies <= 0) {
                    errors.push({ filename: originalname, message: "Invalid number of copies" });
                    continue;
                }
                // Read PDF and count pages
                try {
                    const numberOfSheets = yield countNumberOfPages(filePath, side, papersize);
                    totalNumberOfSheets += numberOfSheets;
                    // Calculate cost
                    const amount = countAmount(numberOfSheets, colorMode, copies);
                    totalAmount += amount;
                    yield printqueue_1.printQueue.enqueue({
                        filePath,
                        options: {
                            copies: Number(numberofcopies),
                            colorMode,
                            duplex: side,
                            paperSize: papersize,
                        },
                    });
                    console.log("from filecontroller");
                    processedFiles.push({
                        filename: originalname,
                        documentUrl: filePath, // Store temp path for later processing
                        colorMode,
                        side,
                        papersize,
                        numberofcopies: copies,
                        numberofpages: numberOfSheets,
                        price: amount,
                    });
                    // Delete temp file after 3 minutes
                    setTimeout(() => {
                        fs_1.default.unlink(filePath, (err) => {
                            if (err)
                                console.error(`Error deleting file ${originalname}:`, err);
                        });
                    }, 180000); // 3 minutes
                    // const newentry=new FilesModel({
                    //     userId:req.user,
                    //       files:[{
                    //         filename: originalname,
                    //         documentUrl: filePath, // Store temp path for later processing
                    //         colorMode:colorMode,
                    //         side:side,
                    //         papersize:papersize,
                    //         numberofcopies: copies,
                    //         numberofpages: numberOfSheets,
                    //         totalprice: amount,
                    //       }]
                    //    })
                    //    newentry.save()
                    //        .then(() => console.log("File entry saved successfully"))
                    //        .catch(err => console.error("Error saving file entry:", err));
                }
                catch (error) {
                    errors.push({ filename: originalname, message: "Error processing PDF file" });
                }
            }
            // If all files had errors, return failure response
            if (processedFiles.length === 0) {
                return res.status(400).json({ message: "No valid files processed", errors });
            }
            const UserId = req.user || "";
            const newEntry = new db_1.FilesModel({ userId: UserId, files: processedFiles, TotalAmount: totalAmount, TotalSheets: totalNumberOfSheets });
            yield newEntry.save();
            console.log("new file entry file creted for this user");
            StoresAllFilesOfUser(UserId, processedFiles);
            res.status(200).json({
                message: "Files processed successfully",
                totalSheets: totalNumberOfSheets,
                totalAmount: totalAmount,
                files: processedFiles, // Send temp paths to frontend
                errors, // Send list of files that had issues
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    });
}
//  Function to calculate number of sheets
function countNumberOfPages(filePath, side, papersize) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pdfData = yield (0, pdf_parse_1.default)(fs_1.default.readFileSync(filePath));
            let numberOfPages = pdfData.numpages || 0;
            let numberOfSheets = numberOfPages;
            // If double-sided printing, 2 pages per sheet
            if (side === "double") {
                numberOfSheets = Math.ceil(numberOfPages / 2);
            }
            // Adjust for paper size
            switch (papersize) {
                case 1:
                    numberOfSheets = numberOfPages;
                    break;
                case 2:
                    numberOfSheets = Math.ceil(numberOfSheets / 2);
                    break;
                case 4:
                    numberOfSheets = Math.ceil(numberOfSheets / 4);
                    break;
            }
            return numberOfSheets;
        }
        catch (error) {
            throw new Error("Error processing PDF file");
        }
    });
}
//  Function to calculate total price
function countAmount(numberOfSheets, colorMode, numberOfCopies) {
    const costPerSheet = colorMode === "color" ? 5 : 1;
    return numberOfSheets * costPerSheet * numberOfCopies;
}
function StoresAllFilesOfUser(userId, processedFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingEntry = yield db_1.UserfilesModel.findOne({ userId });
        console.log(existingEntry);
        if (existingEntry) {
            existingEntry.files.push(...processedFiles);
            yield existingEntry.save();
            console.log("Files appended to existing entry");
        }
        else {
            const newEntry = new db_1.UserfilesModel({ userId, files: processedFiles });
            console.log(newEntry);
            yield newEntry.save();
            ;
            console.log("new file Entry created");
        }
    });
}
