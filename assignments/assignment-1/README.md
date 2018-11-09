# Assignment 1: Cloning your Test Environment

## Description

In this assignment we will deal with the shortage of testing environments. We will show how to prepare a copy of your testing environment, with a little bit of reconfiguration.

Our *test environment* is built from following services and instances:

- A *back-end server* hosted on an EC2 instance with public facing IP.
- A *database instance* connected with the *back-end server*, hosted on the *Amazon RDS*.

<p align="center">
  <img src="https://github.com/WhiteRookPL/cloud-computing-for-quality-engineers/raw/master/assignments/assignment-1/docs/diagram.png" />
</p>

## Steps to reproduce

1. Locate *VM* inside *EC2* which is called `test-environment-back-end-master`.
2. Create *AMI* based on that machine - remember to ensure reboot in order to preserve consistency.
    - Wait for completion of *AMI* registration process.
    - Note the *AMI ID* of the created image.
3. Spin up a new *VM* inside *EC2* with publicly accessible IP address with use of the previous image.
    - After downloading the key-pair, if you are macOS / Linux user you can proceed without any further changes.
    - For Windows users, we need to fetch and install *PuTTY* with the companion tools.
        - Then we need to convert the key-pair in *PEM* format into *PPK*:
            - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html
    - After spinning the new instance, you should locate the *public hostname*.
        - Open a web browser and head to a following `http://PUBLIC_ADDRESS_IPV4:8080/` page.
            - You will see details of the running application - but still connected to the old database.
2. Now, head to the *Amazon RDS* service and locate database instance which is called `test-environment-db-master`.
3. Create a snapshot of that *database*, we can rely on one of the existing snapshots.
4. Create a new database instance - using previously created snapshot.
5. SSH into your machine and reconfigure the application changing `host` inside `config.json` file.
    - Look under following path:
        - `/home/centos/cloud-computing-for-quality-engineers/assignments/assignment-1/src`
6. After updating that restart all services with a command `pm2 restart`.
    - `pm2` is a *process management* tool for *Node.js* application.
7. If everything went successfully, after opening a web browser on the following page: `http://PUBLIC_ADDRESS_IPV4:8080/` we should see details of the new database.

## FAQ and Cheat-sheet

- *Linux* and *macOS* users have to setup proper permissions on their keys:
  - `chmod 0600 path_to_your_downloaded_key.pem`
- User: `centos`.
- Server is running on port `8080`.
- AMI ID used for that assignment: `ami-0a5282c10742fd306`
- Security Groups used for this assignment:
  - `http-server-node-js-database` - for *EC2* and *RDS*.
  - `http-server-node-js` - for *EC2*.
- Creating *Amazon RDS* instance takes some time - usually 2-7 minutes.

## References

- [Amazon Relational Database Service](https://aws.amazon.com/rds/)
- [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/)
- [Amazon Machine Image](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Using Amazon SSH Key-Pairs on Windows](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
- [`pm2`](http://pm2.keymetrics.io/)
