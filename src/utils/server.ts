import express from "express";
import cors from "cors";
import appROutes from "../routes";
import homeRoute from "../routes/homeRoutes";
import docRouter from "../docs/swagger";
import session from "express-session";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: "eagles.team1",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
      },
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

app.use(cors());

app.use("/", homeRoute);
app.use("/api/v1", appROutes);
app.use("/docs", docRouter);

export default app;
