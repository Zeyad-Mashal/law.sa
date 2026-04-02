import Link from "next/link";

export default function Home() {
  return (
    <main
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-linear-to-b from-slate-50 via-white to-stone-50"
    >
      <div className="max-w-lg text-center space-y-8">
        <div className="mx-auto h-px w-16 bg-linear-to-l from-transparent via-slate-300/60 to-transparent" aria-hidden />
        <h1 className="text-3xl sm:text-4xl font-extralight text-slate-600 tracking-wide leading-[1.7]">
          اهلا بكم في مشروع واثقون
        </h1>
        <p className="text-base sm:text-lg text-slate-600/90 font-light leading-loose">
          المشروع تحت الانشاء في الوقت الحالي و سيتم الاطلاق في اقرب وقت انتظرونا.
        </p>
        <div className="mx-auto h-px w-24 bg-linear-to-r from-transparent via-stone-200 to-transparent" aria-hidden />
        <Link href="/login" className="text-blue-500 mt-4">تسجيل الدخول</Link>
        <Link href="/register" className="text-blue-500 mt-4 mr-4">تسجيل حساب جديد</Link>
      </div>
    </main>
  );
}
