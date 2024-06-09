import { NextRequest, NextResponse } from "next/server";

export async function middleware(
  request: NextRequest
): Promise<void | NextResponse> {
  const verify: string | undefined = request.cookies.get("token")?.value;
  if (verify == "invalid" || !verify) {
    console.log("not logged in");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  console.log(verify);
}

export const config = {
  matcher: "/watchparty/:path*",
};
