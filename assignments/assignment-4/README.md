# Assignment 4: Querying unstructured data with the power of SQL

## Description

There are couple of additional services available on AWS that are really helpful, and do not require any infrastructure management.

Sometimes we need to parse huge amount of logs to pinpoint a series of failed requests or to extract statistical data. If amount of logs is significant, it starts to be painful to analyze locally or even on a single machine. It is also very hard and problematic to engage huge *map-reduce* clusters, if you have not performed any analysis remotely close to that one.

We would like to present a *serverless*, interactive query service called *Amazon Athena* and query the provided files with ease of use of *SQL* queries.

<p align="center">
  <img src="https://github.com/WhiteRookPL/cloud-computing-for-quality-engineers/raw/master/assignments/assignment-4/docs/diagram.png" />
</p>

## Steps to reproduce

1. Review the file structure on *S3*.
    - We analyze bucket called `workshops.white-rook.pl`.
    - Have a look on an individual file and summary size of those 3 days.
2. Creating table from the multiple raw text files stored in the *S3* bucket.
    - Change *AWS* service to *Amazon Athena*.
        - Change the database to the `default`.
    - Create a table with a following definition:
        - ```
          CREATE EXTERNAL TABLE IF NOT EXISTS elb_logs_raw_native (
            request_timestamp string,
            elb_name string,
            request_ip string,
            request_port int,
            backend_ip string,
            backend_port int,
            request_processing_time double,
            backend_processing_time double,
            client_response_time double,
            elb_response_code string,
            backend_response_code string,
            received_bytes bigint,
            sent_bytes bigint,
            request_verb string,
            url string,
            protocol string,
            user_agent string,
            ssl_cipher string,
            ssl_protocol string )
          ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.RegexSerDe'
          WITH SERDEPROPERTIES (
                   'serialization.format' = '1','input.regex' = '([^ ]*) ([^ ]*) ([^ ]*):([0-9]*) ([^ ]*)[:\-]([0-9]*) ([-.0-9]*) ([-.0-9]*) ([-.0-9]*) (|[-0-9]*) (-|[-0-9]*) ([-0-9]*) ([-0-9]*) \\\"([^ ]*) ([^ ]*) (- |[^ ]*)\\\" (\"[^\"]*\") ([A-Z0-9-]+) ([A-Za-z0-9.-]*)$' )
          LOCATION 's3://workshops.white-rook.pl/elb/raw/';
          ```
3. How we came up with the list of fields and deserialization scheme?
    - It is described [here](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/access-log-collection.html#access-log-entry-format).
    - After creating a table from it, you can manage its schema with use of *AWS Glue Data Catalog* service.
4. Thanks to previous query *Athena* created a well-defined table from a textual representation that can be queries with a regular *SQL*.
    - Example queries:
        - `SELECT * FROM elb_logs_raw_native WHERE elb_response_code = '200' LIMIT 100;`
        - `SELECT COUNT(*) AS count, elb_response_code FROM elb_logs_raw_native GROUP BY elb_response_code ORDER BY count DESC;`
        - `SELECT COUNT(*) AS count, DISTINCT request_ip, elb_response_code FROM elb_logs_raw_native GROUP BY request_ip, elb_response_code ORDER BY count DESC LIMIT 100;`
    - If any query will go be slow or go above the expected time, you can cancel it going to the *History* tab.

## FAQ and Cheat-sheet

- Have a look on time and scanned data size - we can improve both.
  - We can do that by partitioning data and converting textual representation into binary *Apache Parquet*.
  - Moreover, there is additional service called *AWS Glue*, which is a managed service for *ETL jobs* which can do that for us.
    - Including industrialization and automation the whole process.

## References

- [Amazon S3](https://aws.amazon.com/s3/)
- [Amazon Athena](https://aws.amazon.com/athena/)
- [Analyzing data in S3 using Amazon Athena](https://aws.amazon.com/blogs/big-data/analyzing-data-in-s3-using-amazon-athena/)
