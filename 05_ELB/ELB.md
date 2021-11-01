## ELB: Load Balancing

Load balancer has IP address and domain.

### Pre-requirements

+ At least 2 running EC2 instances, in same VPC.
+ Better to be running in different availability zone.

1. EC2-a
    + VPC: yumin-vpc
    + Availability Zone: ap-southeast-1a
    + Subnet: subnet-public-1a
    + Route Table: public-net-rtb
    + IP: 172.16.10.100
    + Security Group: public-web-sg

2. EC2-b
    + VPC: yumin-vpc
    + Availability Zone: ap-southeast-1b
    + Subnet: subnet-public-1b
    + Route Table: public-net-rtb
    + IP: 172.16.11.100
    + Security Group: public-web-sg

### EC2 -> Load Balancing -> Target Groups -> Create Target Group

1. Specify group details
    + Choose a target type: Instances/IP addresses/Lambda function
    + Group name: elb-ec2-target-group
    + Protocol: HTTP 80
    + VPC: yumin-vpc
    + Protocol version: HTTP1
    + Health checks:
        + Health check path: Specify the URL to be checked, e.g. /
        + Advanced health check settings:
            + Healthy threshold: Achieve how many times be considered health
            + Unhealthy threshold: Achieve how many times be considered unhealthy
            + Interval: Waiting x seconds, and execute next time health check
            + Success codes: 200. If received 200 status code, see it as health
              <br><br>
2. Register targets: Register EC2 into the group
    + Select Available instances into the group.
    + Ports for the selected instances: 80
    + Click: Include as pending below

### EC2 -> Load Balancing -> Load Balancers -> Create Load Balancer

+ Load balancer types: Application Load Balancer (HTTP, HTTPS)
+ Load balancer name: elb-ec2-load-balancer
+ Scheme: Internet-facing
+ VPC: yumin-vpc
+ Mappings: Select at least two Availability Zones and one subnet per zone
+ Security group: public-web-sg
+ Listeners and routing:
    + Protocol: HTTP 80
    + Forward to: elb-ec2-target-group

### Load Balancer has own IP/DNS

> elb-ec2-load-balancer-1847686605.ap-southeast-1.elb.amazonaws.com

So the EC2 instances don't need to have public IP address to provide web service.<br>
Users -> ELB(public IP) -> EC2s (private IP)


