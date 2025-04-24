'use client';

import {useEffect} from 'react';
import Cookies from 'js-cookie';
import {useRouter} from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Remove the authToken cookie
    Cookies.remove('authToken');

    // Redirect to the login page
    router.push('/login');
  }, [router]);

  return null; // No UI is rendered
};

export default LogoutPage;
