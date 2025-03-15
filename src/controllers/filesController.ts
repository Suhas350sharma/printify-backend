import { Request, Response, NextFunction } from "express";
import multer from "multer";
import PdfParse from "pdf-parse";
import fs from "fs";

// Temporary storage for uploaded files
const upload = multer({ dest: "temp_uploads/" });

export const uploadfiles = upload.array("files");

export async function processFiles(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let totalNumberOfSheets = 0;
    let totalAmount = 0;
    let processedFiles = [];
    let errors = [];

    for (const file of req.files as Express.Multer.File[]) {
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
        const numberOfSheets = await countNumberOfPages(filePath, side, papersize);
        totalNumberOfSheets += numberOfSheets;

        // Calculate cost
        const amount = countAmount(numberOfSheets, colorMode, copies);
        totalAmount += amount;

        processedFiles.push({
          filename: originalname,
          tempPath: filePath, // Store temp path for later processing
          colorMode,
          side,
          papersize,
          numberofcopies: copies,
          numberofpages: numberOfSheets,
          totalprice: amount,
        });

        // Delete temp file after 3 minutes
        setTimeout(() => {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file ${originalname}:`, err);
          });
        }, 180000); // 3 minutes
      } catch (error) {
        errors.push({ filename: originalname, message: "Error processing PDF file" });
      }
    }

    // If all files had errors, return failure response
    if (processedFiles.length === 0) {
      return res.status(400).json({ message: "No valid files processed", errors });
    }

    res.status(200).json({
      message: "Files processed successfully",
      totalSheets: totalNumberOfSheets,
      totalAmount: totalAmount,
      files: processedFiles, // Send temp paths to frontend
      errors, // Send list of files that had issues
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

// ✅ Function to calculate number of sheets
async function countNumberOfPages(filePath: string, side: string, papersize: string): Promise<number> {
  try {
    const pdfData = await PdfParse(fs.readFileSync(filePath));
    let numberOfPages = pdfData.numpages || 0;
    let numberOfSheets = numberOfPages;

    // If double-sided printing, 2 pages per sheet
    if (side === "double") {
      numberOfSheets = Math.ceil(numberOfPages / 2);
    }

    // Adjust for paper size
    switch (papersize) {
      case "A4":
        numberOfSheets=numberOfPages;
      case "1/2A4":
        numberOfSheets = Math.ceil(numberOfSheets / 2);
        break;
      case "1/4A4":
        numberOfSheets = Math.ceil(numberOfSheets / 4);
        break;
    }

    return numberOfSheets;
  } catch (error) {
    throw new Error("Error processing PDF file");
  }
}

// ✅ Function to calculate total price
function countAmount(numberOfSheets: number, colorMode: string, numberOfCopies: number): number {
  const costPerSheet = colorMode === "color" ? 5 : 1;
  return numberOfSheets * costPerSheet * numberOfCopies;
}
