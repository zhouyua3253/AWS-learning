## EC2

### Launch Amazon Linux 2 instance, public network

1. Choose Amazon Linux 2 AMI
2. Choose an Instance Type
3. Configure Instance Details
    + Network: yumin-vpc
    + Subnet: subnet-public
    + Auto-assign Public IP: true
    + Network interfaces: eth0 -> 172.16.10.100
4. Add Storage
5. Add Tags
    + Name: ec2-public-1
6. Configure Security Group
    + Select an existing security group: public-sg
7. SSH key pair: ec2-keypair.pem

---

### Launch Amazon Linux 2 instance, private network

1. Choose Amazon Linux 2 AMI
2. Choose an Instance Type
3. Configure Instance Details
    + Network: yumin-vpc
    + Subnet: subnet-private
    + Auto-assign Public IP: false
    + Network interfaces: eth0 -> 172.16.20.100
4. Add Storage
5. Add Tags
    + Name: ec2-private-1
6. Configure Security Group
    + Select an existing security group: private-sg
7. SSH key pair: ec2-keypair.pem

### Install docker

```bash
# Update yum
sudo yum update -y
# List all the amazon-linux-extras packages
sudo amazon-linux-extras list
# Install docker
sudo amazon-linux-extras install docker
# Start docker service immediately
sudo systemctl start docker
#   Register docker service, start docker on boot
sudo systemctl enable docker
```

### Install git

```bash
[ec2-user@ip-172-16-10-100 ~]$ sudo yum install git -y
```

### Install port scanning tool: ***nmap***

```bash
[ec2-user@ip-172-16-10-100 ~]$ sudo yum install nmap -y

[ec2-user@ip-172-16-10-100 ~]$ nmap localhost
Starting Nmap 6.40 ( http://nmap.org ) at 2021-10-31 12:51 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00037s latency).
Not shown: 997 closed ports
PORT    STATE SERVICE
22/tcp  open  ssh
25/tcp  open  smtp
111/tcp open  rpcbind

Nmap done: 1 IP address (1 host up) scanned in 0.08 seconds
```

### Install nodejs with nvm

> https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
$ . ~/.nvm/nvm.sh
$ nvm install 14.18
$ node -v
```

#### Install nodejs with docker

```bash
$ docker pull node:14

# Running nodejs
$ docker run -it --name nodejs node:14 /bin/bash

# Keep running nodejs in background
# -it: STDIN interactive mode 命令行交互
# -d: Run container in background and print container ID 后台运行
$ docker run -itd --name nodejs node:14

# Connect to nodejs running environment
$ docker exec -it nodejs /bin/bash

