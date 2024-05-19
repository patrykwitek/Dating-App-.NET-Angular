# Dating Application 💕
> ASP.NET & Angular Dating Application

<a name="top"></a>
## Table of Contents 📖
1. [Preview](#preview)
2. [Installation](#installation)
3. [Used Technologies](#technologies)
4. [Security](#security)
5. [Branches](#branches)
6. [Register & Login](#register)
7. [User Profile](#profile)
8. [Errors handling](#errors)
9. [Seeding data](#seed)
10. [User photos](#photos)
11. [Profile Edit](#edit)
12. [Pagination](#pagination)
13. [Sorting & Filtering Users](#sort)
14. [Likes Feature](#likes)
15. [Realtime messaging](#messages)
16. [Admin Role](#admin)
17. [Translations](#translations)
18. [Light & Dark Mode](#lightdarkmode)
19. [Responsiveness](#responsiveness)

<a name="preview"></a>
## 1. Preview 👀

This is dating application, inspired by other applications, such as Tinder. The idea behind the app is to help users search for their partner. Users can send each other likes and then communicate with each other.
The application was inspired by <a href="https://www.udemy.com/course/build-an-app-with-aspnet-core-and-angular-from-scratch/" target="_blank">Neil Cummings' Udemy course</a>, but I created my own styles here (styles were designed by me in scss, I did not use bootstrap) and added many elements from myself.

![zdj1](https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/de94fe99-98ac-4d59-bed9-672f32e6fba8)

<a name="installation"></a>
## 2. Installation 🛒

First of all, clone the repository. You can do it using this URL:

`https://github.com/patrykwitek/Dating-App-.NET-Angular.git`

You should have Angular installed

`npm install -g @angular/cli`

also install ASP.NET, I used version 6 and .NET SDK

After cloning the repository, you can launch the application with commands

-on the frontend:
`ng serve`

- on the backend:
`dotnet watch`

<a name="technologies"></a>
## 3. Used Technologies 💻

Frontend – Angular
Backend – ASP.NET

<a name="security"></a>
## 4. Security 🛡️

The application uses a generated certificate to use HTTPS.

To secure user passwords in the database the application used password hash and salt, but in later branches I switched to ASP.NET Identity, which automatically includes password encryption.

<a name="branches"></a>
## 5. Branches 🪢

**DA-001**: add angular to project & add CORS
**DA-002**: add register & login functionality on backend
**DA-003**: login & register functionality
**DA-004**: add main routes to application
**DA-005**: error handling
**DA-006**: seeding users data
**DA-007**: user's page
**DA-008**: edit user page
**DA-009**: uploading user's photos functionality
**DA-010**: register form
**DA-011**: users pagination
**DA-012**: likes feature
**DA-013**: messages feature
**DA-014**: user roles & admin panel
**DA-015**: realtime messages & online status
**DA-016**: fix bugs & cosmetic changes

<a name="register"></a>
## 6. Register & Login 🙋‍♂️

A non-logged-in user, upon entering the application, will see a button to register and a login form at the top right of the screen.
After clicking on the registration button, a reactive form opens, where the user fills in basic information about himself. Validation has been applied with appropriate messages under the fields. Once the registration is done, the user is automatically logged in.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/71c0811a-a0d7-407b-bf54-c19a17f0b52d

Once a user has an account, he or she can log in with the form in the application header. The login uses the JWT Token, which is generated on the backend side and saved in local storage.

<a name="profile"></a>
## 7. User Profile 🗃️

The user page contains all the information about the user, his age, interests, photos and messenger.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/e84bfdfd-834b-4c75-b384-c699338495d5

<a name="errors"></a>
## 8. Errors Handling 🚑

The application handles the errors that could potentially occur, both on the backend side and on the frontend side. There is a hidden page to test them at the link https://localhost:4200/errors-testing.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/cdb88d21-08d4-45d3-b7c0-a1fdc65e3a38

One potential error is a 404, which indicates that the page in question is missing.

![zdj5](https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/dddade30-0995-48a6-b80b-47c654b1ac1b)

<a name="seed"></a>
## 9. Seeding Data ✍️

The first time the backend server is started from the newly cloned repository, the database will be seeded with new sample users. The password for all automatically generated accounts is $tr0ngPas$w0Rd.

<a name="edit"></a>
## 10. Profile Edit 🖊️

Users can edit their profile by hitting the button in the dropdown menu at the top right of the screen. It is also a place where users can upload photos.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/8992885e-effc-4540-99e9-66123bd1b0b1

If the user tries to switch to another tab with unsaved changes, a pop-up window will appear confirming whether the user really wants to discard the changes.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/84ad04b3-c4b6-434c-9797-33f013b6c716

<a name="photos"></a>
## 11. User photos 📷

Users can upload photos to their profile, delete them and choose which photo they want to be their profile photo. Other users can view them. There is a link to the photo in the database, which is stored on the Cloudinary site.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/1b48b6e1-fc3a-4ed0-ad98-f29a4e793e53

<a name="pagination"></a>
## 12. Pagination 📃

When there are a large number of users, pagination has been implemented to avoid loading a large number of data at once.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/608a804a-2704-480a-be04-f313a2a669f6

<a name="sort"></a>
## 13. Sorting & Filtering Users 🔃

Users can filter other users according to their preferences, such as age and gender, and can sort them by most recently active, or newest users.

![zdj10](https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/e0159085-a4d7-449f-9322-40b23376756a)

Chaching data was used in the application, so if the user changes the tab and then returns to the previous tab, the data will be displayed in the state he left it and application remembers filters.

<a name="likes"></a>
## 14. Likes Feature 👍

Users can send likes to each other and then check to whom they sent likes and from whom they received them in the Sent likes tab.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/95192d51-d318-4bf5-9b3d-c693b15664d1

<a name="messages"></a>
## 15. Realtime messaging ✉️

Users can send messages to each other in real time. This is implemented using the SignalR library.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/e83027d8-dad1-4f71-af03-935de39acd6a

In addition, users can see who is currently active and who is not.

<img src="https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/a427204e-93a1-4d87-be31-df26cef70a7c" alt="active" style="width:300px;"/>

When a user gets a new message, he also gets a notification informing him that he has received a new message.

<a name="admin"></a>
## 16. Admin Role 👑

There is a secret admin account in the application with the login admin and password $tr0ngPas$w0Rd. After logging into this account in the header of the page, we have access to the admin page. There you can manage the roles of all users. These roles are admin, moderator and member. The moderator also has access to the photo management tab in the application, and every other user is a member.

https://github.com/patrykwitek/Dating-App-.NET-Angular/assets/117681023/3e947bd8-23bc-4908-9002-7b400276f5ec

<a name="translations"></a>
## 17. Translations 💁

*This functionality will come in the near future*

<a name="lightdarkmode"></a>
## 18. Light & Dark Mode 🌙

*This functionality will come in the near future*

<a name="responsiveness"></a>
## 19. Responsiveness 📱

*This functionality will come in the near future*

[🔼 Back to top](#top)

