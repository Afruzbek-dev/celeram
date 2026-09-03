import { NextResponse } from "next/server";
import { validateTelegramInitData } from "../../../../src/telegram/auth";
export async function POST(request: Request) { try { const { initData } = await request.json(); const token=process.env.TELEGRAM_BOT_TOKEN; if(!token||typeof initData!=="string") return NextResponse.json({error:"Telegram auth is not configured"},{status:503}); return NextResponse.json({user:validateTelegramInitData(initData,token)}); } catch { return NextResponse.json({error:"Telegram authentication failed"},{status:401}); } }

