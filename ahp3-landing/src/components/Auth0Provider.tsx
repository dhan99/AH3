'use client';

import { Auth0Provider as Auth0ProviderBase } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { auth0Config } from '@/utils/auth0';

interface Auth0ProviderProps {
  children: ReactNode;
}

export const Auth0Provider = ({ children }: Auth0ProviderProps) => {
  const router = useRouter();

  const onRedirectCallback = (appState: any) => {
    router.push(appState?.returnTo || '/');
  };

  return (
    <Auth0ProviderBase
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0ProviderBase>
  );
};
