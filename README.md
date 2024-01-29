# idomoo_fullstack_tech_challenege

This repository is my challenge solution for the Full stack developer task by Idomoo.

How to run on your machine in Dev:

1. Git clone
2. Inside backend/ create a .env file with the following keys:
   -API_KEY

   -API_ACCOUNT

   -AWS_ACCESS_KEY

   -AWS_SECRET

   -AWS_REGION

   -API_SECRET_HEADER (optional - remove from headers if not used)

3. Ensure your S3 bucket is publicly available when files are uploaded.
4. run docker-compose

In order to use in Prod you'll need to configure nginx as reverse proxy or other deployment method to serve the application.

To run the application locally I recommend using docker and docker-copmpose.
clone the repo, make sure docker is running and run ./dev.sh

This app will work with any Idomoo account ( & api key) the only limitations are that the parameters must have a description of "text" or "media" (not case sensitive) to distinguish between placeholders.
Support for audio parameters is not available (as it's not part of the task).
