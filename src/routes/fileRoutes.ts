import  {Router } from 'express';
import { usermiddleware } from '../middlewares/userMiddleware';
import { processFiles, uploadfiles } from '../controllers/filesController';

const FileRouter =Router();

//@ts-ignore
FileRouter.post("/uploadfiles",uploadfiles,processFiles);

export default FileRouter;