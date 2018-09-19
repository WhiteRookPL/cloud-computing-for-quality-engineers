import { App, PolicyStatement, Stack, StackProps } from '@aws-cdk/cdk';
import { Group, Policy, User } from '@aws-cdk/aws-iam';

const PARTICIPANT_AMOUNT = 20;

interface CloudComputingForQualityEngineersStackProps extends StackProps {
  password: string;
  region: string;
}

class CloudComputingForQualityEngineersStack extends Stack {
  constructor(parent: App, id: string, props?: CloudComputingForQualityEngineersStackProps) {
    super(parent, id, props);

    const participantsGroup = new Group(this, 'CloudComputingForQualityEngineersParticipants');

    participantsGroup.attachManagedPolicy('arn:aws:iam::aws:policy/AdministratorAccess');

    for (let index = 1; index <= PARTICIPANT_AMOUNT; ++index) {
      new User(this, `User${index}`, {
        userName: `cloud-computing-for-quality-engineers-user-${index}`,
        password: props.password,
        groups: [ participantsGroup ]
      });
    }

    return this;
  }
}

class MyApp extends App {
  constructor(argv: string[]) {
    super(argv);

    new CloudComputingForQualityEngineersStack(this, 'cloud-computing-for-quality-engineers-infrastructure', {
      password: this.getContext("password"),
      region: this.getContext("region")
    });
  }
}

process.stdout.write(new MyApp(process.argv).run());
