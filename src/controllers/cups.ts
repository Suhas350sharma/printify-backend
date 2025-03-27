import { exec } from 'child_process';
import fs from 'fs';
import { UserModel } from '../db';

type PrintOptions = {
  copies: number;
  colorMode: string; 
  duplex: string;    
  paperSize: number; 
};

// Universal CUPS printer name (configured in CUPS admin)
const PRINTER_NAME = 'hacfy'; 

export async function printFile(filePath: string, options: PrintOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    // Build CUPS command flags from options
    const flags = [
      `-d ${PRINTER_NAME}`,
      `-n ${options.copies}`,
      `-o ColorModel=${options.colorMode === 'color' ? 'RGB' : 'Black'}`,
      `-o sides=${options.duplex === 'double' ? 'two-sided-long-edge' : 'one-sided'}`,
      `-o number-up=${options.paperSize}`, 
    ].join(' ');

    const command = `lp ${flags} ${filePath}`;
    

    exec(command, (error, stdout) => {
      if (error) return reject('Print failed');
      
      // Extract CUPS job ID from stdout
      const jobId = stdout.match(/request id is (\S+)/)?.[1] || '';
      resolve(jobId);

      // try{
      //   const newentry=new UserModel({})
      // }
      
      // Cleanup file after printing
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete:', filePath);
      });
    });
  });
}