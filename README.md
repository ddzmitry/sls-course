# sls-course
sls-course


> Getting started
```
https://github.com/codingly-io/sls-base

sls create --name YOUR_PROJECT_NAME --template-url https://github.com/codingly-io/sls-base
cd YOUR_PROJECT_NAME
npm install
```

> Deploy 
```
sls deploy -v
```
> To see 
```
CloudFormation -> Stacks
```

> To remove 
```
sls remove -v
```
> To deploy single funciton 
```
sls deploy -f createAuction  -v

```
> Middleware for Lambdas 
```
https://github.com/middyjs/middy
npm install @middy/core @middy/http-event-normalizer @middy/http-error-handler @middy/http-json-body-parser
npm install http-errors
```
> To read logs localy 
```
processAuctions - name of the function 

sls logs -f processAuctions -t
sls logs -f sendMail -t

> log ine minute ago
sls logs -f processAuctions --startTime 1m 
```
> to invoke function !IMPORTANT
```
sls invoke -f processAuctions -l

sls invoke local -f createAuction --data '{ "title": "Some Cool Potato"}'

```

> JSON validator
```
npm install @middy/validator
can provide default schema to the request object 
https://json-schema.org/
```

> Curl for Auth0
```
curl --location --request POST 'https://ddzmitry.auth0.com/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=EhzHpkuI0842QP78hHXI2HtoSaeL4nYm' \
--data-urlencode 'username=ddzmitry@yahoo.com' \
--data-urlencode 'password=Kainer2305!' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'

{"access_token":"U8Z9femkVpvWSp6ZPva_M9ZpMBeeAKKZ","id_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFUQXhORU13TXpFek5FRkdPVVV6UWtWRFJqRTNNREU1TWtVd016RkVOamhCTmpFM01rSTNOQSJ9.eyJuaWNrbmFtZSI6ImRkem1pdHJ5IiwibmFtZSI6ImRkem1pdHJ5QHlhaG9vLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82MDQyNWVmYmYyNzg5MzRkODA5NTU0Y2U5Nzk1MmI3MT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmRkLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIxLTAzLTEyVDAxOjM0OjI5LjMwNVoiLCJlbWFpbCI6ImRkem1pdHJ5QHlhaG9vLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZHptaXRyeS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjA0YWM0OGZjNDgxM2QwMDcwOWFlMTI0IiwiYXVkIjoiRWh6SHBrdUkwODQyUVA3OGhIWEkySHRvU2FlTDRuWW0iLCJpYXQiOjE2MTU1MTI4NjksImV4cCI6MTYxNTU0ODg2OX0.wrhAvIyoTD2InWF9cnjFiTz-xR9nu8juDgSre6frUQV9YEISbh6t4ApiiVSEH7dqZxnwEPE0HCs2IOm3Z1-z7K45acYlOr87JpXTY_CwbGoLoLvaxPSWzhAyfgoVrIQXY3O_bgRsFmJ3f2vaQ-yfZaB0GKfmuDbi4_S3rKXmVLVx1uJywWoSdx-RKPjtabFKFMBJ7fEl9U1ebCiwNUKkT2zf7Qhgb6GzPOLShiSUfsBSBu-MUdJlwLZAGlOz3y5Q6L1EYsLllMwOeEUbFXhT3ObMKxa_VEV2QiNpuH_mh8KI5jVnnasLzvWMBo1uVdkynYUoS7J17eTdT7By-LX_xA","scope":"openid profile email address phone","expires_in":86400,"token_type":"Bearer"}%

```

> Deploy 
```
sls deploy -v --stage dev
```

> SES
```
For emails
```
> SQS messaging Queue
```
{"subject": "Test Mails", "body": "123456", "recipient": "dzmitry.dubarau@gmail.com"}
```

> Providing outputs from the module  (Notification services )
```
Outputs:
      # Name that will be exported to use in another functions or even a project 
  MailQueueArn:
    Value: ${self:custom.mailQueue.arn}
    Export:
      Name: ${self:custom.mailQueue.name}-Arn
  MailQueueUrl:
    Value: ${self:custom.mailQueue.url}
    Export:
      Name: ${self:custom.mailQueue.name}-Url
  

Stack Outputs
SendMailLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:197480905965:function:notification-service-dev-sendMail:3
MailQueueUrl: https://sqs.us-east-1.amazonaws.com/197480905965/MailQueue-dev
MailQueueArn: arn:aws:sqs:us-east-1:197480905965:MailQueue-dev
ServerlessDeploymentBucketName: notification-service-dev-serverlessdeploymentbuck-w65o70jxcvl5
``
> Get info

```
sls info
```