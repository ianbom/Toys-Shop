import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    Home,
    Loader2,
    Lock,
    MapPin,
    Upload,
    User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import ProfileLayout from '@/layouts/profile-layout';
import { dashboard as adminDashboard } from '@/routes/admin';

type UserProp = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    role: string;
    member_since: string | null;
};

type AddressProp = {
    id: number;
    label: string | null;
    recipient_name: string;
    recipient_phone: string;
    province: string;
    city: string;
    district: string;
    subdistrict: string | null;
    postal_code: string;
    full_address: string;
    note: string | null;
    is_default: boolean;
};

type PageProps = {
    defaultAddress: AddressProp | null;
    user: UserProp;
};

export default function MyProfile() {
    const { defaultAddress, user } = usePage<PageProps>().props;
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [profileClientErrors, setProfileClientErrors] = useState<{
        name?: string;
        phone?: string;
    }>({});
    const isAdmin = user.role.toLowerCase() === 'admin';

    const profileForm = useForm<{
        name: string;
        email: string;
        phone: string;
        avatar_url: File | null;
    }>({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        avatar_url: null,
    });

    const submitProfile = (event: React.FormEvent) => {
        event.preventDefault();

        const nextErrors: { name?: string; phone?: string } = {};

        if (profileForm.data.name.trim() === '') {
            nextErrors.name = 'Nama lengkap wajib diisi.';
        }

        if (
            profileForm.data.phone.trim() !== '' &&
            !/^[0-9]+$/.test(profileForm.data.phone)
        ) {
            nextErrors.phone = 'Nomor telepon hanya boleh berisi angka.';
        }

        setProfileClientErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        profileForm.transform((data) => ({
            ...data,
            _method: 'patch',
        }));
        profileForm.post(ProfileController.update['/my-profile'].url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                selectAvatar(null);

                if (avatarInputRef.current) {
                    avatarInputRef.current.value = '';
                }
            },
        });
    };

    const selectAvatar = (file: File | null) => {
        profileForm.setData('avatar_url', file);

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }

        setAvatarPreview(file ? URL.createObjectURL(file) : null);
    };

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [passwordClientErrors, setPasswordClientErrors] = useState<{
        current_password?: string;
        password?: string;
        password_confirmation?: string;
    }>({});
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (event: React.FormEvent) => {
        event.preventDefault();

        const nextErrors: {
            current_password?: string;
            password?: string;
            password_confirmation?: string;
        } = {};

        if (passwordForm.data.current_password.trim() === '') {
            nextErrors.current_password = 'Kata sandi saat ini wajib diisi.';
        }

        if (passwordForm.data.password.trim() === '') {
            nextErrors.password = 'Kata sandi baru wajib diisi.';
        }

        if (passwordForm.data.password_confirmation.trim() === '') {
            nextErrors.password_confirmation =
                'Konfirmasi kata sandi wajib diisi.';
        }

        setPasswordClientErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        passwordForm.put(SecurityController.update.url(), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
            onError: () =>
                passwordForm.reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const avatarSrc = avatarPreview || user.avatar_url;
    const nameError = profileClientErrors.name ?? profileForm.errors.name;
    const phoneError = profileClientErrors.phone ?? profileForm.errors.phone;

    return (
        <ProfileLayout
            title="Pengaturan Profil"
            pageTitle="Pengaturan Profil"
            subtitle="Kelola informasi pribadi dan preferensi akunmu."
            activePath="my-profile"
            breadcrumbs={[
                { label: 'Beranda', href: '/' },
                { label: 'Akun Saya', href: '/my-profile' },
                { label: 'Pengaturan Profil' },
            ]}
        >
            <div className="mb-5 flex flex-col gap-5 border-b border-[#D8D8D8] pb-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-8">
                    <AvatarFrame avatarSrc={avatarSrc} name={user.name} />
                    <div>
                        <h2 className="text-[30px] leading-none font-black tracking-normal text-[#1A1A1A]">
                            {user.name}
                        </h2>
                        <p className="mt-2 text-base font-medium text-[#1A1A1A]">
                            {user.email}
                        </p>
                        {user.member_since && (
                            <p className="mt-2 text-sm font-medium text-[#707070]">
                                Member sejak {user.member_since}
                            </p>
                        )}
                    </div>
                </div>

                {isAdmin && (
                    <Link
                        href={adminDashboard()}
                        className="inline-flex h-10 items-center justify-center border border-[#1A1A1A] px-5 text-sm font-black uppercase hover:bg-[#1A1A1A] hover:text-white"
                    >
                        Dashboard
                    </Link>
                )}
            </div>

            <div className="grid gap-7 xl:grid-cols-[1fr_1fr]">
                <ProfileInfoCard
                    profileForm={profileForm}
                    avatarInputRef={avatarInputRef}
                    avatarSrc={avatarSrc}
                    nameError={nameError}
                    phoneError={phoneError}
                    setProfileClientErrors={setProfileClientErrors}
                    selectAvatar={selectAvatar}
                    submitProfile={submitProfile}
                />

                <div className="grid gap-5">
                    <PasswordCard
                        passwordForm={passwordForm}
                        passwordClientErrors={passwordClientErrors}
                        setPasswordClientErrors={setPasswordClientErrors}
                        submitPassword={submitPassword}
                        showPassword1={showPassword1}
                        showPassword2={showPassword2}
                        showPassword3={showPassword3}
                        setShowPassword1={setShowPassword1}
                        setShowPassword2={setShowPassword2}
                        setShowPassword3={setShowPassword3}
                    />

                    <AddressCard defaultAddress={defaultAddress} />
                </div>
            </div>
        </ProfileLayout>
    );
}

function AvatarFrame({
    avatarSrc,
    name,
}: {
    avatarSrc: string | null;
    name: string;
}) {
    return (
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#CFCFCF] bg-[#F8F8F8] text-[#1A1A1A]">
            {avatarSrc ? (
                <img
                    src={avatarSrc}
                    alt={name}
                    className="h-full w-full rounded-full object-cover"
                />
            ) : (
                <User size={48} strokeWidth={1.5} />
            )}
        </div>
    );
}

function ProfileInfoCard({
    profileForm,
    avatarInputRef,
    avatarSrc,
    nameError,
    phoneError,
    setProfileClientErrors,
    selectAvatar,
    submitProfile,
}: {
    profileForm: ReturnType<
        typeof useForm<{
            name: string;
            email: string;
            phone: string;
            avatar_url: File | null;
        }>
    >;
    avatarInputRef: React.RefObject<HTMLInputElement | null>;
    avatarSrc: string | null;
    nameError?: string;
    phoneError?: string;
    setProfileClientErrors: React.Dispatch<
        React.SetStateAction<{ name?: string; phone?: string }>
    >;
    selectAvatar: (file: File | null) => void;
    submitProfile: (event: React.FormEvent) => void;
}) {
    return (
        <form
            onSubmit={submitProfile}
            className="border border-[#D8D8D8] bg-white px-8 py-6"
        >
            <SectionTitle icon={User} title="Informasi Pribadi" />

            <div className="mt-5 grid gap-4">
                <TextField
                    label="Nama Lengkap"
                    value={profileForm.data.name}
                    onChange={(value) => {
                        profileForm.setData('name', value);
                        setProfileClientErrors((current) => ({
                            ...current,
                            name: undefined,
                        }));
                    }}
                    error={nameError}
                />
                <TextField
                    label="Alamat Email"
                    type="email"
                    value={profileForm.data.email}
                    onChange={(value) => profileForm.setData('email', value)}
                    error={profileForm.errors.email}
                />
                <TextField
                    label="Nomor Telepon"
                    type="tel"
                    value={profileForm.data.phone}
                    onChange={(value) => {
                        profileForm.setData('phone', value.replace(/\D/g, ''));
                        setProfileClientErrors((current) => ({
                            ...current,
                            phone: undefined,
                        }));
                    }}
                    error={phoneError}
                    inputMode="numeric"
                    placeholder="0812-3456-7890"
                />

                <div>
                    <label className="mb-2 block text-sm font-black">
                        Foto Avatar{' '}
                        <span className="font-medium">(opsional)</span>
                    </label>
                    <div className=" sm:items-center">
   
                        <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            className="grid min-h-[76px] place-items-center border border-dashed border-[#1A1A1A] bg-white px-5 text-center transition-colors hover:border-[#F58220] hover:text-[#F58220]"
                        >
                            <span className="flex items-center gap-3 text-sm font-black">
                                <Upload size={24} strokeWidth={1.7} />
                                Klik untuk mengunggah
                            </span>
                            <span className="text-xs font-medium text-[#707070]">
                                atau seret file ke sini
                            </span>
                        </button>
                    </div>
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) =>
                            selectAvatar(event.target.files?.[0] ?? null)
                        }
                        className="sr-only"
                    />
                    {profileForm.errors.avatar_url && (
                        <p className="mt-2 text-xs font-bold text-[#C81E1E]">
                            {profileForm.errors.avatar_url}
                        </p>
                    )}
                    <p className="mt-2 text-sm font-medium text-[#707070]">
                        JPG, PNG, atau WEBP. Maks 2MB.
                    </p>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_0.82fr]">
                    <button
                        type="submit"
                        disabled={profileForm.processing}
                        className="inline-flex h-12 items-center justify-center gap-2 bg-[#F58220] px-6 text-sm font-black text-white transition-colors hover:bg-[#E67312] disabled:bg-[#CFCFCF] disabled:text-[#707070]"
                    >
                        {profileForm.processing && (
                            <Loader2 size={16} className="animate-spin" />
                        )}
                        Simpan Perubahan
                    </button>
                    <button
                        type="button"
                        onClick={() => profileForm.reset()}
                        className="h-12 border border-[#1A1A1A] bg-white px-6 text-sm font-black hover:bg-[#1A1A1A] hover:text-white"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </form>
    );
}

