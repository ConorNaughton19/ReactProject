import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyAD1BbG_x1oR8LzhjcZioLaiEn4ULLpGc4",
  authDomain: "final-year-project-datab-3d5d4.firebaseapp.com",
  projectId: "final-year-project-datab-3d5d4",
  storageBucket: "final-year-project-datab-3d5d4.appspot.com",
  messagingSenderId: "1068142968031",
  appId: "1:1068142968031:web:d5653d95bf007c5b1b3d6a",
  measurementId: "G-FRQ87R3MY2",
};

describe("Firebase config", () => {
  test("initializes the Firebase app", () => {
    const app = firebase.initializeApp(firebaseConfig);
    expect(app).toBeDefined();
  });

  test("has a working Firebase database object", async () => {
    const app = firebase.initializeApp(firebaseConfig);
    const db = app.database();
    expect(db).toBeDefined();
  });
});
