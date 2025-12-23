// Simple auth state management
const userSessions = new Map<string, { userId: string; guildId: string; isAdmin: boolean; expiresAt: number }>();

// Admin users whitelist - users who have full access to all panels
const ADMIN_USERS = new Set<string>([
  "1130709463721050142", // Full access user
  "1439165889785364581", // Staff Role 1
  "1439258461769695303", // Staff Role 2
  "1439165890464841799", // Staff Role 3
  "1439258100304711791", // Staff Role 4
  "1443329127473221843", // Staff Role 5
  "1439258760089702592", // Staff Role 6
  "1439258799088205915", // Staff Role 7
  "1439258937236127794"  // Staff Role 8
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
