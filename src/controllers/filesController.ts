import { Request, Response, NextFunction } from "express";
import multer from "multer";
import PdfParse from "pdf-parse";
import fs from "fs";
import { printQueue } from "./printqueue";
import { FilesModel, UserModel,UserfilesModel } from "../db";

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

      const { colorMode, side, papersize, numberofcopies } = req.body;

      // Validate required fields
      if (!colorMode || !side || !papersize || !numberofcopies) {
        errors.push({ filename: originalname, message: "Missing required fields" });
        continue; 
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

        await printQueue.enqueue({ 
          filePath,
          options: {
            copies: Number(numberofcopies),
            colorMode,
            duplex: side,
            paperSize: papersize,
          },
        });

        processedFiles.push({
          filename: originalname,
          documentUrl: filePath, 
          colorMode,
          side,
          papersize,
          numberofcopies: copies,
          numberofpages: numberOfSheets,
          price: amount,
        });

        // Delete temp file after 3 minutes
        setTimeout(() => {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file ${originalname}:`, err);
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
      
      } catch (error) {
        errors.push({ filename: originalname, message: "Error processing PDF file" });
      }
    }
    if (processedFiles.length === 0) {
      return res.status(400).json({ message: "No valid files processed", errors });
    } 

    const UserId=req.user ||"";

    const newEntry=new FilesModel({userId:UserId, files:processedFiles,TotalAmount:totalAmount,TotalSheets:totalNumberOfSheets});
    await newEntry.save();
    console.log("new file entry file creted for this user")
      
    StoresAllFilesOfUser(UserId,processedFiles)
    res.status(200).json({
      message: "Files processed successfully",
      totalSheets: totalNumberOfSheets,
      totalAmount: totalAmount,
      files: processedFiles,
      errors, 
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error});
  }
}

//  Function to calculate number of sheets
async function countNumberOfPages(filePath: string, side: string, papersize: number): Promise<number> {
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
      case 1:
        numberOfSheets=numberOfPages;
        break;
      case 2:
        numberOfSheets = Math.ceil(numberOfSheets / 2);
        break;
      case 4:
        numberOfSheets = Math.ceil(numberOfSheets / 4);
        break;
    }

    return numberOfSheets;
  } catch (error) {
    throw new Error("Error processing PDF file");
  }
}

//  Function to calculate total price
function countAmount(numberOfSheets: number, colorMode: string, numberOfCopies: number): number {
  const costPerSheet = colorMode === "color" ? 5 : 1;
  return numberOfSheets * costPerSheet * numberOfCopies;
}

async function StoresAllFilesOfUser(userId: string, processedFiles:any[]){
  const existingEntry=await UserfilesModel.findOne({userId})
  console.log(existingEntry);
  if(existingEntry){
    existingEntry.files.push(...processedFiles);
    await existingEntry.save();
    console.log("Files appended to existing entry");
  }else{
    const newEntry=new UserfilesModel({userId,files:processedFiles});
    console.log(newEntry);
    await newEntry.save();;
    console.log("new file Entry created");
  }
}