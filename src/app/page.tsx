import { WeldingCalculator } from '@/components/welding-calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-background p-4 pt-12 sm:p-8 sm:pt-24">
      <WeldingCalculator />
    </main>
  );
}
