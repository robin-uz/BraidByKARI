import { PasswordResetForm } from '@/components/auth/password-reset-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen">
      {/* Password Reset Form Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <PasswordResetForm />
      </div>
      
      {/* Hero Section Column */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-purple-700 to-pink-600 items-center justify-center">
        <div className="max-w-md text-white p-8">
          <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
          <p className="mb-6">
            We'll help you get back into your account. Simply provide your
            email address and we'll send you a secure link to reset your password.
          </p>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm">
              For security reasons, your reset link will expire after 24 hours. 
              If you need any assistance, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}