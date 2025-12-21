// Simple auth state management
const userSessions = new Map<string, { userId: string; guildId: string; isAdmin: boolean; expiresAt: number }>();

// Admin users whitelist - users who have full access to all panels
const ADMIN_USERS = new Set<string>([
  "1130709463721050142", // Full access user
]);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function isUserAdmin(userId: string): boolean {
  return ADMIN_USERS.has(userId);
}

export function addAdminUser(userId: string): void {
  ADMIN_USERS.add(userId);
}

export function removeAdminUser(userId: string): void {
  ADMIN_USERS.delete(userId);
}

export function getAdminUsers(): string[] {
  return Array.from(ADMIN_USERS);
}

export function createSession(userId: string, guildId: string, isAdmin: boolean): string {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  userSessions.set(sessionId, {
    userId,
    guildId,
    isAdmin,
    expiresAt: Date.now() + SESSION_DURATION,
  });
  return sessionId;
}

export function getSession(sessionId: string) {
  const session = userSessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    userSessions.delete(sessionId);
    return null;
  }
  return session;
}

export function deleteSession(sessionId: string) {
  userSessions.delete(sessionId);
}
