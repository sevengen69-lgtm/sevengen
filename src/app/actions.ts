"use server";

import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeFirebaseServer } from "@/firebase/server-init";
import { QuoteRequestSchema } from "@/lib/schemas";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export async function submitQuoteRequest(values: z.infer<typeof QuoteRequestSchema>) {
  const validatedFields = QuoteRequestSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dados inválidos." };
  }

  const { name, email, phone, service, message } = validatedFields.data;
  const { app } = await initializeFirebaseServer();
  const firestore = getFirestore(app);
  const quoteRequestsCollection = collection(firestore, "quoteRequests");

  const newRequestData = {
      contactName: name,
      contactEmail: email,
      contactPhone: phone,
      serviceType: service,
      description: message,
      requestDate: serverTimestamp(),
      status: "pending",
    };

  try {
    await addDoc(quoteRequestsCollection, newRequestData);
    return { success: "Orçamento solicitado com sucesso! Entraremos em contato em breve." };
  } catch (error) {
    console.error("Erro ao salvar solicitação de orçamento:", error);
    // Even if we don't use the client-side emitter here,
    // we should return a structured error for the client to handle.
    return { error: "Ocorreu uma falha ao enviar sua solicitação." };
  }
}
