## VPC

### Create a vpc

+ Name: yumin-vpc
+ IPv4 CIDR block: 172.16.0.0/16 (172.16.0.0 ~ 172.31.255.255)

### Create subnets, works inside Availability Zone

1. Create public subnet
    + Name: subnet-public
    + IPv4 CIDR block: 172.16.10.0/24 (172.16.10.0 ~ 172.31.10.255)
    + Availability Zone: ap-southeast-1a
2. Create private subnet
    + Name: subnet-private
    + IPv4 CIDR block: 172.16.20.0/24 (172.16.20.0 ~ 172.31.20.255)
    + Availability Zone: ap-southeast-1a

### Create Internet Gateway

+ Name: yumin-vpc-igw
+ Attach to VPC: yumin-vpc

### Create Route Tables

1. Create public network route table
    + Name: public-net-rtb
    + Attach to VPC: yumin-vpc
    + Edit routes:
        1. Destination: 172.16.0.0/16 	
           Target: local
        2. Destination: 0.0.0.0/0 	
           Target: yumin-vpc-igw (Internet Gateway)
    + Associate Subnet: subnet-public

2. Create private network route table
    + Name: private-net-rtb
    + Attach to VPC: yumin-vpc
    + Edit routes:
        1. Destination: 172.16.0.0/16 	
           Target: local
    + Associate Subnet: subnet-private

### Network ACL, works on the VPC/subnet level

+ Name: yumin-vpc-acl
+ VPC: yumin-vpc
+ Inbound rules: Allow all traffic, all port. 
  If specify *allow 22, 80, 443 port* only, ec2 could not access to the Internet
+ Outbound rules: Allow all traffic, all port
+ Optional: set whitelist, blacklist on the Inbound/Outbound rules

### Security Groups, works on the instance/resource level, ec2, elb, s3...

1. Create public security group:
    + Name: public-sg
    + VPC: yumin-vpc
    + Inbound rules:
        1. Port: SSH Source: your current ip address
        2. Port: HTTP Source: 0.0.0.0/0
    + Outbound rules:
        + All traffic 0.0.0.0/0

2. Create private security group:
    + Name: private-sg
    + VPC: yumin-vpc
    + Inbound rules:
        + Port: SSH
        + Source: 172.16.0.0/16
    + Outbound rules:
        + All traffic 0.0.0.0/0
   
3. Associate security groups to the AWS instance, ec2, s3...
   

 


