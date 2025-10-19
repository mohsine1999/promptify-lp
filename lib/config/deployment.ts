const rawDomain = (process.env.NEXT_PUBLIC_DEPLOY_BASE_DOMAIN ?? process.env.DEPLOY_BASE_DOMAIN ?? "promptify.localhost:3000")
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");

export const DEPLOY_BASE_DOMAIN = rawDomain;
export const DEPLOY_BASE_HOSTNAME = rawDomain.split(":")[0];

export function buildDeploymentHost(slug: string) {
  return `${slug}.${DEPLOY_BASE_DOMAIN}`;
}

export function buildDeploymentUrl(slug: string) {
  const isLocal = /localhost|127\.0\.0\.1/.test(DEPLOY_BASE_HOSTNAME);
  const protocol = isLocal ? "http" : "https";
  return `${protocol}://${buildDeploymentHost(slug)}`;
}
