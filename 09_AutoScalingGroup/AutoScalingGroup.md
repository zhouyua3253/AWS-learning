## Auto Scaling Group

### EC2 -> Auto Scaling -> Launch Configurations -> Create launch configuration
+ Name: yumin-asg-configuration
+ AMI: yumin-ec2-web-ami
+ Instance type: t2.micro ...
+ IAM instance profile: ec2-ssm-role
+ Enable EC2 instance detailed monitoring within CloudWatch
+ Assign a security group: Select an existing security group
+ Key pair: Choose an existing key pair, or Proceed without a key pair

### EC2 -> Auto Scaling -> Create Auto Scaling group
1. Choose launch template or configuration
    + Name: yumin-asg
    + Launch configuration: yumin-asg-configuration
2. Choose instance launch options:
    + VPC: yumin-vpc
    + Availability Zones and subnets: 1a, 1b, 1c
3. Configure advanced options:
    + Load balancing - optional
        - Attach to a new load balancer
    + Health checks - optional
4. Configure group size and scaling policies
    1. Group size - optional
        + Desired capacity
        + Minimum capacity
        + Maximum capacity
    2. Scaling policies - optional
        + Target tracking scaling policy
5. Add notifications
6. Tags
