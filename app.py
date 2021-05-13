from helpers import get_questions
from flask import Flask, render_template, request, redirect
# from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
questions = {}

# Home page
@app.route("/")
def index():
    return render_template("index.html")

# 5 Questions quiz page
@app.route("/quiz", methods=["GET"])
def quiz():
    global questions
    questions = get_questions()
    return render_template("quiz.html", questions=questions)

# Results page  
@app.route("/results", methods=["GET", "POST"])
def results():
    if request.method == "GET":
        return redirect("/")
    else:
        formResults = []
        hintsUsed = []
        for i in range(1, 6):
            name_of_val = "answer" + str(i)
            name_of_hint = "hint" + str(i)
            formResults.append(request.form.get(name_of_val))
            if request.form.get(name_of_hint) == "TRUE":
                hintsUsed.append(i)
        return render_template("results.html", formResults=formResults, hintsUsed=hintsUsed, questions=questions)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=80)