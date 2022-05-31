function LoginSignup() {
    const handleGoogle = () => {

        signInWithPopup(auth, provider).then(async (result) => {
            console.log(result.user.providerData[0].email);

            let obj = {
                displayName: result.user.providerData[0].displayName,
                email: result.user.providerData[0].email,
                photoURL: result.user.providerData[0].photoURL
            }

             

            try {
                var {
                    data
                } = await axios.post(POST_URL, obj);
                navigate("/todo", {replace: true});
                if (!data) {
                    throw new Error("COuldnt sign in");
                    // notifyMessage("couldnt sign in");
                }
                // let dart=data.data
                // name=dart.displayName
                // email=dart.email
                // photo=dart.photoURL
                // console.log(dart);
            } catch (e) {
                console.log(e);
            }

            // ...
        }).catch((error) => {
            console.log(error.message);

        });
    }
}
