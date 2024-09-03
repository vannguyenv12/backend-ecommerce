# Install Redis
docker pull redis

# Run Redis Server
docker run --name my-redis -d -p 6380:6379 redis

# Open the redis cli command
docker exec -it my-redis redis-cli

# Check running redis
docker ps

# Remove redis container
docker container rm my-redis