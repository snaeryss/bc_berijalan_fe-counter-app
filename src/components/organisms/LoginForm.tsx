"use client";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import { ILoginSchema, VLoginSchema } from "@/schemas/auth.schema";
import { useLoginUser } from "@/services/auth/wrapper.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image"; // Import komponen Image dari Next.js

export default function LoginForm() {
  const router = useRouter();
  const { mutate, isPending } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginSchema>({
    resolver: yupResolver(VLoginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: ILoginSchema) => {
    mutate(data, {
      onSuccess: (res) => {
        if (res.status === true) {
          router.push("/");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full shadow-2xl rounded-xl">
        <div className="flex flex-col items-center mb-8">
          {/* =====================================================
            BAGIAN INI YANG AKU GANTI UNTUK LOGO
            =====================================================
          */}
          <div className="mb-4">
             <Image
                src="/berijalan.webp" // Pastikan path ini sesuai dengan lokasi logomu
                alt="Logo Berijalan"
                width={120} // Sesuaikan lebar logo sesuai kebutuhan
                height={120} // Sesuaikan tinggi logo sesuai kebutuhan (penting untuk Next/Image)
                className="object-contain" // Agar logo tidak terpotong dan tetap proporsional
            />
          </div>
          {/* ===================================================== */}

          <h1 className="text-2xl font-bold text-gray-800">
            Admin Login
          </h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali, silakan masuk.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("username")}
            label="Username"
            placeholder="Masukkan username Anda"
            error={errors.username?.message}
            fullWidth
            leftIcon={<span className="material-symbols-outlined text-base">person</span>}
          />

          <Input
            {...register("password")}
            label="Password"
            placeholder="Masukkan password Anda"
            error={errors.password?.message}
            type="password"
            fullWidth
             leftIcon={<span className="material-symbols-outlined text-base">lock</span>}
          />

          <div className="pt-4">
            <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isPending}
                disabled={isPending}
            >
                Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}