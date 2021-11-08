## CloudFront: CDN

### Create CloudFront -> Policies

Go to CloudFront -> Policies -> Create cache policy

1. Details:
    + Name: yumin-cf-policy
    + Description: Cloudfront customized policy
2. TTL settings: No need to modify
3. ***Cache key settings***: Choose which headers to include in the cache key.
    + Headers: Include the following headers
        - **Host** (Pass the hostname to EC2 instances, instead of xxx.elb.amazonaws.com)
    + Query strings: Specify the query for the HTTP request, optional<br>E.g. ?name=xxx&age=yy&index=z
        - name
        - age
        - index
    + Cookies: optional
4. Compression support:
    + Gzip
    + Brotli

### Create CloudFront distribution

+ Origin domain:
    - ELB
    - S3

+ Origins -> Protocol:
    - HTTP only: Send requests to HTTP 80 only, if origin(ELB, S3) is HTTP only.<br>
      Notice: if ELB:80 forwards to ELB:443 while ELB doesn't have an SSL certificate, it causes an infinite redirection
      disaster.

+ Default cache behavior:
    - Compress objects automatically: Yes
    - Viewer protocol policy: Redirect HTTP to HTTPS
    - Allowed HTTP methods: GET, HEAD, OPTIONS
    - Cache key and origin requests: Cache policy and origin request policy (recommended)
        + Cache policy: Choose one cache policy
            1. Managed: CachingOptimized,
            2. Custom: yumin-cf-policy

+ Settings:
    - Alternate domain name (CNAME): specify the domain name, one or multiple
        1. cf.yumin.click
        2. cloud-front-yumin.click
        3. ...
    - Custom SSL certificate - optional: only the certificates in **N.Virginia(us-east-1)** are selectable
        + *.yumin.click

### Route 53, create a record to the domain name

+ Record name: cf.yumin.click
+ Route traffic to: Alias to CloudFront distribution
+ Choose the cloudfront resource
+ Routing policy: Simple routing

### Geographic restrictions - optional

+ No restrictions
+ Allow list
+ Block list

Example: disable/enable China users to access theCloudFront

### Invalidations

Create invalidation -> Add object paths:  /*

### *Infinite redirections* solution

Issue: CloudFront:443 -> ELB:443 -> ELB:80 -> ELB:443 -> ELB:80 -> ... <br>
Reason: ELB:80 redirects to HTTPS://#{host}:443/#{path}?#{query}, but xxx.elb.amazonaws.com doesn't have SSL
certificate, so goes to ELB:80 again.<br>
Solution: Make sure the ELB:80 forwards to EC2 target group directly, not redirects to ELB:443

                
    
