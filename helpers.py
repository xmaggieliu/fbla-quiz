import csv, random
import re
from cs50 import SQL
from functools import wraps
from flask import redirect, session

# Connects to database
db = SQL("sqlite:///my.db")

# Creates users database
def create_database():    
    # Creates table for users
    db.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        hash TEXT NOT NULL
        );""")

create_database()

# Creates questionbank with default questions in database
def create_questionbank(id_table):
    db.execute("""CREATE TABLE IF NOT EXISTS ? (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_type TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        hint TEXT,
        a TEXT,
        b TEXT,
        c TEXT,
        d TEXT
        );""", id_table)

    # Reads each row from csv and insert into database
    with open("questions.csv", "r") as f:
        for row in csv.DictReader(f):
            db.execute("INSERT INTO ? (question_type, question, answer, hint, a, b, c, d) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", id_table, row["question_type"], row["question"], row["answer"], row["hint"], row["a"], row["b"], row["c"], row["d"])

quiz_questions = {}

# Creates a dictionary of the 5 questions and their info
def get_questions(table_name):
    num_of_q = len(db.execute("SELECT * FROM ?", table_name))
    i = 1
    # Loops through 5 unique int from [1, total num of questions]
    for q_id in random.sample(range(1, num_of_q + 1), 5): 
        quiz_questions[i] = db.execute("SELECT * FROM ? where id = (?);", table_name, q_id)[0]
        i += 1
    return quiz_questions

# SOURCE: CS50x2021 pset9
def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function
