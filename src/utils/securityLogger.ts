
// Security logging utilities

interface SecurityEvent {
  type: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'DATA_ACCESS' | 'SUSPICIOUS_ACTIVITY';
  userId?: string;
  details: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

/**
 * Log security events for monitoring
 */
export const logSecurityEvent = (event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>) => {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date(),
    userAgent: navigator.userAgent
  };

  // Log to console for development
  console.log('[SECURITY]', securityEvent);

  // In production, you would send this to a secure logging service
  // Example: send to Supabase edge function, external logging service, etc.
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement secure logging to external service
  }
};

/**
 * Log successful authentication
 */
export const logAuthSuccess = (userId: string) => {
  logSecurityEvent({
    type: 'AUTH_SUCCESS',
    userId,
    details: `User ${userId} successfully authenticated`
  });
};

/**
 * Log authentication failure
 */
export const logAuthFailure = (details: string) => {
  logSecurityEvent({
    type: 'AUTH_FAILURE',
    details
  });
};

/**
 * Log data access attempts
 */
export const logDataAccess = (userId: string, resource: string, action: string) => {
  logSecurityEvent({
    type: 'DATA_ACCESS',
    userId,
    details: `User ${userId} ${action} ${resource}`
  });
};

/**
 * Log suspicious activity
 */
export const logSuspiciousActivity = (details: string, userId?: string) => {
  logSecurityEvent({
    type: 'SUSPICIOUS_ACTIVITY',
    userId,
    details
  });
};
