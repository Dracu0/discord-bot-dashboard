function createRequestId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function write(level, message, meta = {}) {
  if (import.meta.env.PROD && level !== 'error') return;

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  if (level === 'error') {
    console.error(payload);
  } else if (level === 'warn') {
    console.warn(payload);
  } else {
    console.log(payload);
  }
}

const logger = {
  createRequestId,
  info(message, meta) {
    write('info', message, meta);
  },
  warn(message, meta) {
    write('warn', message, meta);
  },
  error(message, meta) {
    write('error', message, meta);
  },
};

export default logger;
