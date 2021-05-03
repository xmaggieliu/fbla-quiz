# Creates tables in questions.db and insert csv values into the database

import csv, sqlite3

conn = sqlite3.connect("questions/questions.db")
c = conn.cursor()

# Delete previous tables of the same names for remaking database
c.execute("DROP TABLE IF EXISTS multipleChoice;")
c.execute("DROP TABLE IF EXISTS trueFalse;")
c.execute("DROP TABLE IF EXISTS dropdown;")
c.execute("DROP TABLE IF EXISTS fillBlank;")


c.execute("""CREATE TABLE multipleChoice(
    type text NOT NULL,
    id integer,
    question text NOT NULL,
    answer text NOT NULL,
    a text NOT NULL,
    b text NOT NULL,
    c text NOT NULL,
    d text NOT NULL
    );""")

# Reads data from csv file into dict, then reorganize into list
with open("questions/multipleChoice.csv", "r") as f:
    to_db = [(row["type"], int(row["id"]), row["question"], row["answer"], row["a"], row["b"], row["c"], row["d"]) for row in csv.DictReader(f)]

c.executemany("INSERT INTO multipleChoice (type, id, question, answer, a, b, c, d) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", to_db)


c.execute("""CREATE TABLE trueFalse(
    type text NOT NULL,
    id integer,
    question text NOT NULL,
    answer text NOT NULL
    );""")

with open("questions/trueFalse.csv", "r") as f:
    to_db = [(row["type"], int(row["id"]), row["question"], row["answer"]) for row in csv.DictReader(f)]

c.executemany("INSERT INTO trueFalse (type, id, question, answer) VALUES (?, ?, ?, ?);", to_db)


c.execute("""CREATE TABLE dropdown(
    type text NOT NULL,
    id integer,
    question text NOT NULL,
    answer text NOT NULL,
    a text NOT NULL,
    b text NOT NULL,
    c text NOT NULL,
    d text NOT NULL
    );""")

with open("questions/dropdown.csv", "r") as f:
    to_db = [(row["type"], int(row["id"]), row["question"], row["answer"], row["a"], row["b"], row["c"], row["d"]) for row in csv.DictReader(f)]

c.executemany("INSERT INTO dropdown (type, id, question, answer, a, b, c, d) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", to_db)


c.execute("""CREATE TABLE fillBlank(
    type text NOT NULL,
    id integer,
    question text NOT NULL,
    answer text NOT NULL,
    hint text
    );""")

with open("questions/fillBlank.csv", "r") as f:
    to_db = [(row["type"], int(row["id"]), row["question"], row["answer"], row["hint"]) for row in csv.DictReader(f)]
    
c.executemany("INSERT INTO fillBlank (type, id, question, answer, hint) VALUES (?, ?, ?, ?, ?);", to_db)


conn.commit()
conn.close()