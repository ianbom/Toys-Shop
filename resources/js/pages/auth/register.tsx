import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="name"
                                    className="text-[12px] font-extrabold tracking-[0.14em] text-[#1A1A1A] uppercase"
                                >
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    className="h-[52px] w-full border border-[#CFCFCF] bg-white px-4 text-[15px] font-medium text-[#1A1A1A] outline-none placeholder:text-[#9A9A9A] focus:border-[#1A1A1A]"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-0"
                                />
                            </div>

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
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="h-[52px] w-full border border-[#CFCFCF] bg-white px-4 text-[15px] font-medium text-[#1A1A1A] outline-none placeholder:text-[#9A9A9A] focus:border-[#1A1A1A]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="password"
                                    className="text-[12px] font-extrabold tracking-[0.14em] text-[#1A1A1A] uppercase"
                                >
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create your password"
                                    className="h-[52px] rounded-none border-[#CFCFCF] bg-white pr-12 text-[15px] font-medium text-[#1A1A1A] placeholder:text-[#9A9A9A] focus-visible:border-[#1A1A1A] focus-visible:ring-0"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="password_confirmation"
                                    className="text-[12px] font-extrabold tracking-[0.14em] text-[#1A1A1A] uppercase"
                                >
                                    Confirm password
                                </label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm your password"
                                    className="h-[52px] rounded-none border-[#CFCFCF] bg-white pr-12 text-[15px] font-medium text-[#1A1A1A] placeholder:text-[#9A9A9A] focus-visible:border-[#1A1A1A] focus-visible:ring-0"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-[52px] w-full rounded-none bg-[#F58220] text-[12px] font-extrabold tracking-[0.16em] text-white uppercase shadow-none hover:bg-[#E67312] focus-visible:ring-0"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <p className="text-center text-sm font-medium text-[#707070]">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-bold text-[#F58220] no-underline hover:text-[#E67312]"
                            >
                                Log In
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create Account',
    description:
        'Set up your AxeGear account with your details below.',
    breadcrumbs: [
        { label: 'Home', href: home() },
        { label: 'Account' },
        { label: 'Register' },
    ],
    heroImage: {
        src: '/img/login-image.png',
        alt: 'AxeGear athlete wearing mirrored performance eyewear',
    },

};

