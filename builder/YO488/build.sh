docker build -t build-yo488 .
docker run -v $(pwd):/out build-yo488
