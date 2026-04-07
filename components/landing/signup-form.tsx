"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSuccess(true);
    setEmail("");
    setIsLoading(false);
    
    // Optional: Reset success message after some time
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="bg-white dark:bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-[#42b983] px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
          {isSuccess ? (
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">ขอบคุณที่สนใจ!</h2>
              <p className="text-lg leading-8 text-white/90">เราจะส่งข่าวสารไปหาคุณที่ {email} เมื่อพร้อมเปิดให้บริการ</p>
              <Button 
                variant="outline" 
                className="mt-8 bg-white/20 border-white text-white hover:bg-white/30"
                onClick={() => setIsSuccess(false)}
              >
                กลับ
              </Button>
            </div>
          ) : (
            <>
              <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                พร้อมจะเป็นส่วนหนึ่งของอาณาจักร Dino หรือยัง?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-white/90">
                ลงชื่อไว้เลยเพื่อรับสิทธิ์ในการทดสอบ Beta และรับ Gacha Ticket ฟรีเมื่อเปิดตัว!
              </p>
              <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="กรอกอีเมลของคุณ"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="min-w-0 flex-auto rounded-full bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/20 sm:text-sm sm:leading-6 focus:ring-[#42b983] border-white/20"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-none rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-[#42b983] shadow-sm hover:bg-slate-100"
                >
                  {isLoading ? "กำลังส่ง..." : "รับข่าวสาร"}
                </Button>
              </form>
            </>
          )}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#ffffff" />
                <stop offset={1} stopColor="#42b983" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
