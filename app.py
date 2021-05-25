from cs50 import SQL
from helpers import get_questions, login_required, create_questionbank
from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash


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
        if request.form.get("new-username"):
            if len(db.execute("SELECT * FROM users WHERE username = ?;", request.form.get("new-username"))) == 0:
                db.execute("UPDATE users SET username = ? WHERE id = ?;", request.form.get("new-username"), session["user_id"])
            else: 
                return("TAKEN !!!")
        elif request.form.get("password"):
            db.execute("UPDATE users SET hash = ? WHERE id = ?;", generate_password_hash(request.form.get("password")), session["user_id"])
        return redirect("/")
    else:    
        # Have pages satisfy default/last saved theme and hint modes
        curTheme = db.execute("SELECT answer FROM ? WHERE question = 'theme'", tableName)[0]["answer"]
        curHint = db.execute("SELECT answer FROM ? WHERE question = 'hint-mode'", tableName)[0]["answer"]
        questions = db.execute("SELECT * FROM ? WHERE id > 2", tableName)
        print(questions)

        return render_template("index.html", theme=curTheme, hintMode=curHint, questions=questions)

# 5 questions quiz page
@app.route("/quiz", methods=["GET"])
@login_required
def quiz():
    global questions, tableName

    # Remove "answer" from the dictionary passed into quiz page
    questions = get_questions(tableName)
    new_dict = {k: {kk: questions[k][kk] for kk in questions[k].keys() - {'answer'}} for k in questions.keys()}

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
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return "invalid username and/or password"

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]
        tableName = "question_bank" + str(session["user_id"])

        # Redirect logged in user to index.html
        return redirect("/")

    else:
        return render_template("login.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username does not exist
        if len(rows) != 0:
            return "this username has already been taken"

        # Ensure passwords are the same
        elif (request.form.get("password") != request.form.get("confirmation")):
            return "passwords do not match"

        # Add new user to database
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?);", request.form.get("username"), generate_password_hash(request.form.get("password"), method='pbkdf2:sha256', salt_length=8))

        id_num = db.execute("SELECT id FROM users where username = ?", request.form.get("username"))[0]["id"]
        table_name = "question_bank" + str(id_num)
        create_questionbank(table_name)

        return render_template("login.html")

    else:
        return render_template("signup.html")

@app.route("/logout", methods=["POST"])
def logout():
    global tableName

    # Update saved theme and modes for next use
    values = request.form.get("submit")
    curTheme, curHint = values.split()

    db.execute("UPDATE ? SET answer = ? WHERE question = 'theme'", tableName, curTheme)
    db.execute("UPDATE ? SET answer = ? WHERE question = 'hint-mode'", tableName, curHint)

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=80)