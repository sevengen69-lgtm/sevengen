"use server";

import { QuoteRequestSchema } from "@/lib/schemas";
import { z } from "zod";

export async function submitQuoteRequest(values: z.infer<typeof QuoteRequestSchema>) {
  const validatedFields = QuoteRequestSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dados inválidos." };
  }
  
  // Here you would typically send an email, save to a database, etc.
  // For this example, we'll just log it and return success.
  console.log("New Quote Request:", validatedFields.data);

  return { success: "Orçamento solicitado com sucesso! Entraremos em contato em breve." };
}
