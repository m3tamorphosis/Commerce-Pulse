import { NextResponse } from "next/server";
import { getDashboardMock } from "@/mock/dashboard";
import type { PlatformStatus } from "@/types/dashboard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scenario = searchParams.get("scenario") as PlatformStatus | null;

  await new Promise((resolve) => setTimeout(resolve, 350));

  return NextResponse.json(
    getDashboardMock({
      tiktokStatus: scenario ?? "delayed"
    })
  );
}
