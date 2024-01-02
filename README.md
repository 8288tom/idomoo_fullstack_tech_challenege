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

In order to use in Prod you'll need to configure nginx or other deployment method to serve the application.

The task is as follows:

Use the technology stack of your choice for the frontend part, node.js for the backend.
Use stackblitz , codesandbox or any similar service for deployment and working solution demonstration.
Create a fullstack web application that generates a video according to the data that the

end user enters in a form, including uploading image. The video should be played on an Idomoo 2.0 player embedded into a landing page.
Use Idomoo Generate API v3 that consists of two main APIs:

1. Metadata API: allowing to enquire about scenes, storyboards, accounts. 2. Generate API: allowing to generate a video by using either a pre-made
   storyboard or by editing scenes together on-the-fly. Example can be found at:
   https://pv.idomoo.com/index.php#/api/15289/Travel%20 proposal%20 demo%20G2
   Steps
2. As each video contains data drives elements first retrieve the needed elements by using storyboard metadata API.
   Use this to get a list of all the parameters in this storyboard. GET /storyboards/{storyboradId}
   Note that elements can be text or images
3. Build the form accordingly
4. Check if the video is ready using the check status URL, as described
5. Display the video using Idomo’s player 2.0 Documentation can be found here
   For sample design reference please see this link on zeplin: https://zpl.io/bLn3GDG.

Security credentials for API usage are provided with the task and are reducted from this README.
