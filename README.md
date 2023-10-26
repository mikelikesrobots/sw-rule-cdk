# SiteWise Updates using CDK-created IoT Rule

## Setup

### CDK Stack

To deploy the stack using CDK, follow the instructions [here](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) to install CDK. Make sure that the AWS CLI is set up with valid credentials, then execute:

```bash
cd cdk
cdk deploy
# Enter y when prompted to accept the deployment
```

You can destroy all created assets by executing:

```bash
cdk destroy
```

### Python

`virtualenv` is recommended for installing system dependencies. For example:

```bash
sudo apt install -y python3-pip
pip3 install virtualenv
python3 -m virtualenv venv
source venv/bin/activate
pip install -r requirements
```

Make sure that the AWS CLI is set up with valid credentials and permission to publish messages to IoT Core. Then, run the main file:

```bash
python main.py
```

It should repeatedly publish update messages, having randomly generated a battery health value. It should be possible to see different battery discharge rates between the robots.
