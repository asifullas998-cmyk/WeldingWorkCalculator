
import { JointsGuide } from '@/components/joints-guide';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JointsGuidePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 pt-12 sm:p-8">
       <div className="w-full max-w-5xl self-start">
        <Button asChild variant="outline" className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Calculator
            </Link>
        </Button>
      </div>
      <div className="w-full max-w-5xl flex-grow">
        <JointsGuide />
      </div>
    </main>
  );
}
