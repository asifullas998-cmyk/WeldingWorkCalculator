import { WeldingCalculator } from '@/components/welding-calculator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 pt-12 sm:p-8 sm:pt-24">
      <div className="absolute top-4 right-4">
        <Button asChild variant="outline">
          <Link href="/joints-guide">
            <BookOpen className="mr-2 h-5 w-5" />
            Welding Joints Guide
          </Link>
        </Button>
      </div>
      <WeldingCalculator />
    </main>
  );
}
