import { Request, Response } from "express";
export declare const createThread: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllThreads: (_: Request, res: Response) => Promise<void>;
export declare const getThreadById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=thread.controller.d.ts.map