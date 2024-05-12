import { Navigate, createFileRoute } from '@tanstack/react-router';
import { centerContainer } from '../css/styles/container.css';
import { Logo } from '../components/logo';
import { api } from '../utils/config';
import { isValid, issue } from '../utils/api/auth';
import { z } from 'zod';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { button } from '../css/styles/button.css';

const codeSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute('/')({
  component: IndexComponent,
  validateSearch: codeSchema,
  loaderDeps: ({ search: { code } }) => {
    return {
      code: code,
    };
  },
  loader: async ({ deps: { code } }) => {
    if (!code) {
      return;
    }
    const response = await issue(code);
    if (response.status !== 200) {
      return;
    }
    const accessToken = response.headers['authorization'].split(' ')[1];
    return {
      accessToken: accessToken,
    };
  },
});

function IndexComponent() {
  const accessToken = useUserStore((state) => state.accessToken);
  const loggedIn = useUserStore((state) => state.loggedIn);
  const updateLoggedIn = useUserStore((state) => state.updateLoggedIn);
  const updateAccessToken = useUserStore((state) => state.updateAccessToken);

  const data = Route.useLoaderData();
  useEffect(() => {
    if (data) {
      updateAccessToken(data.accessToken);
    }
  }, [data, updateAccessToken]);

  useEffect(() => {
    if (accessToken) {
      isValid(accessToken)
        .then(() => {
          updateLoggedIn(true);
        })
        .catch(() => {
          updateLoggedIn(false);
        });
    }
  }, [updateLoggedIn, accessToken]);

  // If the user is logged in, redirect them to the cloud page
  if (loggedIn) {
    return <Navigate to="./cloud" />;
  }

  // If the user is not logged in, show the login page
  const loginUrl = `${api.oauth}?redirect_url=${api.redirectUrl}`;
  return (
    <div className={centerContainer}>
      <div>
        <Logo fontSize="4rem" />
        <div>
          Upload and share your files with your friends, family, and the world.
        </div>
        <a href={loginUrl}>
          <button className={button}>Login</button>
        </a>
      </div>
    </div>
  );
}
