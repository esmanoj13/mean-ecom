(window as any).process = {
  env: {
    NODE_ENV: 'development', // or 'production'
    DEBUG_MIME: true, // Set to true for debugging mime types
    API_URL: 'http://localhost:4200',
  },
};
