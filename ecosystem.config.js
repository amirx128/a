module.exports = {
  apps: [
    {
      name: 'admin',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/admin', 
      interpreter: 'none',  
      env: {
        NODE_ENV: 'production',  
        PORT: 7777  
      }
    }
  ]
};