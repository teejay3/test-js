module.exports = {
  apps : [{
    name: 'cybersirius-webapi',
    script: 'app.js',
    args: '',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
	
    },
    env_production: {
	
    }
  }]
};
