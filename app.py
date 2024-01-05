import flask 
print(flask.__version__)
from flask import Flask, render_template, jsonify
import psycopg2
import json
import pymongo
from pymongo import MongoClient
from bson import ObjectId


#################################################
# Database Setup
#################################################

client = MongoClient('mongodb://localhost:27017/')   ## probably going to need to write this up
db = client['geo_data']                              ## I used mongodb compass to import json to db
collection = db['country_boundaries']

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

# welcome page and routes
@app.route("/")
def welcome():
    return (
        f"Available Static Routes:<br/><br/>"                           ## prob going to separate data from vis
        f"/data/passport_data<br/>"
        f"/data/region_data<br/>"
        f"/interactive_map<br/><br/>"
        # f"Summary Statistics Dynamic Date Range Routes:<br/><br/>"        ## room for our other views
        # f"~~~ start (enter as YYYY-MM-DD)<br/>"
        # f"/api/v1.0/start/ <br/>"
        # f"~~~ start/end  (enter as YYYY-MM-DD/YYYY-MM-DD)<br/>"
        # f"/api/v1.0/start/end"
    )


#################################################
# Flask Routes
#################################################

## Data
#################################################
@app.route('/data/passport_data')

def passport_data():
    conn = psycopg2.connect(
        host='localhost',
        dbname='passport_index',
        user='postgres',
        password='(7$0Uh)6#6J05N5',
        port='5432'
    )
    cur = conn.cursor()
    cur.execute('SELECT * FROM country_passport_merge;')
    passport_data = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(passport_data)

@app.route('/data/geo_data')

def geo_data():
    geo_data = collection.find()
    data = []
    for doc in geo_data:
        doc_dict = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc_dict[key] = str(value)
            else:
                doc_dict[key] = value
        data.append(doc_dict)
    return jsonify(data)

## Visualizations
#################################################
@app.route('/interactive_map')

def interactive_map():
    return render_template('index.html')


#################################################
# Initialize
#################################################

if __name__ == '__main__':
    app.run(debug=True)