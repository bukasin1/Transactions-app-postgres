if [ ! -f '.env' ]; then
  echo '.env file exists - skipping'
fi


docker-compose up
