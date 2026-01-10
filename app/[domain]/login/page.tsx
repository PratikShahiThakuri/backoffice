'use client';

import { useParams } from 'next/navigation';
import Button from '@/components/Button'; // Assuming you have this

export default function TenantLoginPage() {
  const params = useParams();
  const domain = params?.domain as string;

  function handleLogin() {
    // Guard against executing login if domain is not yet available
    if (!domain) {
        console.error("Login attempted without a domain.");
        return;
    }

    const AUTH_SERVER = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7218';
    
    // Redirect back to our Callback Page
    // IMPORTANT: This must match what is allowed in your C# SeedData/Config
    const redirectUri = `${AUTH_SERVER}/connect/authorize/callback`;

    const authParams = new URLSearchParams({
      client_id: 'rf-client', // Corrected client_id
      response_type: 'code',
      scope: 'openid profile email api offline_access',
      redirect_uri: redirectUri,
      state: 'random_state_string_generated_here', 
      tenant: domain,
    });

    window.location.href = `${AUTH_SERVER}/connect/authorize?${authParams.toString()}`;
  }

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-center border">
        <h2 className="text-2xl font-bold mb-2">Welcome to {domain || '...'}</h2>
        <p className="text-gray-500 mb-6">Please sign in to continue</p>
        
        <Button 
          onClick={handleLogin} 
          disabled={!domain} // Disable button if domain is not available
          className="w-full bg-[var(--primary)] text-white hover:opacity-90 disabled:opacity-50"
        >
          Log in with SSO
        </Button>
      </div>
    </div>
  );
}