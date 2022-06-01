PORTS

    GET

        /  { home page }
        /view-todos { Dashboard }
        /update-sts/:status/:date {Mark todo as favoratie and Completed and Deleted }
        /view-todo/:status {sort by favorite and completed and deleted}
        /edit-todo

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