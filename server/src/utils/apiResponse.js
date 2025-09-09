export const ok = (data) => ({ success: true, data });
export const fail = (message, code) => ({
  success: false,
  error: { message, code },
});
