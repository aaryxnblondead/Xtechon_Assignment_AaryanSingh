import { Request, Response } from 'express';
export declare const bookFlight: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBookingHistory: (req: Request, res: Response) => Promise<void>;
export declare const downloadTicket: (req: Request, res: Response) => Promise<void>;
export declare const getWalletBalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelBooking: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=bookingController.d.ts.map