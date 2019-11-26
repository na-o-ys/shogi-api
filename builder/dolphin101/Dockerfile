FROM amazonlinux:2.0.20191016.0

RUN yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm &&\
    yum install -y gcc gcc-c++ make build-essential wget p7zip unzip

WORKDIR /work
COPY Makefile Makefile

CMD wget https://www.qhapaq.org/static/media/bin/dolphin1.01%2Billqha3.zip &&\
    unzip dolphin1.01+illqha3 || true &&\
    cd dolphin1.01+illqha3/dolphin1.01/ &&\
    7za x -y dolphin1.01_source.7z &&\
    cd dolphin1.01_source/source/ &&\
    cp /work/Makefile . &&\
    make sse42 &&\
    mv YaneuraOu-by-gcc /out/dolphin101-sse42