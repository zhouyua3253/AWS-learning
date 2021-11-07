## ACM: AWS Certificate Manager

Not Global level, must specify region

### Services integrated with ACM

+ ELB
+ CloudFront
+ Elastic Beanstalk
+ API Gateway
+ ...

### Request certificate

+ Fully qualified domain name: *.yumin.site (support Wildcard Names)
+ Select validation method: DNS validation, recommended
    - Add *CNAME* name/value to DNS configuration manually
    - *Create records* in Route 53 for certificate by clicking the button

### Listen HTTPS 443 port in Load Balancer/CloudFront/Beanstalk...

+ !!! Edit security group: Enable 443 port in inbound rules !!!

+ EC2 -> Load Balancer -> Listeners -> Add Listener:
    - Protocol: HTTPS
    - Port: 443
    - Default actions:
        1. Forward to target group
        2. Redirect: could be customized #{protocol}://#{host}:#{port}/#{path}?#{query}<br>
           E.g. http 80 redirect to https 443, with Original host, path, query
        3. Return fixed response
    - Default SSL certificate: From ACM *.yumin.site
