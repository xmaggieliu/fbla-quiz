import sqlite3, random
from cs50 import SQL

#connects to database
db = SQL("sqlite:///questions/questions.db")

quiz_questions = {}
chosen_id = []

# Creates a dictionary for the 5 random questions and their answers
def get_questions():
    for i in range(5):
        id_num = random.randint(1, 60)
        while id_num in chosen_id:
            id_num = random.randint(1, 60)
        if id_num <= 15:
            line = db.execute("SELECT * FROM multipleChoice where id = (?);", (id_num,))[0]
        elif id_num <= 30:
            line = db.execute("SELECT * FROM trueFalse where id = (?);", (id_num,))[0]
        elif id_num <= 45:
            line = db.execute("SELECT * FROM dropdown where id = (?);", (id_num,))[0]
        elif id_num <= 60:
            line = db.execute("SELECT * FROM fillBlank where id = (?);", (id_num,))[0]
        else:
            raise Exception("Error: question id not in range.")
        chosen_id.append(id_num)
        quiz_questions[i + 1] = line
    return quiz_questions
