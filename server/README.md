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

Response:

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

#### Add a schedule (for a week)

`POST /manager/addschedule`

Request with:

	 startTime: timestamp of week start date
	 assignments: json array of assignments (see reponse)


In case of an error:

    {
        "response": "FAIL"
    }

Response:

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
	        "schedules" : [
	        	{
	        		"startTime" : 34934234,
	        		"assignments" : [
						{
							'users' : ['list', 'of', 'unique_codes'],
							'day' : 0,
							'start-minute' : 15,
							'end-minute' : 15
						}
	        		]
	        	}
	        ]
	        "created_at": "2014-04-11T23:41:34.575Z"
	    }
	}

#### Get my assignments (only schedule records with myself included)

`GET /user/getmyschedule`

Request with:

	 Nothing needed

In case of an error:

    {
        "response": "FAIL"
    }

Response:

	{
	    "response": "OK",
	    "schedules": [
	    		{
	        		"startTime" : 34934234,
	        		"assignments" : [
						{
							'users' : ['list', 'of', 'unique_codes'],
							'day' : 0,
							'start-minute' : 15,
							'end-minute' : 15
						}
	        		]
	        	}
	        ]
	    "myUser": {
	        "_id": "53487e5f343685a71ca1d12e",
	        "name": "testing",
	        "email": "test@test.com"
	    }
	}


{"employees":[
    {
        "name": "Aaron",
        "schedule": {"schedule":[
            {
            "date": "4/12/2014",
            "shifts":[
                {
                    "startTime": 0,
                    "endTime": 120
                },
                {
                    "startTime": 600,
                    "endTime": 660
                }
            ],
            "notes": null
            },
            {
            "date": "4/14/2014",
            "shifts":[
                {
                    "startTime": 328,
                    "endTime": 984
                }
            ],
            "notes": null
    ]};
]};





#### Get all assignments / schedules

`GET /user/getallschedules`

Request with:

	 Nothing needed

In case of an error:

    {
        "response": "FAIL"
    }

Response:

	{
	    "response": "OK",
	    "schedules": [
	    		{
	        		"startTime" : 34934234,
	        		"assignments" : [
						{
							'users' : ['list', 'of', 'unique_codes'],
							'day' : 0,
							'start-minute' : 15,
							'end-minute' : 15
						}
	        		]
	        	}
	        ]
	    "myUser": {
	        "_id": "53487e5f343685a71ca1d12e",
	        "name": "testing",
	        "email": "test@test.com"
	    }
	}

#### Get swap requests

`GET /user/getswaps`

Request with:

	 Nothing needed

In case of an error:

    {
        "response": "FAIL"
    }

Response:

	{
	    "response": "OK",
	    "swaps": [
	    		{
	        		"assignmentFrom" : {
							'users' : ['list', 'of', 'unique_codes'],
							'day' : 0,
							'start-minute' : 15,
							'end-minute' : 15
						},
					"from" : "53487e5f343685a71ca1d12e",
	        		"assignmentTo" : {
							'users' : ['list', 'of', 'unique_codes'],
							'day' : 0,
							'start-minute' : 15,
							'end-minute' : 15
						},
					"to" : "53487e5f343685a71ca1d12e"
	        	}
	        ]
	    "myUser": {
	        "_id": "53487e5f343685a71ca1d12e",
	        "name": "testing",
	        "email": "test@test.com"
	    }
	}

#### Add swap request

`POST /user/addswap`

Request with:

    toId: the id of the user that you want to swap with
    assignmentFrom: the assignment record you wish to swap out of
    assignmentTo: the assignment record you wish to swap to

In case of an error:

    {
        "response": "FAIL"
    }

Response:

	{
	    "response": "OK",
	    "swaps": [
	    		{
	        		"assignmentFrom" : {
							'users' : ['list', 'of', 'unique_codes'],
							'day' : 0,
							'start-minute' : 15,
							'end-minute' : 15
						},
					"from" : "53487e5f343685a71ca1d12e",
	        		"assignmentTo" : {
							'users' : ['list', 'of', 'unique_codes'],
							'day' : 0,
							'start-minute' : 15,
							'end-minute' : 15
						},
					"to" : "53487e5f343685a71ca1d12e"
	        	}
	        ]
	    "myUser": {
	        "_id": "53487e5f343685a71ca1d12e",
	        "name": "testing",
	        "email": "test@test.com"
	    }
	}