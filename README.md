## Description

This repository is only responsible to prove a some result in a test, but have another purpose for studying and you can possible need for studying some technings have improve and workes in some test executed in insomnia, please enjoy! :D
## Installation

```bash
# Before run the app read this bellow...
-Before a run the app necessarily have a configuration in the file called 'sample.env'

-Create 3 databases for each development stage(development, production, test) renomate each name for you choice and set the names in file 'sample.env';

-SetUp the dev mode for you choice in property `NODE_ENV` in file `.env`;

-finally after configurated the file `sample.env`, renomate to `.env` only and execute bellow the scripts to run the app;

# install package for project
$ yarn install
```

## Routes for execution
```bash
# Default Route:
http://localhost:5000

 -User

#PUBLIC ROUTE

# Verb POST
api/v1/user/authenticate

# Body
{
	"email": "test@email.com",
	"password": "1234567"
}

# ----------------
# PRIVATE ROUTES NECESSARILY TOKEN JWT IN AUTHORIZATION HEADERS

# Verb POST
/api/v1/user/create

# Body
{
	"email": "teste1@email.com",
	"password": "1234567",
	"isAdmin": false
}

# Verb PATCH
/api/v1/user/change-password

# Body
{
	"password": "12345678"
}

# Verb GET
/api/v1/user/read

# Query Params ...
{
 	"page": 1,
 	"email": "test@email.com",
 	"limit": 10
}

# Verb DELETE
/api/v1/user/${id}

# ----------------

-Person

# ----------------
# PRIVATE ROUTES NECESSARILY TOKEN JWT IN AUTHORIZATION HEADERS

# Verb POST
/api/v1/person/create

# Body (Note: Gender have only types `M`/`F`)
{
	"name": "person1",
	"gender": "M",
	"birthday": "Thu Jun 03 2021 17:12:57 GMT-0300 ()"
}

# Verb PUT
/api/v1/person/update

# Body (Note: Gender have only types `M`/`F`)
{
	"name": "person1",
	"gender": "M",
	"birthday": "Thu Jun 03 2021 17:12:57 GMT-0300 ()"
}

# Verb GET
/api/v1/person/read

# Query Params ...
{
 	"page": 1,
 	"name": "test",
 	"limit": 10
}

# Verb GET
/api/v1/person/read-by-location

# Query Params Note(Please choice between property `city`/`state` or twice) ...
{
 	"page": 1,
 	"city": "test",
 	"state": "test",
 	"limit": 10
}

# ----------------

-Address

# ----------------
# PRIVATE ROUTES NECESSARILY TOKEN JWT IN AUTHORIZATION HEADERS

# Verb POST
/api/v1/address/create

# Body

{
	"address": "address one ...",
	"city": "city ...",
	"state": "state ...",
	"postalCode": "postalcode ...",
	"country": "country ..."
}

# Verb PUT
/api/v1/address/${id}/update

# Body

{
	"address": "address one ...",
	"city": "city ...",
	"state": "state ...",
	"postalCode": "postalcode ...",
	"country": "country ..."
}

# Verb GET
/api/v1/address/read

# Query Params
{
 	"page": 1,
 	"address": "test",
	"limit": 10
}

# Verb DELETE
/api/v1/address/${id}
# ----------------


```

## Running the app
```bash


# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
