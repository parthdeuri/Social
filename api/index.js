const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const convRoute = require("./routes/conversations");
const msgRoute = require("./routes/messages");

// const { socketConnect } = require("./socket/socket");

dotenv.config();
const PORT = process.env.PORT || 5000;

// app.use(express.json()); 
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan('common'));


// routes  
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conv", convRoute);
app.use("/api/msg", msgRoute);

const startApp = async () => {
    try {
        mongoose
            .connect(process.env.MONGODB_URL)
            .then(() => console.log("connected to database"))
            .catch(e => console.log(e));

        app.listen(PORT, () => {
            console.log(`server connected at Port: ${PORT} `);
        });
    }
    catch (err) {
        console.log(err);
    }
}

startApp();

app.get('/api', (req, res) => {
    res.status(200).json("i am alive");
})

const { sendTestMail } = require('./mailer/mailer');
app.post('/api/mail-test', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: "Email is required in the request body" });
        }
        const result = await sendTestMail({ userEmail: email });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});
