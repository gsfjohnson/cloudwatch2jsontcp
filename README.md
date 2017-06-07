# cloudwatch2jsontcp
Send Cloudwatch logs as json to tcp destination.

## More information about AWS Lambda
  * http://aws.amazon.com/lambda/
  
## Get the code and prepare it for the uploading to AWS
* Clone the git repo
```bash
git clone https://github.com/gsfjohnson/cloudwatch2jsontcp.git
cd cloudwatch2jsontcp
```
* Install required npm packages.
```
npm install
```

* zip up your code
```bash
zip -r lambda.zip index.js node_modules
```

The resulting zip (lambda.zip) is what you will upload to AWS.

## Setting up AWS
Use the AWS console following [this 
example](http://docs.aws.amazon.com/lambda/latest/dg/getting-started-amazons3-events.html).  Below, you will find a high-level 
description of how to do this.  I also found [this blog post](http://alestic.com/2014/11/aws-lambda-cli) on how to set things up 
using the command line tools.

### Create and upload the function in the AWS Console
1. Create Role
  1. Sign in to your AWS account and open IAM console https://console.aws.amazon.com/iam/
  1. In your IAM console create a new Role say, 'cloudwatch-full-access'
  1. Select Role Type as 'AWS Lambda'
  1. Apply policy 'CloudWatchFullAccess' and save.
1. Create lambda function
  1. https://console.aws.amazon.com/lambda/home
  1. Click "Create a Lambda function" button. *(Choose "Upload a .ZIP file")*
    * **Name:** *cloudwatch2jsontcp*
    * Upload lambda function (zip file you made above.)
    * **Handler*:** *index.handler*
    * Set Role : *cloudwatch-full-access*
    * Set Timeout to 2 minutes
  1. Go to your Lamda function and select the "Event sources" tab
    * Click on **Add Event Source**
    * Event Source Type : *CloudWatch Logs*
    * Log Group : Select your log group whose logs you want to send.
    * Filter Name: Provide your filter name.
    * Filter Pattern: This is not a mandatory field. You can keep it empty.
    * Enable Event Source : *Enable Now*
 Now click on submit and wait for the events to be sent.

**NOTE**: Always use latest version of **AWSCLI**. Some features may not work on older versions of AWSCLI. To upgrade, use the command given below

`pip install --upgrade awscli`

