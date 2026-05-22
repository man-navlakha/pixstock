import type { NextRequest } from 'next/server';

const API_BASE = 'https://img-server-theta.vercel.app';
const LOCAL_PREFIX = '/api/tamplates';
const API_PREFIX = '/api/tamplates';

function buildTargetUrl(requestUrl: string) {
  const { pathname, search } = new URL(requestUrl);
  const upstreamPath = pathname.replace(LOCAL_PREFIX, API_PREFIX);
  return `${API_BASE}${upstreamPath}${search}`;
}

async function proxyRequest(request: NextRequest) {
  const targetUrl = buildTargetUrl(request.url);
  const headers = new Headers();
  const contentType = request.headers.get('content-type');

  if (contentType) {
    headers.set('content-type', contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const upstreamResponse = await fetch(targetUrl, init);
  const responseHeaders = new Headers(upstreamResponse.headers);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}
