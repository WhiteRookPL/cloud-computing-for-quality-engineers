# Assignment 3: Logs Management as a Service

## Description

Now, we would like to present how easy is to manage logs infrastructure on *AWS*, without bothering and configuring *ELK stack* (*Elasticsearch*, *Logstash*, *Kibana*) and similar solutions on your own.

*AWS* inside a *Amazon Elasticsearch Service* by default provides an *Elasticsearch* cluster with *Kibana* the only missing piece is log shipping that we need to configure on our machines.

<p align="center">
  <img src="https://github.com/WhiteRookPL/cloud-computing-for-quality-engineers/raw/master/assignments/assignment-3/docs/diagram.png" />
</p>

## Steps to reproduce

1. Spin up a new *VM* inside *EC2* with publicly accessible IP address.
    - **Remember to use the same keys or download new ones.**
2. Log into that machine and confirm that it produces logs with a following command:
    - `tail -F /home/centos/cloud-computing-for-quality-engineers/assignments/assignment-3/src/combined.log`
3. Set up an *Amazon Elasticsearch Service* cluster.
    - No need for attaching it to our *VPC*.
    - For access policy use publicly available one.
        - We do that in order to simplify the process and do not deal with tunneling or setting up the *user directory* service.
4. Install `filebeat` on our machine.
    - ```
      curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.4.2-x86_64.rpm
      sudo rpm -vi filebeat-6.4.2-x86_64.rpm
      ```
5. Configure installed `filebeat` to fetch log files from a provided location and ship them to the *Elasticsearch*.
    - Edit file `/etc/filebeat/filebeat.yml` as our template presented [here](./configuration/filebeat.yml).
6. Restart `filebeat` service with the command: `sudo service filebeat restart`.
7. Confirm in the *Kibana UI* that we are receiving logs from our instance after creating first *index definition*.

## FAQ and Cheat-sheet

- AMI ID used for that assignment: `ami-0a5282c10742fd306`
- Creating *Amazon Elasticsearch Service* cluster takes some time - usually 5-15 minutes.

## References

- [Amazon Elasticsearch Service](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-kibana.html)
- [Filebeat](https://www.elastic.co/products/beats/filebeat/)
- [`pm2`](http://pm2.keymetrics.io/)
