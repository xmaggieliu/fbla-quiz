import csv, random
from cs50 import SQL

#connects to database
db = SQL("sqlite:///questions.db")

# Creates table in questions.db and insert csv values as default questions into database
def create_database():
    # Creates table
    db.execute("""CREATE TABLE IF NOT EXISTS question_bank(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_type TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        hint TEXT,
        a TEXT,
        b TEXT,
        c TEXT,
        d TEXT
        );""")

    # Reads each row from csv and insert into database
    with open("questions.csv", "r") as f:
        for row in csv.DictReader(f):
            db.execute("INSERT INTO question_bank (question_type, question, answer, hint, a, b, c, d) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", row["question_type"], row["question"], row["answer"], row["hint"], row["a"], row["b"], row["c"], row["d"])

quiz_questions = {}

# Creates a dictionary of the 5 questions and their info
def get_questions():
    i = 1
    # Loops through 5 unique int from [1, 61)
    for id in random.sample(range(1, 61), 5): 
        quiz_questions[i] = db.execute("SELECT * FROM question_bank where id = (?);", id)[0]
        i += 1
    return quiz_questions