docker build -t build-dolphin101 .
docker run -v $(pwd):/out build-dolphin101