# Test
$ echo 'console.log("hello world")' >> main.js
$ node main.js
```

### Create own AMI (Amazon machine image)

1. Stop running ec2 instance
2. Actions -> Image and templates -> Create image

### Copy AMI to other regions

+ EC2 -> AMI2 -> Select a AMI -> Actions -> Copy AMI

### SSH to the private EC2 via the public EC2

+ Private EC2 IP: 172.16.20.100, in subnet-private
+ Public EC2 IP: 172.16.10.100, in subnet-public

1. SSH to the public EC2

   ```bash
   ssh -i ec2-keypair.pem ec2-user@public-ip-address
   ```
2. Copy ec2-keypair.pem from local to the Public EC2
   ```bash
   vi ec2-keypair.pem
   # copy ec2-keypair.pem content to ec2-keypair.pem && save
   ```

3. chmod 400 ec2-keypair.pem, do once only
   ```bash
   chmod 400 ec2-keypair.pem
   ```

3. SSH to the private EC2
   ```bash
   ssh -i ec2-keypair.pem ec2-user@172.16.20.100
   ```

### Enable the private EC2 to access the Internet, via the NET gateway.<br>NET gateway is expensive, remove it when complete the operation

1. Open the VPC dashboard -> NAT gateways
2. Create NAT gateway
    + Name: yumin-nat-gateway
    + Subnet: subnet-public, assigned to the Internet accessible subnet
    + Connectivity type: Public
    + Assign an Elastic IP address to the NAT gateway
3. Add a new route to the private-net-rtb route table
    + Destination: 0.0.0.0/0 	
      Target: yumin-nat-gateway
4. The private EC2 is access to the Internet now
5. Remove the NAT gateway & Elastic IP address once completed

### Elastic IP addresses
1. Allocate Elastic IP address:
2. Associate Elastic IP address
   + Resource type: Instance
   + Instance: ec2-public-1
3. If Elastic IP associated to a stopped EC2, will be charged

### View all the IP address

+ *EC2 -> Network & Security -> Network Interfaces*

## Basic Linux Commands

+ Switch to root user: sudo -s

```bash
[ec2-user@ip-172-16-10-100 ~]$ sudo -s
[root@ip-172-16-10-100 ec2-user]# 
```

+ Check linux version: cat /etc/os-release

```bash
[ec2-user@ip-172-16-10-100 ~]$ cat /etc/os-release 
NAME="Amazon Linux"
VERSION="2"
ID="amzn"
ID_LIKE="centos rhel fedora"
VERSION_ID="2"
PRETTY_NAME="Amazon Linux 2"
ANSI_COLOR="0;33"
CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"
HOME_URL="https://amazonlinux.com/"
```

+ df -h

```bash
[ec2-user@ip-172-16-10-100 ~]$ df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        482M     0  482M   0% /dev
tmpfs           492M     0  492M   0% /dev/shm
tmpfs           492M  452K  491M   1% /run
tmpfs           492M     0  492M   0% /sys/fs/cgroup
/dev/xvda1      8.0G  3.6G  4.4G  45% /
tmpfs            99M     0   99M   0% /run/user/1000
```

+ top -c

```
top - 08:42:24 up  3:56,  1 user,  load average: 0.00, 0.00, 0.00
Tasks:  84 total,   1 running,  47 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1006888 total,   660676 free,   101544 used,   244668 buff/cache
KiB Swap:        0 total,        0 free,        0 used.   765644 avail Mem 
  PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND                                                                                       
    1 root      20   0  125540   5404   3916 S  0.0  0.5   0:01.63 /usr/lib/systemd/systemd --switched-root --system --deserialize 21                            
    2 root      20   0       0      0      0 S  0.0  0.0   0:00.00 [kthreadd]                                                                                    
    4 root       0 -20       0      0      0 I  0.0  0.0   0:00.00 [kworker/0:0H]                                                                                
    6 root       0 -20       0      0      0 I  0.0  0.0   0:00.00 [mm_percpu_wq]                                                                                
    7 root      20   0       0      0      0 S  0.0  0.0   0:00.12 [ksoftirqd/0]                                                                                 
    8 root      20   0       0      0      0 I  0.0  0.0   0:00.25 [rcu_sched]                                                                                   
    9 root      20   0       0      0      0 I  0.0  0.0   0:00.00 [rcu_bh]                                                                                      
   10 root      rt   0       0      0      0 S  0.0  0.0   0:00.00 [migration/0]                                                                                 
   11 root      rt   0       0      0      0 S  0.0  0.0   0:00.03 [watchdog/0]                                                                                  
   12 root      20   0       0      0      0 S  0.0  0.0   0:00.00 [cpuhp/0]  
```

+ Check xxx process: ps aux|grep xxx

```bash
[ec2-user@ip-172-16-10-100 ~]$ ps aux|grep docker
root      4247  0.0  8.0 1299816 80832 ?       Ssl  12:42   0:00 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --default-ulimit nofile=32768:65536
ec2-user  5094  0.0  0.0 119392   964 pts/0    S+   12:46   0:00 grep --color=auto docker
```

+ nohup: Running in background

```bash
nohup node main.js > running.out &
# If need the sudo permission, such as listening 80 port
nohub sudo "$(which node)" web-app.js > running.out &
```

+ Stop the background running process

```bash
[ec2-user@ip-172-16-10-100 ~]$ ps aux|grep node
root      5335  0.0  0.7 241796  7168 ?        S    03:36   0:00 sudo /home/ec2-user/.nvm/versions/node/v17.0.1/bin/node web.js
root      5339  0.0  3.4 594800 35012 ?        Sl   03:36   0:00 /home/ec2-user/.nvm/versions/node/v17.0.1/bin/node web.js
ec2-user  8831  0.0  0.0 119392   880 pts/0    S+   03:55   0:00 grep --color=auto node

[ec2-user@ip-172-16-10-100 ~]$ sudo kill 5335
```

