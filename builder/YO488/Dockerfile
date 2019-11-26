FROM amazonlinux:2.0.20191016.0

RUN yum install -y gcc gcc-c++ make build-essential git

WORKDIR /work
COPY Makefile Makefile

CMD git clone https://github.com/yaneurao/YaneuraOu.git -b V4.88 && \
    cp Makefile YaneuraOu/source/ && \
    cd YaneuraOu/source && make normal && \
    mv YaneuraOu-by-gcc /out/YO488-sse42
