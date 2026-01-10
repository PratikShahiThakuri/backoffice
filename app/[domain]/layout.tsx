import { notFound } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Metadata } from 'next';
import Link from 'next/link';

// Define the shape of your Tenant response
interface TenantConfig {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// 1. Fetch Tenant Config (Server Side)
async function getTenantConfig(slug: string) {
  try {
    // Calls your C# Endpoint: GET /api/tenants/lookup/{slug}
    return await apiClient<TenantConfig>(`/api/tenants/lookup/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
  } catch (error) {
    return null;
  }
}

// 2. Dynamic Metadata
export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
  const tenant = await getTenantConfig(params.domain);
  if (!tenant) return { title: 'Not Found' };
  
  return {
    title: `${tenant.displayName} | Portal`,
    icons: { icon: tenant.logoUrl || '/favicon.ico' }
  };
}

// 3. The Layout
export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { domain:string };
}) {
  const tenant = await getTenantConfig(params.domain);

  if (!tenant) {
    notFound(); 
  }

  // Inject CSS Variables for Dynamic Branding
  const brandingStyles = {
    '--primary': tenant.primaryColor || '#2563eb', 
    '--secondary': tenant.secondaryColor || '#1e293b',
  } as React.CSSProperties;

  return (
    <div style={brandingStyles} className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dynamic Header */}
      <header className="bg-white border-b shadow-sm h-16">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
             {tenant.logoUrl ? (
               <img src={tenant.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
             ) : (
               <div className="h-8 w-8 bg-[var(--primary)] rounded-md flex items-center justify-center text-white font-bold">
                 {tenant.name.substring(0,2).toUpperCase()}
               </div>
             )}
             <span className="font-semibold text-gray-700">{tenant.displayName}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}