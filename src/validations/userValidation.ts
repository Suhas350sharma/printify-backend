import { z } from 'zod';

export const Uservalidaion=z.object({
    username:z.string().min(3).max(255),
    PhNo:z.string().length(10),
    email:z.string().email().min(6).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
    password:z.string().min(6).max(255),
});
