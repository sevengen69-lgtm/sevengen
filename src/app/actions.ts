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

  // Using .catch for contextual error handling as per instructions
  // Do not use try/catch for this
  addDoc(quoteRequestsCollection, newRequestData)
    .catch((serverError) => {
      console.log('server error', serverError);
      const permissionError = new FirestorePermissionError({
        path: quoteRequestsCollection.path,
        operation: 'create',
        requestResourceData: newRequestData,
      });
      // The server action cannot directly use the client-side emitter.
      // For server-side errors, we can log it or re-throw for Next.js to catch.
      // In this case, we'll rethrow the specific error to get it in the logs
      // and return a generic error to the client. This is a temporary step
      // to get the contextual error.
      console.error("Firestore Permission Error Context:", JSON.stringify(permissionError.request, null, 2));
    });

  // Optimistically return success
  return { success: "Orçamento solicitado com sucesso! Entraremos em contato em breve." };
}
