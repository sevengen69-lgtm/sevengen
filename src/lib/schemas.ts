import { z } from 'zod';

export const QuoteRequestSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  phone: z.string().optional(),
  service: z.string({ required_error: "Por favor, selecione um serviço." }).min(1, { message: "Por favor, selecione um serviço." }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
});

export type QuoteRequestForm = z.infer<typeof QuoteRequestSchema>;
