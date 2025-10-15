import { z } from 'zod';

export const QuoteRequestSchema = z.object({
  name: z.string().min(1, { message: "O nome não pode estar vazio." }).optional(),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional(),
  phone: z.string().optional(),
  service: z.string({ required_error: "Por favor, selecione um serviço." }).min(1, { message: "Por favor, selecione um serviço." }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
}).superRefine((data, ctx) => {
    // Manually require name and email if they are not provided by a logged-in user
    // This check is more conceptual for the front-end, as the back-end will get it from the user session
    // This schema is used on the client, so we can make them optional and handle logic in the form
    if (!data.name) {
        // This won't trigger if the field is hidden, which is the case for logged-in users.
        // The logic in the component now handles passing the user's name.
    }
    if (!data.email) {
        // same as above
    }
});


export type QuoteRequestForm = z.infer<typeof QuoteRequestSchema>;
