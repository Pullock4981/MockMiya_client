interface BlockedUser {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const blockedUsers: Record<string, BlockedUser> = {};

export function canAttemptLogin(email: string): boolean {
  const now = Date.now();
  const user = blockedUsers[email];

  if (!user) return true;

  // Still blocked?
  if (user.blockedUntil && now < user.blockedUntil) return false;

  // Reset if 2 minutes passed since last attempt
  if (now - user.lastAttempt > 2 * 60 * 1000) {
    blockedUsers[email] = { attempts: 0, lastAttempt: now };
    return true;
  }

  return true;
}

export function recordLoginAttempt(email: string, success: boolean) {
  const now = Date.now();
  if (!blockedUsers[email]) blockedUsers[email] = { attempts: 0, lastAttempt: now };

  const user = blockedUsers[email];

  if (success) {
    delete blockedUsers[email];
    return;
  }

  user.attempts += 1;
  user.lastAttempt = now;

  if (user.attempts >= 5) {
    user.blockedUntil = now + 2 * 60 * 1000; // 2 min lock
  }
}

export function getBlockedUntil(email: string): number | null {
  const user = blockedUsers[email];
  if (user?.blockedUntil && Date.now() < user.blockedUntil) {
    return user.blockedUntil;
  }
  return null;
}