function PasswordCard({
    passwordForm,
    passwordClientErrors,
    setPasswordClientErrors,
    submitPassword,
    showPassword1,
    showPassword2,
    showPassword3,
    setShowPassword1,
    setShowPassword2,
    setShowPassword3,
}: {
    passwordForm: ReturnType<
        typeof useForm<{
            current_password: string;
            password: string;
            password_confirmation: string;
        }>
    >;
    passwordClientErrors: {
        current_password?: string;
        password?: string;
        password_confirmation?: string;
    };
    setPasswordClientErrors: React.Dispatch<
        React.SetStateAction<{
            current_password?: string;
            password?: string;
            password_confirmation?: string;
        }>
    >;
    submitPassword: (event: React.FormEvent) => void;
    showPassword1: boolean;
    showPassword2: boolean;
    showPassword3: boolean;
    setShowPassword1: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPassword2: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPassword3: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <form
            onSubmit={submitPassword}
            className="border border-[#D8D8D8] bg-white px-8 py-6"
        >
            <SectionTitle icon={Lock} title="Ubah Kata Sandi" />
            <div className="mt-5 grid gap-4">
                <PasswordField
                    label="Kata Sandi Saat Ini"
                    show={showPassword1}
                    onToggle={() => setShowPassword1((current) => !current)}
                    value={passwordForm.data.current_password}
                    onChange={(value) => {
                        passwordForm.setData('current_password', value);
                        setPasswordClientErrors((current) => ({
                            ...current,
                            current_password: undefined,
                        }));
                    }}
                    error={
                        passwordClientErrors.current_password ??
                        passwordForm.errors.current_password
                    }
                    autoComplete="current-password"
                />
                <PasswordField
                    label="Kata Sandi Baru"
                    show={showPassword2}
                    onToggle={() => setShowPassword2((current) => !current)}
                    value={passwordForm.data.password}
                    onChange={(value) => {
                        passwordForm.setData('password', value);
                        setPasswordClientErrors((current) => ({
                            ...current,
                            password: undefined,
                        }));
                    }}
                    error={
                        passwordClientErrors.password ??
                        passwordForm.errors.password
                    }
                    autoComplete="new-password"
                />
                <PasswordField
                    label="Konfirmasi Kata Sandi Baru"
                    show={showPassword3}
                    onToggle={() => setShowPassword3((current) => !current)}
                    value={passwordForm.data.password_confirmation}
                    onChange={(value) => {
                        passwordForm.setData('password_confirmation', value);
                        setPasswordClientErrors((current) => ({
                            ...current,
                            password_confirmation: undefined,
                        }));
                    }}
                    error={
                        passwordClientErrors.password_confirmation ??
                        passwordForm.errors.password_confirmation
                    }
                    autoComplete="new-password"
                />
                <button
                    type="submit"
                    disabled={passwordForm.processing}
                    className="mt-1 inline-flex h-12 items-center justify-center gap-2 bg-[#F58220] px-6 text-sm font-black text-white transition-colors hover:bg-[#E67312] disabled:bg-[#CFCFCF] disabled:text-[#707070]"
                >
                    {passwordForm.processing && (
                        <Loader2 size={16} className="animate-spin" />
                    )}
                    Perbarui Kata Sandi
                </button>
            </div>
        </form>
    );
}

