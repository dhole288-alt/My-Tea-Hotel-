import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

interface SalesforceSession {
  token: string;
  user: {
    userId: string;
    username: string;
    name: string;
    email: string;
    orgId?: string;
    userType?: string;
    roleTitle?: string;
    authenticatedAt: string;
    authMethod: 'salesforce_oauth_2.0';
  };
  createdAt: number;
  expiresAt: number;
}

// In-memory token and CSRF state stores with TTL
const activeSessions = new Map<string, SalesforceSession>();
const activeOAuthStates = new Map<string, { createdAt: number; redirectOrigin?: string }>();

// Cleanup stale sessions/states periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, state] of activeOAuthStates.entries()) {
    if (now - state.createdAt > 15 * 60 * 1000) { // 15 mins TTL for OAuth handshake
      activeOAuthStates.delete(key);
    }
  }
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}, 5 * 60 * 1000);

function getAppUrl(req: Request): string {
  if (process.env.APP_URL && process.env.APP_URL.trim() !== '' && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

function getSalesforceRedirectUri(req: Request): string {
  if (process.env.SALESFORCE_REDIRECT_URI && process.env.SALESFORCE_REDIRECT_URI.trim() !== '') {
    return process.env.SALESFORCE_REDIRECT_URI.trim();
  }
  return `${getAppUrl(req)}/auth/salesforce/callback`;
}

function getSalesforceLoginUrl(): string {
  const url = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
  return url.replace(/\/+$/, '');
}

function isAuthorizedAdmin(user: { email: string; username: string; userId: string }): { authorized: boolean; reason?: string } {
  const allowedAdminsRaw = process.env.SALESFORCE_ALLOWED_ADMINS;

  // If no restriction is specified, by default allow authenticating Salesforce admins or the workspace owner
  if (!allowedAdminsRaw || allowedAdminsRaw.trim() === '') {
    return { authorized: true };
  }

  const allowedList = allowedAdminsRaw
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowedList.length === 0) {
    return { authorized: true };
  }

  const userEmail = (user.email || '').toLowerCase();
  const username = (user.username || '').toLowerCase();
  const userId = (user.userId || '').toLowerCase();

  const isMatch = allowedList.some(allowed => 
    allowed === userEmail ||
    allowed === username ||
    allowed === userId ||
    userEmail.endsWith(`@${allowed}`) // domain-level allowance e.g. @royalchai.com
  );

  if (isMatch) {
    return { authorized: true };
  }

  return { 
    authorized: false, 
    reason: `Salesforce user ${user.username} (${user.email}) is not in the authorized administrator list.` 
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Helper middleware to authenticate admin session
  const requireAdminAuth = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieToken = req.cookies?.rc_admin_session;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Admin session required' });
    }

    const session = activeSessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({ error: 'Session expired. Please log in again with Salesforce.' });
    }

    (req as any).adminSession = session;
    next();
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Admin OAuth Configuration Status
  app.get('/api/admin/config', (req, res) => {
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const isConfigured = Boolean(clientId && clientId.trim().length > 0);
    const redirectUri = getSalesforceRedirectUri(req);
    const loginUrl = getSalesforceLoginUrl();
    const hasAllowedList = Boolean(process.env.SALESFORCE_ALLOWED_ADMINS && process.env.SALESFORCE_ALLOWED_ADMINS.trim().length > 0);

    res.json({
      isConfigured,
      loginUrl,
      redirectUri,
      hasAllowedList,
      appUrl: getAppUrl(req)
    });
  });

  // Check Current Admin Session
  app.get('/api/admin/session', (req, res) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieToken = req.cookies?.rc_admin_session;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.json({ authenticated: false });
    }

    const session = activeSessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      if (session) activeSessions.delete(token);
      return res.json({ authenticated: false, message: 'Session expired' });
    }

    res.json({
      authenticated: true,
      user: session.user,
      expiresAt: session.expiresAt
    });
  });

  // Get Salesforce OAuth Authorization URL
  app.get('/api/auth/salesforce/url', (req, res) => {
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const redirectUri = getSalesforceRedirectUri(req);
    const loginUrl = getSalesforceLoginUrl();

    if (!clientId || clientId.trim() === '') {
      return res.status(400).json({
        error: 'SALESFORCE_CLIENT_ID is not configured in server environment variables.',
        isConfigured: false,
        redirectUri
      });
    }

    // Generate CSRF state token
    const state = crypto.randomBytes(24).toString('hex');
    activeOAuthStates.set(state, {
      createdAt: Date.now(),
      redirectOrigin: req.headers.origin || getAppUrl(req)
    });

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId.trim(),
      redirect_uri: redirectUri,
      scope: 'openid api id profile email',
      state: state,
      prompt: 'login consent'
    });

    const authUrl = `${loginUrl}/services/oauth2/authorize?${params.toString()}`;

    res.json({
      url: authUrl,
      state: state,
      redirectUri: redirectUri,
      loginUrl: loginUrl
    });
  });

  // Salesforce OAuth Callback Handler (handles /auth/salesforce/callback and /auth/salesforce/callback/)
  const handleSalesforceCallback = async (req: Request, res: Response) => {
    const { code, state, error, error_description } = req.query;

    const renderHtmlResponse = (type: 'SUCCESS' | 'DENIED' | 'ERROR', payload: Record<string, any>, title: string, description: string) => {
      const isSuccess = type === 'SUCCESS';
      const isDenied = type === 'DENIED';

      const accentColor = isSuccess ? '#f59e0b' : isDenied ? '#ef4444' : '#f97316';
      const bgBadge = isSuccess ? 'rgba(245, 158, 11, 0.15)' : isDenied ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)';

      const payloadJson = JSON.stringify(payload).replace(/</g, '\\u003c');

      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Royal Chai Admin</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0c0a09;
      color: #f5f5f4;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: #1c1917;
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 20px;
      padding: 32px;
      max-width: 460px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${bgBadge};
      color: ${accentColor};
      margin-bottom: 20px;
      border: 1px solid ${accentColor}40;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: ${accentColor};
    }
    p {
      color: #a8a29e;
      font-size: 13px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .user-box {
      background: #0c0a09;
      border: 1px solid #292524;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 12px;
      color: #e7e5e4;
      margin-bottom: 20px;
      text-align: left;
      font-family: monospace;
    }
    .btn {
      background: ${accentColor};
      color: #000;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      ${isSuccess ? '👑' : isDenied ? '🚫' : '⚠️'}
    </div>
    <h1>${title}</h1>
    <p>${description}</p>
    ${payload.user ? `<div class="user-box">User: <strong>${payload.user.email || payload.user.username}</strong><br/>Salesforce ID: <code>${payload.user.userId || 'N/A'}</code></div>` : ''}
    <button class="btn" onclick="closeOrRedirect()">Return to Admin Portal</button>
  </div>

  <script>
    const payload = ${payloadJson};
    
    function dispatchMessage() {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, '*');
          setTimeout(() => {
            window.close();
          }, 800);
        }
      } catch (err) {
        console.error('PostMessage error:', err);
      }
    }

    function closeOrRedirect() {
      if (window.opener && !window.opener.closed) {
        window.close();
      } else {
        window.location.href = '/';
      }
    }

    dispatchMessage();
  </script>
