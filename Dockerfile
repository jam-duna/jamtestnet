# Use a Unix-based image, such as Debian
FROM debian:latest
WORKDIR /jam
ENV CARGO_MANIFEST_DIR=/jam
COPY bin/jam /jam
COPY bandersnatch/data/zcash-srs-2-11-uncompressed.bin /jam/data/zcash-srs-2-11-uncompressed.bin
COPY genesis.json /jam/genesis.json
EXPOSE 9000/udp
RUN chmod +x /jam/jam
CMD ["./jam", "--port=9000"]
