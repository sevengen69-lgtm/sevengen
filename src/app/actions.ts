
"use server";

import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeFirebaseServer } from "@/firebase/server-init";
import { QuoteRequestSchema } from "@/lib/schemas";
import { FirestorePermissionError } from "@/firebase/errors";

export async function submitQuoteRequest(values: z.infer<typeof QuoteRequestSchema>) {
  const validatedFields = QuoteRequestSchema.safeParse(values);

  if (!validatedFields.success) {
    // This is a validation error, not a permission error. Return it to the client.
    return { error: "Dados inválidos." };
  }

  const { name, email, phone, service, message } = validatedFields.data;

  try {
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

    // Use .catch on the addDoc promise to handle Firestore-specific errors.
    await addDoc(quoteRequestsCollection, newRequestData)
      .catch((serverError) => {
        // This is where a permission error from Firestore will be caught.
        // We re-throw our custom, contextual error.
        throw new FirestorePermissionError({
          path: quoteRequestsCollection.path,
          operation: 'create',
          requestResourceData: newRequestData,
        });
      });

    // If addDoc is successful, return success message.
    return { success: "Orçamento solicitado com sucesso! Entraremos em contato em breve." };

  } catch (error) {
    // This will catch the re-thrown FirestorePermissionError or other unexpected errors.
    if (error instanceof FirestorePermissionError) {
      // For server-side errors, we can log it or re-throw for Next.js to catch.
      // Re-throwing is the correct pattern to let Next.js's error boundary handle it.
      // This will display the detailed error in the development console.
      throw error;
    }

    // Handle other potential errors during initialization or processing.
    console.error("An unexpected error occurred in submitQuoteRequest:", error);
    return { error: "Ocorreu um erro inesperado no servidor." };
  }
}
