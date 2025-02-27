"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ModeToggle";
import BgImage from '@/assets/Money.jpg';
import { useRouter } from 'next/navigation'; // Update the import to use next/navigation

export default function Home() {
  const router = useRouter(); // Initialize useRouter

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Here you would add your login logic, such as API calls or form validation
    router.push('/niveshnow'); // Navigate to the NiveshNow page
  };

  return (
    <div className="flex-col">
      <div className="h-[100vh] w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="relative hidden bg-muted lg:block">
          <div className="flex absolute top-0 left-0 z-10 m-4 text-white text-4xl font-bold">
            NiveshNow
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
            <ModeToggle />
          </div>
          <div className="mx-auto grid w-[350px] gap-6 mt-32">
            <form className="grid gap-4" onSubmit={handleLogin}>
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
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
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Link href="/expertlogin">
                <Button variant="outline" className="w-full">
                  Expert Login
                </Button>
              </Link>
            </form>
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
  );
}
