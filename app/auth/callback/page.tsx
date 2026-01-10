'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Guard to prevent double-firing in Strict Mode
  const runOnce = useRef(false);
  
  // Status is ONLY for the async loading process
  const [status, setStatus] = useState('Completing login...');

  // Derive state directly from URL parameters (No useEffect needed for this)
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const code = searchParams.get('code');

  useEffect(() => {
    // If we have no code, or if we already ran, do nothing.
    // This prevents the "synchronous setState" error because we just exit.
    if (!code || runOnce.current) return;

    runOnce.current = true;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7218';
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', `${API_URL}/connect/authorize/callback`); 
    formData.append('client_id', 'rf-office');

    fetch(`${API_URL}/connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        if (data.refresh_token) {
           localStorage.setItem('refresh_token', data.refresh_token);
        }
        router.push('/'); 
      } else {
        // This is safe because it happens asynchronously (after the fetch)
        setStatus(`Failed to exchange token: ${data.error || 'Unknown error'}`);
        console.error(data);
      }
    })
    .catch((err) => {
      console.error(err);
      setStatus('Network error during login.');
    });

  }, [code, router]); 

  // --- RENDER LOGIC ---

  // 1. Handle URL Errors immediately
  if (errorParam) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center text-red-600">
                <h3 className="font-bold text-lg">Login Failed</h3>
                <p>{errorDescription || errorParam}</p>
            </div>
        </div>
    );
  }

  // 2. Handle "No Code" scenario immediately
  if (!code) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center text-gray-600">
                <h3 className="font-bold">Invalid Request</h3>
                <p>No authorization code found in URL.</p>
            </div>
        </div>
    );
  }

  // 3. Default: Loading State (Fetch is running)
  return (
    <div className="flex h-screen items-center justify-center">
        <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
        </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <CallbackContent />
    </Suspense>
  );
}