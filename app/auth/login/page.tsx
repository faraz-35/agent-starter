import { LoginForm } from "./components";
import { AuthFormWrapper } from "../../common/components";

export default function LoginPage() {
  return (
    <AuthFormWrapper
      title="Sign in to your account"
      description={
        <>
          Or{" "}
          <a
            href="/auth/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </a>
        </>
      }
      footer={
        <div className="space-y-2">
          <a
            href="/auth/terms"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Terms of Service
          </a>
          {" • "}
          <a
            href="/auth/privacy"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Privacy Policy
          </a>
        </div>
      }
    >
      <LoginForm />
    </AuthFormWrapper>
  );
}
