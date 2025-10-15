"use server";

import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { QuoteRequestSchema } from "@/lib/schemas";

export async function submitQuoteRequest(values: z.infer<typeof QuoteRequestSchema>) {
  const validatedFields = QuoteRequestSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dados inválidos." };
  }

  const { name, email, phone, service, message } = validatedFields.data;

  try {
    const { firestore } = initializeFirebase();
    
    await addDoc(collection(firestore, "quoteRequests"), {
      contactName: name,
      contactEmail: email,
      contactPhone: phone,
      serviceType: service,
      description: message,
      requestDate: serverTimestamp(),
      status: "pending",
    });

    return { success: "Orçamento solicitado com sucesso! Entraremos em contato em breve." };

  } catch (error) {
    console.error("Erro ao salvar solicitação de orçamento:", error);
    return { error: "Ocorreu um erro ao enviar sua solicitação. Tente novamente." };
  }
}
