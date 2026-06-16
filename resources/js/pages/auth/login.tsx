import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { redirect as googleRedirect } from '@/routes/auth/google';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Masuk" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        {status && (
                            <div className="border border-[#F7B06A] bg-[#FFF3E8] px-4 py-3 text-sm font-semibold text-[#1A1A1A]">
                                {status}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="email"
                                    className="text-[12px] font-extrabold tracking-[0.14em] text-[#1A1A1A] uppercase"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    className="h-[52px] w-full border border-[#CFCFCF] bg-white px-4 text-[15px] font-medium text-[#1A1A1A] outline-none placeholder:text-[#9A9A9A] focus:border-[#1A1A1A]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2.5">
                                <div className="flex items-center justify-between gap-4">
                                    <label
                                        htmlFor="password"
                                        className="text-[12px] font-extrabold tracking-[0.14em] text-[#1A1A1A] uppercase"
                                    >
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-[11px] font-bold tracking-[0.12em] text-[#F58220] no-underline uppercase hover:text-[#E67312]"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="h-[52px] rounded-none border-[#CFCFCF] bg-white pr-12 text-[15px] font-medium text-[#1A1A1A] placeholder:text-[#9A9A9A] focus-visible:border-[#1A1A1A] focus-visible:ring-0"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-4 rounded-none border-[#1A1A1A] data-[state=checked]:border-[#F58220] data-[state=checked]:bg-[#F58220]"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium text-[#2E2E2E]"
                                >
                                    Remember me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-[52px] w-full rounded-none bg-[#F58220] text-[12px] font-extrabold tracking-[0.16em] text-white uppercase shadow-none hover:bg-[#E67312] focus-visible:ring-0"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign in
                            </Button>
                        </div>

                        <div className="relative py-1 text-center">
                            <div className="absolute inset-x-0 top-1/2 border-t border-[#E5E5E5]" />
                            <span className="relative bg-white px-4 text-sm font-medium text-[#707070]">
                                or
                            </span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-[52px] w-full rounded-none border-[#1A1A1A] bg-white text-[12px] font-extrabold tracking-[0.12em] text-[#1A1A1A] uppercase shadow-none hover:bg-[#1A1A1A] hover:text-white"
                            tabIndex={1}
                            onClick={() => {
                                window.location.href = googleRedirect.url();
                            }}
                        >
                            <svg
                                aria-hidden="true"
                                className="size-4"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M21.35 11.1h-9.18v2.98h5.29c-.23 1.6-1.6 4.69-5.29 4.69-3.18 0-5.78-2.63-5.78-5.88S8.99 7 12.17 7c1.81 0 3.03.77 3.72 1.44l2.53-2.44c-1.62-1.51-3.72-2.44-6.25-2.44C7.01 3.56 2.82 7.74 2.82 12.9s4.19 9.34 9.35 9.34c5.39 0 8.96-3.79 8.96-9.13 0-.61-.07-1.08-.15-1.55z"
                                />
                            </svg>
                            Sign in with Google
                        </Button>

                        {canRegister && (
                            <p className="text-center text-sm font-medium text-[#707070]">
                                Don't have an account?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-bold text-[#F58220] no-underline hover:text-[#E67312]"
                                >
                                    Create Account
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Log In',
    description:
        'Welcome back. Enter your details below to access your AxeGear account.',
    breadcrumbs: [
        { label: 'Home', href: home() },
        { label: 'Account' },
        { label: 'Login' },
    ],
    heroImage: {
        src: '/img/login-image.png',
        alt: 'AxeGear athlete wearing mirrored performance eyewear',
    },
};

