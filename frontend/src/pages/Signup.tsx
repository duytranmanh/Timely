import { SignupForm } from "@/components/SignUpForm"

export default function Signup() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Timely</h1>
        <SignupForm />
      </div>
    </div>
  )
}
