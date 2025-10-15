"use server";

import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { QuoteRequestSchema } from "@/lib/schemas";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export async function submitQuoteRequest(values: z.infer<typeof QuoteRequestSchema>) {
  const validatedFields = QuoteRequestSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dados inválidos." };
  }

  const { name, email, phone, service, message } = validatedFields.data;
  const { firestore } = initializeFirebase();
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

  addDoc(quoteRequestsCollection, newRequestData)
    .then(() => {
        // The success case is handled on the client.
        // We can resolve the promise if needed, but for now, we do nothing here.
    })
    .catch((error) => {
        console.error("Erro ao salvar solicitação de orçamento:", error);
        
        const permissionError = new FirestorePermissionError({
            path: quoteRequestsCollection.path,
            operation: 'create',
            requestResourceData: newRequestData,
        });

        // Emit the contextual error for debugging
        errorEmitter.emit('permission-error', permissionError);
    });

    // Return success immediately for optimistic UI update.
    // The client-side toast will handle the user notification.
    return { success: "Orçamento solicitado com sucesso! Entraremos em contato em breve." };
}
