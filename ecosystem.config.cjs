module.exports = {
    apps: [
      {
        name: 'lager-webapp',
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
      development: {
        user: 'lager',
        host: '127.0.0.1',
        //host: '10.100.120.56',
        key: 'deploy.key',
        ref: 'origin/main',
        repo: 'https://github.com/HIN-hen/lager-webapp.git',
        path: '/home/lager',
        'post-deploy':
          'npm install && pm2 reload && pm2 save && git checkout package.lock',
        env: {
          NODE_ENV: 'development',
        },
      },
      production: {
        user: 'lager',
        host: 'lpa.hennlich.at',
        //host: '10.100.120.56',
        key: 'deploy.key',
        ref: 'origin/main',
        repo: 'https://github.com/HIN-hen/lager-webapp.git',
        path: '/home/lager',
        'post-deploy':
          'npm install && pm2 reload && pm2 save && git checkout package.lock',
        env: {
          NODE_ENV: 'production',
        },
      },
    },
  }