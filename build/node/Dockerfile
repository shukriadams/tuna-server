FROM alpine:3.10

RUN apk update \
    && apk upgrade \
    && apk add bash \
    && apk add nodejs=10.19.0-r0 \
    && apk add npm=10.19.0-r0 \
    && mkdir -p /usr/tuna \
    && adduser -D -u 1000 tuna \
    && chmod 700 -R /usr/tuna \
    && chown -R tuna /usr/tuna

# copy the build zip in, unpack, stripping the first folder level when unzipping, then clean up build.zip
COPY ./.stage.tar.gz /tmp
RUN tar -xzvf /tmp/.stage.tar.gz -C /usr/tuna --strip 1 \
    && rm /tmp/.stage.tar.gz

USER tuna

CMD cd /usr/tuna && npm start
