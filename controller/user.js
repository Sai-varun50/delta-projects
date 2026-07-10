const user = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;

        // console.log(req.body);

        const newUser = new user({ username, email });

        const registeredUser = await user.register(newUser, password);

        // console.log("Registered:", registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                // console.log(err);
                return next(err);
            }

            // console.log("Login successful");

            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        // console.log(e);   // <-- IMPORTANT
        req.flash("error", e.message);
        res.redirect("/users/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirecturl || "/listings");
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
};