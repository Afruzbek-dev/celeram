import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { validateTelegramInitData } from "./auth";

function signed(token: string) { const params = new URLSearchParams({ auth_date: String(Math.floor(Date.now()/1000)), user: JSON.stringify({id:123,first_name:"Ali",username:"ali"}) }); const data=[...params.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}=${v}`).join("\n"); const secret=createHmac("sha256","WebAppData").update(token).digest(); params.set("hash",createHmac("sha256",secret).update(data).digest("hex")); return params.toString(); }
describe("Telegram init data",()=>{it("accepts valid signed user",()=>expect(validateTelegramInitData(signed("secret"),"secret")).toMatchObject({id:"123",firstName:"Ali"}));it("rejects tampering",()=>expect(()=>validateTelegramInitData(signed("secret").replace("Ali","Eve"),"secret")).toThrow("signature"));});

