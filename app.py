from cs50 import SQL
from helpers import get_questions, login_required, create_questionbank
from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
import json

app = Flask(__name__)
questions = {}
tableName = ""

# Connect to database
db = SQL("sqlite:///my.db")


# --------------------------------------    SOURCE: CS50x 2021 pset9
# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
# -----------------------------------------   END OF SOURCE


# Home page
@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    global tableName
    if request.method == "POST":

        # Reset questionbank
        if request.form.get("reset"):
            if request.form.get("reset") == "default":
                create_questionbank(tableName)
            else:
                db.execute("DELETE FROM ? WHERE id > 2", tableName)
        
        else:
            fromJS = request.get_json()
            print(fromJS)
            action = fromJS['action']

            # Changing username
            if action == "newUsername":
                newUsername = fromJS['data']
                if newUsername == "":
                    return "noUser"
                elif " " in newUsername:
                    return "blank"
                elif len(db.execute("SELECT * FROM users WHERE username = ?;", newUsername)) == 0:
                    db.execute("UPDATE users SET username = ? WHERE id = ?;",
                            newUsername, session["user_id"])
                else:
                    return "existing"

            # Changing password
            elif action == "newPassword":
                newPassword = fromJS['data']
                db.execute("UPDATE users SET hash = ? WHERE id = ?;", generate_password_hash(
                    newPassword), session["user_id"])
                return "password changed!"

            elif action == "delete":
                toDel = list(map(int, fromJS['data'].split(",")))
                for qID in toDel:
                    db.execute("DELETE FROM ? WHERE id = ?", tableName, qID)

            elif action == "add":
                # Add question to database
                addQdict = json.loads(fromJS['data'])
                db.execute("INSERT INTO ? (id, question_type, question, answer, hint, a, b, c, d) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", tableName,
                           addQdict['id'], addQdict['question_type'], addQdict['question'], addQdict['answer'], addQdict['hint'], addQdict['a'], addQdict['b'], addQdict['c'], addQdict['d'])

            elif action == "edit":
                editQdict = json.loads(fromJS['data'])
                db.execute("""UPDATE ? 
                    SET question = ?,
                    answer = ?,
                    hint = ?,
                    a = ?,
                    b = ?,
                    c = ?,
                    d = ?
                    WHERE id = ?""", tableName, editQdict['question'], editQdict['answer'], editQdict['hint'], editQdict['a'], editQdict['b'], editQdict['c'], editQdict['d'], editQdict['id'])

            return "updated"

        return redirect("/")

    else:
        # Have pages satisfy default/last saved theme and hint modes
        curTheme = db.execute(
            "SELECT answer FROM ? WHERE question = 'theme';", tableName)[0]["answer"]
        curHint = db.execute(
            "SELECT answer FROM ? WHERE question = 'hint-mode';", tableName)[0]["answer"]
        allQuestions = db.execute(
            "SELECT * FROM ? WHERE id > 2 ORDER BY id DESC;", tableName)
        userName = db.execute(
            "SELECT username FROM users WHERE id = ?", int(tableName[13:]))[0]["username"]

        return render_template("index.html", theme=curTheme, hintMode=curHint, allQuestions=allQuestions, userName=userName)

# 5 questions quiz page


@app.route("/quiz", methods=["GET"])
@login_required
def quiz():
    global questions, tableName
    # Remove "answer" from the dictionary passed into quiz page
    id_nums = db.execute("SELECT id FROM ? WHERE id > 2", tableName)
    id_nums = [row['id'] for row in id_nums]
    questions = get_questions(tableName, id_nums)
    new_dict = {k: {kk: questions[k][kk] for kk in questions[k].keys(
    ) - {'answer'}} for k in questions.keys()}

    return render_template("quiz.html", questions=new_dict)

# Results page


@app.route("/results", methods=["GET", "POST"])
@login_required
def results():
    if request.method == "GET":
        return redirect("/")
    else:
        # Store user answers to questions
        formResults = []

        # Store question #s that used hints
        hintsUsed = []

        # Loop through each quiz question from submitted form
        for i in range(1, 6):
            name_of_val = "answer" + str(i)
            name_of_hint = "hint" + str(i)
            formResults.append(request.form.get(name_of_val))
            # Check if hint was used
            if request.form.get(name_of_hint) == "TRUE":
                hintsUsed.append(i)

        return render_template("results.html", formResults=formResults, hintsUsed=hintsUsed, questions=questions)


@app.route("/login", methods=["GET", "POST"])
def login():
    global tableName

    # Forget any user_id
    session.clear()

    if request.method == "POST":
        fromJS = request.get_json()
        userName = fromJS['userName']
        passWord = fromJS['passWord']

        rows = db.execute("SELECT * FROM users WHERE username = ?",
                        userName)

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], passWord):
            return "DNE"

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]
        tableName = "question_bank" + str(session["user_id"])

        # Redirect logged in user to index.html
        return "yes"

    else:
        return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        fromJS = request.get_json()
        action = fromJS['action']

        if action == "username":

            newUsername = fromJS['data'].strip()

            if newUsername.isspace() or newUsername == "":
                return "blank"

            rows = db.execute("SELECT * FROM users WHERE username = ?",
                            newUsername)

            print(len(rows))

            # Check if username is already taken
            if len(rows) != 0:
                return "existing"
            else:
                return "ok username!"

        # Add new user to database
        passWord = fromJS['passWord']
        pwConfirmation = fromJS['confirmationPW']

        if passWord == "":
            return "noPassword"
        elif pwConfirmation == "":
            return "noConfirmation"
        elif passWord.isspace() or pwConfirmation.isspace() or " " in passWord:
            return "blank"
        elif passWord != pwConfirmation:
            return "differentPw"

        db.execute("INSERT INTO users (username, hash) VALUES (?, ?);",
                            fromJS['userName'], generate_password_hash(fromJS['passWord'], method='pbkdf2:sha256', salt_length=8))

        id_num = db.execute("SELECT id FROM users where username = ?",
                            fromJS['userName'])[0]["id"]
        table_name = "question_bank" + str(id_num)
        create_questionbank(table_name)

        return "signed up!"

    else:
        return render_template("signup.html")


@app.route("/logout", methods=["POST"])
def logout():
    global tableName

    # Update saved theme and modes for next use
    values = request.form.get("submit")
    curTheme, curHint = values.split()

    db.execute("UPDATE ? SET answer = ? WHERE question = 'theme'",
               tableName, curTheme)
    db.execute("UPDATE ? SET answer = ? WHERE question = 'hint-mode'",
               tableName, curHint)

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=80)
