'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
				<p className="text-lg text-gray-600 mb-6">You are not authorized to view this page.</p>
				<Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
			</div>
		</div>
	);
}
