export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-8 bg-white/20 dark:bg-[#03060d]/30 backdrop-blur-md text-center border-t border-slate-300 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          © {year} Arunava Chandan Roy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
