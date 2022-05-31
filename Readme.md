PORTS

    GET

        /view-todos
        /edit-todo
        /update-status
        /signin

    POST 

        /signin
        /add-todos
        /update-todo

SCHEMA

    {
        username,
        email,
        profileImg,
        todo[
            {title,description,date,status},
            {title,description,date,status}
        ]
    }