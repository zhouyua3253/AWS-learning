## IAM

### Customize Account Alias

+ Change the Account Alias from 894512871071 to **yumin-aws**. Sign-in URL for IAM users in this
  account **https://yumin-aws.signin.aws.amazon.com/console**

### Creat admin user group

+ Name: admin-user-group
+ Attach permissions policies: AdministratorAccess

### Create admin user

+ User name: yumin-admin-user
+ Select AWS credential type: Password - AWS Management Console access.
+ Console password: Custom password
+ Set permissions: Add user to group-> admin-user-group

### Users -> yumin-admin-user -> Security credentials

+ Assigned MFA device: Virtual MFA device
+ Create Access keys: <br>
  Use access keys to make programmatic calls to AWS from the AWS CLI, Tools for PowerShell, AWS SDKs, or direct AWS API
  calls.<br>
  Create access key: Access key ID + Secret access key

### IAM user login

+ Account ID (12 digits) or account alias: yumin-aws
+ IAM user name: yumin-admin-user
+ Password: Ljxxxxxx
+ MFA Code: XXXXXX
