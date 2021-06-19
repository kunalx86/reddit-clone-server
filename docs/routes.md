# This documents the various routes of the API


## Miscellaneous
- `/api/->GET`: Returns message about this app
- `/api/whoami->GET`: Gets the information about currently logged in user


## Authentication
- `/api/auth/register->POST`: For registration of user
- `/api/auth/login->POST`: For logging in user
- `/api/auth/logout->POST`: For logging user out


## Users
- `/api/u/:username->GET`: Gets the user with matching passed username
- `/api/u/:username/posts->GET`: Gets the posts of the user with matching passed username
- `/api/u/:username/comments->GET`: Gets the comments of the user with matching passed username
- `/api/u/follow/:userId->POST`: Logged in User follows/unfollows the user with matching passed userId
- `/api/u/followers->GET`: Gets the information of users the current user is being followed by
- `/api/u/following->GET`: Gets the information of users the current user is following
- `/api/u/profile->GET`: Used to upload profile and/or background picture(s) for logged in user


## Groups
- `/api/g/create->POST`: Used to create a new group
- `/api/g/:groupId/profile->POST`: Used to upload profile and/or background picture(s) for group matching with passed groupId
- `/api/g/:groupId/rules->POST`: Used to post list of rules for group matching with passed groupId
- `/api/g/:groupId/:ruleId->DELETE`: Used to delete specified rule matched by ruleId of the group matching with passed groupId
- `/api/g/follow/:groupId->POST`: Used to follow the specified group matched by groupId for logged in user


## Posts
- `/api/posts->POST`: Used to create a new Post
- `/api/posts/:postId/image->POST`: Used to upload image for the specified post by postId
- `/api/posts/:postId/vote->POST`: Used for the current logged in user to vote the specified post by postId
- `/api/posts/:postId->GET`: Gets the specified post by postId


## Comments
- `/api/comments/:postId->POST`: Used to create a new comment for the post specified by postId
- `/api/comments/:postId->GET`: Gets the comments for the post specified by postId
- `/api/comments/:commentId/vote->POST`: Used to vote the comment specified by commentId