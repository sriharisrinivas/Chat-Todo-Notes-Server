
# Chat Application 
[Chat Application Live Link](https://srihari-chat-mern.vercel.app/)

Source Code
[Frontend Git Link](https://gitlab.com/Sriharisrinivas/todo-frontend/-/tree/chat-app)
[Backend Git Link](https://gitlab.com/Sriharisrinivas/todo/-/tree/srihari_v2)

# Highlights of this App

 1. Users can login or register with their Gmail account.
 2. Users can securely reset their password by verifying a one-time password (OTP) sent to their registered Gmail account.
 3. User passwords are securely encrypted using **bcrypt** to ensure data protection and privacy.
 4. Once logged in, users can seamlessly begin chatting with others, with real-time updates such as online status.
 5. Additionally users can also update their profile details.

# Mongo DB Schema
![enter image description here](https://res.cloudinary.com/sriharisrinivas/image/upload/v1727979606/IMG_20241003_234617_jwfuxd.jpg)

# My approach
I would like to highlight a few key points, specifically regarding how I facilitated communication between the server and client, focusing on data exchange and synchronization.

1. Users can log in or sign up using their credentials. Both registration and sign-in functionalities are implemented through REST APIs, with authentication managed via JWT tokens and encrypted passwords for enhanced security. After a successful login, the client triggers a socket connection to add the user's details to the 'online users' list, enabling real-time updates of online user statuses.											

2. Once the user is added to the 'online users' list, the server triggers another socket event to fetch the user's previous conversations (including messages), which are then rendered in the UI in real-time.											

3. Newly created users don’t have any existing conversations, so to initiate a new one, the client selects a user from the 'add new users' list and sends a message. This triggers a socket event with the relevant details, creating a new conversation. The server then triggers another socket event to send the updated conversations list, which is finally rendered in the UI.	

4. Users with existing conversations can select any conversation to send a message. This action triggers a socket event with the relevant details, creating a new message and adding it to the current conversation. The server then emits another socket event to update the conversations list, which is subsequently rendered in the UI for real-time visibility.											

5. When logging out or closing the application, a socket event is triggered to remove the current user from the 'online users' list, ensuring real-time updates of the online status.											

Other features, such as changing the password, updating the profile, sending OTPs, and verifying OTPs for password reset, have been implemented using REST APIs. Since these features don't require bi-directional communication, REST APIs provide a straightforward solution for handling them efficiently.



DM for any clarifications in developing this project. Happy Coding.
sriharisrinivas995@gmail.com