# Assignment 5: Testable Infrastructure

## Description

In this example we would like to present how to prepare an AMI that is automatically tested after provisioning, and how to setup such pipeline on AWS without any requirement for Jenkins.

We will do that by provisioning an EC2 instance with use of *Ansible*, then we will test it with *Serverspec*, and after successful pass - we will snapshot and bake an *AWS AMI* using *Packer*.

<p align="center">
  <img src="https://github.com/WhiteRookPL/cloud-computing-for-quality-engineers/raw/master/assignments/assignment-5/docs/diagram.png" />
</p>

## Steps to reproduce

1. Fork this repository in your *Github* account.
  - We would really appreciate if you could **star** that repository too! :wink:
2. Configure *AWS CodePipeline* orchestration flow.
  - As a first step we create a job which will automatically trigger whole flow after pushing new changes.
    - Connect your *Github* account with *AWS CodeBuild* in `eu-central-1` region.
  - As a second step we create *AWS CodeBuild* job that will provision, bake and test the *AMI*.
    - Use existing service role for *AWS CodePipeline* in the last step: `AWS-CodePipeline-Service`.
3. Attach existing `PackerPolicy` to the newly created *AWS CodeBuild* role.
  - It allows to execute necessary actions, when Packer bakes the new image.
4. In order to see how main build job works, let's review the `buildspec.yml` file with related configuration files and scripts.

## FAQ and Cheat-sheet

- You can omit the first step in the *AWS CodePipeline* and configure just the second step.
  - Path to the *AWS CodeBuild* job definition: `assignments/assignment-5/buildspec.yml`
  - Otherwise, you can use a *symbolic link* created in the root of the repository.
- Existing policy for *Packer*: `PackerPolicy`
- Existing service role for *AWS CodePipeline*: `AWS-CodePipeline-Service`
- If you want to invoke that from the *localhost*, you need to install *Packer* locally and configure *IAM Access Key* with your `aws-cli`.
- How to fetch latest CentOS 7 x64 AMI ID?
  - ``` 
    aws ec2 describe-images                                          \
      --profile=white-rook-workshops                                 \
      --owners 'aws-marketplace'                                     \
      --filters 'Name=product-code,Values=aw0evgkw8e5c1q413zgy5pjce' \
      --query 'sort_by(Images, &CreationDate)[-1].[ImageId]'         \
      --output 'text'
    ```
- Beware, that we are creating *IAM* in this assignment, so changes in that matter may be visible with **after** a small delay.

## References

- [Amazon Machine Image](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Ansible](http://docs.ansible.com)
- [Packer](https://www.packer.io/docs/builders/amazon-ebs.html)
- [Serverspec](http://serverspec.org)
- [How to Create an AMI Builder with AWS CodeBuild and HashiCorp Packer](https://aws.amazon.com/blogs/devops/how-to-create-an-ami-builder-with-aws-codebuild-and-hashicorp-packer/)
