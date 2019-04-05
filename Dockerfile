FROM indyperf/jdk.mvn.npm:1.0

WORKDIR /opt/indy.ui

ADD . /opt/indy.ui

RUN mvn clean -DskipTests=true package && \
    cp /opt/indy.ui/deployments/launcher/target/indy-launcher-1.7.4-SNAPSHOT-complete.tar.gz /opt/indy.ui && \
    tar -xvf indy-launcher-1.7.4-SNAPSHOT-complete.tar.gz

RUN chgrp -R 0 /opt/indy.ui && \
    chmod -R g=u /opt/indy.ui && \
    cd /opt/indy.ui/indy/var/lib/indy/ui

EXPOSE 8000
CMD http-server --proxy http://indy-perf:8080 --cors -p 8000
