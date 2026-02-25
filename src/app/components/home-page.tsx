import { HomeCarousel } from "./home-carousel";

interface HomePageProps {
  isDark: boolean;
}

export function HomePage({ isDark }: HomePageProps) {
  return (
    <div className="space-y-8">
      {/* Subtle radial glow - light mode only */}
      {!isDark && (
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-4">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          Welcome back, John
        </h2>
        <p className={`text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Track your work and manage your daily performance
        </p>
      </div>

      {/* Carousel Component */}
      <HomeCarousel isDark={isDark} />
    </div>
  );
}
