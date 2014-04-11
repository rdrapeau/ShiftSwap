ShiftSwap API
===

Access at
----

Running locally
====

1. `cd api`

2. Install node.js dependencies

        npm install

3. Start mongo

        mongod --dbpath data/

4. Start the app

        node app.js

==================

## API End Points

#### Sign up a Manager

`POST /manager/signup`

Request with:

    email: login email
    password: login password

In case of an error:

    {
        "response": "FAIL"
    }

Response:

	{
	    "response": "OK",
	    "manager": {
	        "__v": 0,
	        "email": "test@test.com",
	        "_id": "53487dae343685a71ca1d12d",
	        "users": [],
	        "created_at": "2014-04-11T23:41:34.575Z"
	    }
	}


#### Log in a Manager

`POST /manager/signin`

Request with:

    email: login email
    password: login password

In case of an error:

    {
        "response": "FAIL"
    }

Response:

	{
	    "response": "OK",
	    "manager": {
	        "__v": 0,
	        "email": "test@test.com",
	        "_id": "53487dae343685a71ca1d12d",
	        "users": [],
	        "created_at": "2014-04-11T23:41:34.575Z"
	    }
	}


#### Add a Employee (User)

`POST /user/signup`

Request with:

	managerId: Manager unique id
    name: employee name
    email: employee email

In case of an error:

    {
        "response": "FAIL"
    }

Response (sends email to email provided with user _id):

	{
	    "response": "OK",
	    "manager": {
	        "__v": 0,
	        "_id": "53487dae343685a71ca1d12d",
	        "email": "test@test.com",
	        "users": [
	            {
	                "email": "test@test.com",
	                "name": "testing",
	                "_id": "53487e5f343685a71ca1d12e"
	            }
	        ],
	        "created_at": "2014-04-11T23:41:34.575Z"
	    }
	}

#### Login a Employee (User login with app)

`POST /user/signin`

Request with:

	userId: User unique id

In case of an error:

    {
        "response": "FAIL"
    }

Response (sends email to email provided with user _id):

	{
	    "response": "OK",
	    "manager": {
	        "__v": 0,
	        "_id": "53487dae343685a71ca1d12d",
	        "email": "test@test.com",
	        "users": [
	            {
	                "email": "test@test.com",
	                "name": "testing",
	                "_id": "53487e5f343685a71ca1d12e"
	            }
	        ],
	        "created_at": "2014-04-11T23:41:34.575Z"
	    },
	    "myUser": {
	        "_id": "53487e5f343685a71ca1d12e",
	        "name": "testing",
	        "email": "test@test.com"
	    }
	}