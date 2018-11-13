# Assignment 2: Jenkins Slaves

## Description

In this assignment we would like to show how easy is to create a *VM* with use of *Amazon EC2*, then we will install there a *Jenkins*, configure it as a master node - and after by installing one plugin we will be able to harvest the whole power of *EC2* spawning *Jenkins slaves* on-demand for our builds.

<p align="center">
  <img src="https://github.com/WhiteRookPL/cloud-computing-for-quality-engineers/raw/master/assignments/assignment-2/docs/diagram.png" />
</p>

## Steps to reproduce

1. Create a new user called `jenkins`.
    - Select the check-box for programmatic access, and it will automatically generate the access key, which we will need later.
    - Assign a security policy presented [here](./infrastructure/jenkins-user-policy.json).
2. Spin up a new *VM* inside *EC2* with publicly accessible IP address with use of the proper *AMI*.
    - After downloading the key-pair, if you are macOS / Linux user you can proceed without any further changes.
    - For Windows users, we need to fetch and install *PuTTY* with the companion tools.
        - Then we need to convert the key-pair in *PEM* format into *PPK*:
            - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html
3. After accessing newly created instance with *SSH*, we can proceed with the following commands:
    - `sudo yum update -y`
    - `sudo pm2 stop all`
    - `sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo`
    - `sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key`
    - `sudo yum install jre jenkins -y`
    - `sudo service jenkins start`
4. Connect to `http://YOUR_SERVER_PUBLIC_DNS:8080` from your favorite browser.
    - You will be able to access Jenkins through its management interface, which will tell where to look for a first password.
        - `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`
5. The Jenkins installation script directs you to the *Customize Jenkins* page. Click *Install suggested plugins*.
6. Once the installation is complete, enter *Administrator Credentials*, click *Save Credentials*, and then click *Start Using Jenkins*.
7. On the left-hand side, click *Manage Jenkins*, and then click *Manage Plugins*.
8. Click on the *Available* tab, and then enter *Amazon EC2 plugin* at the top right.
9. Select the check-box next to *Amazon EC2* plugin, and then click *Install without restart*.
10. Once the installation is done, click *Go back* to the top page.
11. Click on *Manage Jenkins*, and then *Configure System*.
12. Scroll all the way down to the section that says *Cloud*.
13. Click *Add a new cloud*, and select *Amazon EC2*. A collection of new fields appears.
14. Fill out all the fields.
    - Note: You will have to *Add Credentials* of the kind *AWS Credentials*.
        - Enter credentials from the `jenkins` user and created key - values for *Access Key* and *Access Secret Key*.
        - **Remember to save a key if you generated one!**
    - Set also:
        - The *private key* (it can be the one you've generated for your user).
        - Setup *AMI* with the following one: `ami-0a5282c10742fd306`.
        - Setup *Security Group* names to `http-server-node-js`.
15. Play with settings e.g. you can enable *spot instances* and optimize the overall costs of your builds.

## FAQ and Cheat-sheet

- *Linux* and *macOS* users have to setup proper permissions on their keys:
  - `chmod 0600 path_to_your_downloaded_key.pem`
- User: `centos`.
- AMI ID used for that assignment: `ami-0a5282c10742fd306`
- Security Groups used for this assignment:
  - `http-server-node-js` - for *EC2*.

## References

- [AWS Whitepaper: Set Up a Jenkins Build Server](https://d1.awsstatic.com/Projects/P5505030/aws-project_Jenkins-build-server.pdf?refid=Partner_Email_1)
- [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/)
- [Amazon Machine Image](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Using Amazon SSH Key-Pairs on Windows](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)
