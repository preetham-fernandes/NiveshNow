import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ModeToggle";
import { Package2 } from "lucide-react"
import BgImage from '@/assets/sea-link-2.jpg';

export default function Home() {
  return (
    <div className="flex-col">
      <div className="h-[100vh] w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="relative hidden bg-muted lg:block">
          {/* Floating SCHEDULA text */}
          <div className=" flex absolute top-0 left-0 z-10 m-4 text-black text-4xl font-bold">
            Schedula
          </div>
          <Image
            src={BgImage}
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.5]"
          />
        </div>
        <div className="flex-col items-center justify-center pb-12">
          <div className="flex justify-end m-5">
            <ModeToggle></ModeToggle>
          </div>
          <div className="mx-auto grid w-[350px] gap-6 mt-32">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Link href="/schedula">
                <Button className="w-full">
                  Login
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
