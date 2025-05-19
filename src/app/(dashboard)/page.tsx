'use client';

import { Card } from 'keep-react';
import { Buildings, Users, FilePlus } from 'phosphor-react';

export default function DashboardPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome to your Dashboard!</h1>
        <p className="text-text-secondary">Manage your permits and licenses in one place.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-glass">
          <div className="p-6">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Buildings size={32} className="text-primary" weight="duotone" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-text-primary text-center mb-2">Businesses</h2>
            <p className="text-text-secondary text-center">Manage your business entities</p>
          </div>
        </Card>

        <Card className="card-glass">
          <div className="p-6">
            <div className="mb-4 flex justify-center">
              <div className="bg-secondary/10 p-3 rounded-full">
                <Users size={32} className="text-secondary" weight="duotone" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-text-primary text-center mb-2">Business Owners</h2>
            <p className="text-text-secondary text-center">Manage business owner profiles</p>
          </div>
        </Card>

        <Card className="card-glass">
          <div className="p-6">
            <div className="mb-4 flex justify-center">
              <div className="bg-accent/10 p-3 rounded-full">
                <FilePlus size={32} className="text-accent" weight="duotone" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-text-primary text-center mb-2">Permits</h2>
            <p className="text-text-secondary text-center">Manage business permits</p>
          </div>
        </Card>
      </div>
    </>
  );
} 