module.exports = {
    apps: [
      {
        name: 'app',
        script: 'npm start',
        time: true,
        instances: 1,
        autorestart: true,
        max_restarts: 50,
        watch: false,
        max_memory_restart: '1G',
        env: {
          PORT: 5000
        },
      },
    ],
    deploy: {
      production: {
        user: 'lager',
        host: 'lpa.hennlich.at',
        key: 'deploy.key',
        ref: 'origin/main',
        repo: 'https://github.com/HIN-hen/lager-webapp.git',
        path: '/home/lager/lager-webapp',
        'post-deploy':
          'npm install && pm2 reload ecosystem.config.cjs --env production && pm2 save && git checkout package.lock',
        env: {
          NODE_ENV: 'production',
        },
      },
    },
  }