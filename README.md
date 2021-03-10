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