if [ ! -f '.env' ]; then
  cp .env.example .env
fi

npm run compile
npm run migrate up
docker-compose up -d
