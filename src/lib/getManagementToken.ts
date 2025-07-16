export async function getManagementToken() {
  const res = await fetch('https://dev-y7itdkla02rfhyve.us.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: 'https://dev-y7itdkla02rfhyve.us.auth0.com/api/v2/',
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    throw new Error('No se pudo obtener el token de Auth0 Management API');
  }

  const data = await res.json();
  return data.access_token;
}
