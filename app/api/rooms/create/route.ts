import { nanoid } from "nanoid";

export async function GET() {
  const id = nanoid();

  return new Response(id);
}