function AddressCard({
    defaultAddress,
}: {
    defaultAddress: AddressProp | null;
}) {
    return (
        <section className="border border-[#D8D8D8] bg-white px-8 py-6">
            <SectionTitle icon={MapPin} title="Alamat Utama" />
            <div className="mt-4 sm:items-center">

                <div>
                    {defaultAddress ? (
                        <div className="text-sm font-medium text-[#2E2E2E]">
                            <p className="font-black text-[#1A1A1A]">
                                {defaultAddress.recipient_name}
                            </p>
                            <p className="mt-1">
                                {defaultAddress.recipient_phone}
                            </p>
                            <p className="mt-2 leading-6">
                                {defaultAddress.full_address}
                            </p>
                            <p className="mt-1">
                                {[
                                    defaultAddress.district,
                                    defaultAddress.city,
                                    defaultAddress.province,
                                    defaultAddress.postal_code,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm leading-6 font-medium text-[#707070]">
                            Belum ada alamat utama. Tambahkan alamat untuk
                            checkout lebih cepat.
                        </p>
                    )}
                    <Link
                        href="/address"
                        className="mt-4 inline-flex h-10 min-w-[160px] items-center justify-center border border-[#1A1A1A] bg-white px-5 text-sm font-black transition-colors hover:bg-[#1A1A1A] hover:text-white"
                    >
                        {defaultAddress ? 'Kelola Alamat' : 'Tambah Alamat'}
                    </Link>
                </div>
            </div>
        </section>
    );
}

function SectionTitle({
    icon: Icon,
    title,
}: {
    icon: typeof User;
    title: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <Icon size={27} strokeWidth={1.7} />
            <h3 className="text-2xl font-black tracking-normal text-[#1A1A1A]">
                {title}
            </h3>
        </div>
    );
}

function TextField({
    label,
    value,
    onChange,
    error,
    type = 'text',
    inputMode,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    placeholder?: string;
}) {
    return (
        <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
            <label className="text-sm font-black text-[#1A1A1A]">{label}</label>
            <div>
                <input
                    type={type}
                    inputMode={inputMode}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className={`h-10 w-full border bg-white px-4 text-sm font-medium text-[#1A1A1A] transition-colors outline-none focus:border-[#1A1A1A] ${
                        error ? 'border-[#C81E1E]' : 'border-[#9A9A9A]'
                    }`}
                />
                {error && (
                    <p className="mt-1 text-xs font-bold text-[#C81E1E]">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

function PasswordField({
    label,
    show,
    onToggle,
    value,
    onChange,
    error,
    autoComplete,
}: {
    label: string;
    show: boolean;
    onToggle: () => void;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    autoComplete: string;
}) {
    return (
        <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
            <label className="text-sm font-black text-[#1A1A1A]">{label}</label>
            <div>
                <div className="relative">
                    <input
                        type={show ? 'text' : 'password'}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        autoComplete={autoComplete}
                        className={`h-10 w-full border bg-white px-4 pr-11 text-sm font-medium text-[#1A1A1A] transition-colors outline-none focus:border-[#1A1A1A] ${
                            error ? 'border-[#C81E1E]' : 'border-[#9A9A9A]'
                        }`}
                    />
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[#1A1A1A] transition-colors hover:text-[#F58220]"
                        aria-label={show ? 'Hide password' : 'Show password'}
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {error && (
                    <p className="mt-1 text-xs font-bold text-[#C81E1E]">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
