# How to Use Project 

  1. Clone the repository to your local machine And Should be nodeJs Installed In Your Local Machine.
  2. Navigate to the project directory in your terminal  
  3. Create a .env file in the root directory of the project, and add the following environment  variables:
        `PORT=3000`
        `JWT_SECRET=your_jwt_secret_key`
        `MONGO_URL=your_mongodb_url`
        `SMTP_HOST`
        `SMTP_PORT`
        `SECURE_SMTP`
        `SMTP_USER_EMAIL`
        `SMTP_USER_PASSWORD`
        `SMTP_FROM_EMAIL`
   Replace your_jwt_secret_key and MONGO_URL with your own secret key that will be used to sign and verify JWT tokens.
  4. Run the command `npm install` to install all dependencies required for the project.
  5. Run the command `npm start` to start the server.

  6. You can now use a tool like _Postman_ to test the API endpoints. 
  
  <br>
  
# API ENDPOINT

* Overall Methods And HTTP Requests

> For Auth And Moods APIs
------------------------------------------------------------------------------------------------
| Endpoint                   | HTTP   | Description                                             |
|----------------------------|--------|---------------------------------------------------------|
| /api/v1/auth/register      | POST   | Register a new user with email and password and name    |
| /api/v1/auth/login         | POST   | Authenticate a user and return JWT token                |
| /api/v1/create-mood        | POST   | Create a new mood for authenticated user                |
| /api/v1/all-moods          | GET    | Get all moods for authenticated user                    |
| /api/v1/delete-mood/:id    | DELETE | Delete a mood with the specified ID for a user          |
-------------------------------------------------------------------------------------------------


# Authentication Routes

- Register

  * URL:            `http://localhost:5000/api/v1/auth/register`,
  * Method:         `POST`
  * Request Body: 


-------------------------------------------------------------------------------------------------
   PARAMETER |   TYPE   |  REQUIRED |                            DESCRIPTION                    |
-------------------------------------------------------------------------------------------------
   email     | String   |  yes      |             User Email                                    |

   name      | String   |  yes      |             User Name                                     |
   
   password  | String   |  yes      |             User Password                                 |
-------------------------------------------------------------------------------------------------


  * Response Body (Success(200 OK)):


-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |

-------------------------------------------------------------------------------------------------
   token     |      String        |                 Token_this_is                               |

   message   |      String        |         Succesfull Register , this is your token            |
-------------------------------------------------------------------------------------------------


  * Response Body (Error):

-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |

-------------------------------------------------------------------------------------------------

   error     |      String        |    Error Message describing Why The Request Failed          |
-------------------------------------------------------------------------------------------------
 
 <br>

- Login 
  
   * URL:        `http://localhost:5000/api/v1/auth/login`,
   * Method:      ``POST`
   * Request Body: 



-------------------------------------------------------------------------------------------------
   PARAMETER |   TYPE   |  REQUIRED |                            DESCRIPTION                    |

-------------------------------------------------------------------------------------------------

   email     | String   |  yes      |             User Email                                    |

   name      | String   |  yes      |             User Name                                     |

   password  | String   |  yes      |             User Password                                 |
-------------------------------------------------------------------------------------------------

  * Response Body (Success(200 OK)):


-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |

-------------------------------------------------------------------------------------------------
   token     |      String        |                 Token_this_is                               |

   message   |      String        |         Succesfull Login , this is your token               |
-------------------------------------------------------------------------------------------------


  * Response Body (Error):

-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |

-------------------------------------------------------------------------------------------------

   error     |      String        |    Error Message describing Why The Request Failed          |
-------------------------------------------------------------------------------------------------
 
 <br>


## MOOD ROUTES

- Create a New Mood
  
   * URL:     `http://localhost:5000/api/v1/create-mood`,
   * Method:   `POST`
   * Request Headers: 


-------------------------------------------------------------------------------------------------
   PARAMETER    | TYPE   | REQUIRED |           DESCRIPTION                                     | 

-------------------------------------------------------------------------------------------------

  Authorization | String |   yes    |    JWT_TOKEN Obtained From authentication                 |
-------------------------------------------------------------------------------------------------

  * Request Body:


-------------------------------------------------------------------------------------------------
   PARAMETER |   TYPE   |  REQUIRED |                            DESCRIPTION                    |
-------------------------------------------------------------------------------------------------

   Note      | String   |  No       |            Mood's Note or any Note                        |

   Date      | Date     |  yes      |            Date Of Creating Mood                          |

   Mood      | String   |  yes      |            Mood Type (example = 'Happy','Sad')            |
-------------------------------------------------------------------------------------------------

  * Response Body (Success(200 OK)):


-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |
-------------------------------------------------------------------------------------------------

   Mood      |     Object         |                New Created Mood                             |

   message   |      String        |          Mood Succesfull Created                            |
-------------------------------------------------------------------------------------------------


  * Response Body (Error):

-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |
-------------------------------------------------------------------------------------------------

   error     |      String        |    Error Message describing Why The Request Failed          |
-------------------------------------------------------------------------------------------------
 
 <br>


- Get All Moods
  
   * URL:     `http://localhost:5000/api/v1/all-moods`,
   * Method:   `POST`
   * Request Headers: 



-------------------------------------------------------------------------------------------------
   PARAMETER    | TYPE   | REQUIRED |           DESCRIPTION                                     |                  
-------------------------------------------------------------------------------------------------

  Authorization | String |   yes    |    JWT_TOKEN Obtained From authentication                 |
-------------------------------------------------------------------------------------------------



  * Response Body (Success(200 OK)):


-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |
-------------------------------------------------------------------------------------------------

   Moods     |     Object[]       |          Array of All user's Mood                           |

   message   |      String        |         All Moods Succesfull Fetched                        |
-------------------------------------------------------------------------------------------------


  * Response Body (Error):

-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |
-------------------------------------------------------------------------------------------------

   error     |      String        |    Error Message describing Why The Request Failed          |
-------------------------------------------------------------------------------------------------
 
 <br>



- Delete A Mood
  
   * URL:     `http://localhost:5000/api/v1/delete-mood/:id`,
   * Method:   `POST`
   * Request Headers: 



-------------------------------------------------------------------------------------------------
   PARAMETER    | TYPE   | REQUIRED |           DESCRIPTION                                     |                  
-------------------------------------------------------------------------------------------------

  Authorization | String |   yes    |    JWT_TOKEN Obtained From authentication                 |
-------------------------------------------------------------------------------------------------



  * Response Body (Success(200 OK)):


-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |
-------------------------------------------------------------------------------------------------

   message   |      String        |         Mood Deleted Successfully                           |
-------------------------------------------------------------------------------------------------


  * Response Body (Error):

-------------------------------------------------------------------------------------------------
   PARAMETER |        TYPE        |                  DESCRIPTION                                |
-------------------------------------------------------------------------------------------------

   error     |      String        |    Error Message describing Why The Request Failed          |
-------------------------------------------------------------------------------------------------
 
 <br>