</body>
</html>`;
    };

    // Check if user cancelled or error occurred
    if (error || error_description) {
      return res.send(renderHtmlResponse(
        'ERROR',
        { type: 'SALESFORCE_AUTH_ERROR', error: error_description || error || 'Salesforce authorization failed.' },
        'Authentication Cancelled',
        String(error_description || error || 'The Salesforce authentication request was cancelled or failed.')
      ));
    }

    // Validate code & state
    if (!code || typeof code !== 'string') {
      return res.send(renderHtmlResponse(
        'ERROR',
        { type: 'SALESFORCE_AUTH_ERROR', error: 'Missing authorization code from Salesforce.' },
        'Missing Authorization Code',
        'Salesforce did not return a valid authorization code.'
      ));
    }

    if (!state || typeof state !== 'string' || !activeOAuthStates.has(state)) {
      return res.send(renderHtmlResponse(
        'ERROR',
        { type: 'SALESFORCE_AUTH_ERROR', error: 'Invalid or expired OAuth state parameter (CSRF protection).' },
        'Security State Mismatch',
        'The OAuth state parameter is invalid or has expired. Please initiate login again.'
      ));
    }

    // Consume the state
    activeOAuthStates.delete(state);

    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const loginUrl = getSalesforceLoginUrl();
    const redirectUri = getSalesforceRedirectUri(req);

    if (!clientId || !clientSecret) {
      return res.send(renderHtmlResponse(
        'ERROR',
        { type: 'SALESFORCE_AUTH_ERROR', error: 'Server environment missing SALESFORCE_CLIENT_ID or SALESFORCE_CLIENT_SECRET.' },
        'Server Configuration Error',
        'Salesforce Client ID or Client Secret is not configured in server environment variables.'
      ));
    }

    try {
      // 1. Exchange code for access token via Salesforce OAuth 2.0 token endpoint
      const tokenEndpoint = `${loginUrl}/services/oauth2/token`;
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        redirect_uri: redirectUri
      });

      const tokenRes = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: tokenParams.toString()
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.error('Salesforce token exchange failed:', errorText);
        return res.send(renderHtmlResponse(
          'ERROR',
          { type: 'SALESFORCE_AUTH_ERROR', error: `Token exchange failed with status ${tokenRes.status}: ${errorText}` },
          'Token Exchange Failed',
          'Could not exchange authorization code with Salesforce. Please verify Client ID and Secret.'
        ));
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      const identityUrl = tokenData.id;
      const instanceUrl = tokenData.instance_url;

      // 2. Fetch user information using userinfo or identity endpoint
      let userInfo: any = null;

      try {
        const userInfoRes = await fetch(`${loginUrl}/services/oauth2/userinfo`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });

        if (userInfoRes.ok) {
          userInfo = await userInfoRes.json();
        }
      } catch (err) {
        console.warn('UserInfo fetch error, falling back to identity URL:', err);
      }

      if (!userInfo && identityUrl) {
        const idRes = await fetch(identityUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });
        if (idRes.ok) {
          userInfo = await idRes.json();
        }
      }

      if (!userInfo) {
        return res.send(renderHtmlResponse(
          'ERROR',
          { type: 'SALESFORCE_AUTH_ERROR', error: 'Failed to retrieve Salesforce user profile.' },
          'User Profile Error',
          'Successfully authenticated with Salesforce, but could not retrieve user identity details.'
        ));
      }

      const sfUserId = userInfo.user_id || userInfo.sub || tokenData.id?.split('/').pop() || 'SF-USER';
      const sfUsername = userInfo.preferred_username || userInfo.username || sfUserId;
      const sfEmail = userInfo.email || sfUsername;
      const sfName = userInfo.name || userInfo.display_name || sfUsername;
      const sfOrgId = userInfo.organization_id || tokenData.id?.split('/')[4];

      const userProfile = {
        userId: sfUserId,
        username: sfUsername,
        name: sfName,
        email: sfEmail,
        orgId: sfOrgId,
        userType: userInfo.user_type || 'Salesforce Administrator',
        roleTitle: 'Verified Salesforce Admin',
        authenticatedAt: new Date().toISOString(),
        authMethod: 'salesforce_oauth_2.0' as const
      };

      // 3. Perform Admin Authorization check
      const authResult = isAuthorizedAdmin(userProfile);

      if (!authResult.authorized) {
        return res.status(403).send(renderHtmlResponse(
          'DENIED',
          {
            type: 'SALESFORCE_AUTH_DENIED',
            message: 'Access Denied – You are not authorized to access the Royal Chai Admin Panel.',
            user: userProfile
          },
          'Access Denied',
          'Access Denied – You are not authorized to access the Royal Chai Admin Panel. Your Salesforce user ID or email is not in the allowed administrator list.'
        ));
      }

      // 4. Create secure server-side session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionDuration = 12 * 60 * 60 * 1000; // 12 hours
      const expiresAt = Date.now() + sessionDuration;

      activeSessions.set(sessionToken, {
        token: sessionToken,
        user: userProfile,
        createdAt: Date.now(),
        expiresAt: expiresAt
      });

      // Set secure cookie (SameSite=none & Secure=true required for AI Studio iframe environment)
      res.cookie('rc_admin_session', sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: sessionDuration,
        path: '/'
      });

      // Render success page and post message to opener
      return res.send(renderHtmlResponse(
        'SUCCESS',
        {
          type: 'SALESFORCE_AUTH_SUCCESS',
          sessionToken: sessionToken,
          user: userProfile,
          expiresAt: expiresAt
        },
        'Authentication Successful',
        `Welcome, ${sfName}! You are securely authenticated with Salesforce. Redirecting to Royal Chai Admin Portal...`
      ));
    } catch (err: any) {
      console.error('OAuth Callback processing error:', err);
      return res.status(500).send(renderHtmlResponse(
        'ERROR',
        { type: 'SALESFORCE_AUTH_ERROR', error: err.message || 'Internal server error during authentication.' },
        'Authentication Error',
        `An unexpected error occurred during Salesforce OAuth processing: ${err.message || 'Unknown error'}`
      ));
    }
  };

  // Register both paths to handle trailing slash variations
  app.get('/auth/salesforce/callback', handleSalesforceCallback);
  app.get('/auth/salesforce/callback/', handleSalesforceCallback);

  // Admin Logout Endpoint
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieToken = req.cookies?.rc_admin_session;
    const token = bearerToken || cookieToken;

    if (token) {
      activeSessions.delete(token);
    }

    res.clearCookie('rc_admin_session', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });

    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Protected Admin Data API example
  app.get('/api/admin/protected-ping', requireAdminAuth, (req, res) => {
    const session = (req as any).adminSession;
    res.json({
      status: 'authorized',
      user: session.user,
      time: new Date().toISOString()
    });
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Royal Chai Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
