"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * LOGIN ACTION
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Redirect back to login with an error message in the URL
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  // Clear cache and send user to the dashboard
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * SIGNUP ACTION
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This 'data' object is what your SQL Trigger reads!
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  // Supabase usually requires email confirmation by default.
  // We send them to a "Check your email" page or back to login with a note.
  redirect("/login?message=Check your email to confirm your account");
}

/**
 * SIGNOUT ACTION
 */
export async function signOut() {
  const supabase = await createClient();
  
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Server signout error:", err);
  }

  revalidatePath("/", "layout");
}
