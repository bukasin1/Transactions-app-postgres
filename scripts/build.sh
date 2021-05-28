if ! [ -f '.env' ]; then
  cp .env.example .env
fi

npm run compile
docker-compose up -d
echo "Waiting on postgres server to start - please wait"
npx wait-on tcp:5400 && npm run migrate up
echo "Build complete - Start the server with node bin/www"
