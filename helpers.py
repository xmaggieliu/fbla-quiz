import csv, random
import re
from cs50 import SQL
from functools import wraps
from flask import redirect, session

# Connect to database
db = SQL("sqlite:///my.db")


# Create users table in database
def create_database():    
    # db.execute("DROP TABLE IF EXISTS users;")
    # db.execute("DROP TABLE IF EXISTS questionbank;")

    db.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        hash TEXT NOT NULL
        );""")

    db.execute("""CREATE TABLE IF NOT EXISTS questionbank (
        id INTEGER PRIMARY KEY,
        question_type TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        hint TEXT,
        a TEXT,
        b TEXT,
        c TEXT,
        d TEXT
        );""")

    # Read each row from csv and insert into database
    with open("defaults.csv", "r") as f:
        for row in csv.DictReader(f):
            db.execute("INSERT INTO questionbank (question_type, question, answer, hint, a, b, c, d) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", row["question_type"], row["question"], row["answer"], row["hint"], row["a"], row["b"], row["c"], row["d"])


# create_database()


# Create default question bank for registered user
def create_questionbank(id_table):
    print(id_table)
    db.execute("DROP TABLE IF EXISTS ?;", id_table)
    try:
        db.execute("CREATE TABLE ? AS SELECT * FROM questionbank;", id_table)
    except:
        pass
    

# Create a dictionary of 5 random questions and their info
quiz_questions = {}

def get_questions(table_name):
    num_of_q = len(db.execute("SELECT * FROM ?", table_name))
    i = 1
    # Loop through 5 unique int from [3, total num of questions]       <=      id = 1 and id = 2 are reserved for theme and hint mode
    for q_id in random.sample(range(3, num_of_q + 1), 5): 
        quiz_questions[i] = db.execute("SELECT * FROM ? where id = (?);", table_name, q_id)[0]
        i += 1
    return quiz_questions


# ----------------------------  SOURCE: CS50x2021 pset9
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
# ------------------------------------------- END OF SOURCE