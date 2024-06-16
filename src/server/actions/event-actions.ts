"use server";

export async function createEvent(data: FormData) {
  console.log(data.get("pay"));
}
