"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import poster from "@/shared/post"; // Import the poster function

const loginSchema = z.object({
  Email: z.string().email("Please enter a valid email address"),
  Password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
    const [error, setError] = useState<string | null>(null)
  
  // const router = useRouter();
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  
  const {
    register,
    // handleSubmit,
    // formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return; // Prevent further execution
    }

    // Validate password length
    if (Password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return; // Prevent further execution
    }

    try {
      const data = await poster('api/login', { Email, Password });
      console.log("User data:", data);

      // Assuming the API returns a success status and some kind of auth token or user data
      if (data) {
        // Set authentication cookies or perform any other success-related logic
        const cookieMaxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day
        
        // Redirect to the home page
        router.push("/");
      } else {
        // If login was not successful, retrieve the error message
        // setError(data.message || "An unexpected error occurred");
        setError( "invalide email or password");

      }
    } catch (err) {
      // setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setError( "An unexpected error occurred");

    } finally {
      setIsLoading(false);
    }
} 
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Content Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Logo and Title */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image src="/placeholder.svg" alt="LWIE Logo" width={48} height={48} className="mx-auto" />
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

            <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" 
            onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    {...register("Email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}

                    className="appearance-none rounded-none relative block w-full px-3 py-2 
                    border border-gray-300 dark:border-gray-700 placeholder-gray-500 
                    dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md 
                    focus:outline-none focus:ring-teal-500 focus:border-teal-500 
                    focus:z-10 sm:text-sm bg-white dark:bg-gray-800 mb-4"
                    placeholder="Email address"
                  />
                  
                   
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    {...register("Password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={Password}

                    onChange={(e) => setPassword(e.target.value)}

                    autoComplete="current-password"
                    className="appearance-none rounded-none relative block w-full 
                    px-3 py-2 border border-gray-300 dark:border-gray-700
                     placeholder-gray-500 dark:placeholder-gray-400 text-gray-900
                      dark:text-white rounded-b-md focus:outline-none focus:ring-teal-500
                       focus:border-teal-500 focus:z-10 sm:text-sm bg-white
                        dark:bg-gray-800 mb-4"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register("rememberMe")}
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-teal-600
                   hover:text-teal-500">Forgot your password?</Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 
                  border border-transparent text-sm font-medium rounded-full
                   text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2
                    focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
                </button>
              </div>
            </form>
          

          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-teal-600
             hover:text-teal-500">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  ) 
}

// function register(arg0: string): import("react").JSX.IntrinsicAttributes & import("react").ClassAttributes<HTMLInputElement> & import("react").InputHTMLAttributes<HTMLInputElement> {
//   throw new Error("Function not implemented.");
// }
