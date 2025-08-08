
// Security utilities for input validation and sanitization

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (basic validation)
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitizes and validates company name
 */
export const validateCompanyName = (name: string): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeInput(name);
  
  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'Company name must be at least 2 characters' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, sanitized, error: 'Company name must be less than 100 characters' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Sanitizes and validates customer name
 */
export const validateCustomerName = (name: string): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeInput(name);
  
  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'Customer name must be at least 2 characters' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, sanitized, error: 'Customer name must be less than 50 characters' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Sanitizes notes and other text content
 */
export const sanitizeTextContent = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};
