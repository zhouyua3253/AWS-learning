## Route 53

### Register domain

+ By AWS domain registration service
    - Domain name: yumin.click
+ Transfer an existing domain to AWS Route 53
    - Domain name: yumin.site

### Hosted zones -> Create hosted zone

+ Domain name: yumin.click, yumin.site
+ Change the Nameservers:
    - Copy the nameservers from Hosted zone records to the domain management tool.
    - See screenshot.

### Simple routing: A record/Alias to the AWS resource

+ A record: Assign a subdomain to IP address
    - Record name: web-1.yumin.click
    - Record type: A
    - Value:
        1. Routing traffic to a single resource: 54.179.42.88
        2. Routing traffic to a single record with multiple values. 54.179.42.88, 13.48.45.238, 1.2.3.4 <br>
           **Note**: Route 53 returns the values in a random order to the client, and you can't weight or otherwise
           determine the order with a simple routing policy.
    - Routing policy: **Simple routing**

+ Alias: Assign a subdomain to AWS resource
    - Record name: web-2.yumin.click
    - Record type: A
    - Alias: enable
        1. Alias to Application and Classic Load Balancer
        2. Alias to CloudFront distribution
        3. Alias to Elastic Beanstalk environment
        4. Alias to S3 website endpoint ...
    - Routing policy: **Simple routing**

### Weighted routing policy: Route traffic to multiple resources in proportions that you specify

+ Pre-requirements: Multi domains/IPs
    1. http://sto.yumin.site
    2. http://sg.yumin.site

+ Create healthy check
    1. Check http://sto.yumin.site
        + Name: sto-healthy-check
        + What to monitor: Endpoint
        + Specify endpoint by: Domain name
        + Domain name: sto.yumin.site
        + Advanced configuration: ... 30 seconds interval is basic check, frr of charge
        + Alarms: SNS service
    2. Check http://sg.yumin.site
        + Name: sg-healthy-check
        + What to monitor: Endpoint
        + Specify endpoint by: Domain name
        + Domain name: sg.yumin.site
        + Advanced configuration: ... 30 seconds interval is basic check, frr of charge
        + Alarms: SNS service

+ Creating more than one record of the same name and type: Route 53 -> Hosted zones -> Create record
    - Record name: global.yumin.site
    - Record type: A
    - Alias: enable
    - Route traffic to: Alias to Application and Classic Load Balancer
    - Routing policy: Weighted
    - Weight: 0 ~ 255
    - Health check: Only route traffic to healthy endpoint
        - sto-healthy-check
        - sg-healthy-check

### dig: a tool for querying DNS nameservers for information about host addresses

+ domain -> address: dig domain @server

> dig web.yumin.site @8.8.8.8

+ address -> domain: dig -x domain @server

> dig -x 18.141.59.70 @8.8.8.8
