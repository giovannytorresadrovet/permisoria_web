'use client';

import { Card } from 'keep-react';

export default function DashboardPage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Welcome to your Dashboard!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-glass">
          <div className="p-4">
            <h2 className="text-lg font-medium text-text-primary">Businesses</h2>
            <p className="text-text-secondary mt-1">Manage your business entities</p>
          </div>
        </Card>

        <Card className="card-glass">
          <div className="p-4">
            <h2 className="text-lg font-medium text-text-primary">Business Owners</h2>
            <p className="text-text-secondary mt-1">Manage business owner profiles</p>
          </div>
        </Card>

        <Card className="card-glass">
          <div className="p-4">
            <h2 className="text-lg font-medium text-text-primary">Permits</h2>
            <p className="text-text-secondary mt-1">Manage business permits</p>
          </div>
        </Card>
      </div>
    </main>
  );
} 