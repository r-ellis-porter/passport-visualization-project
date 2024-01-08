import flask 
print(flask.__version__)
from flask import Flask, render_template, jsonify
import psycopg2
import json
import pymongo
from pymongo import MongoClient
from bson import ObjectId
from postgres_info import host, dbname, user, password, port

#################################################
# Database Setup
#################################################

## Open Terminal and navigate to the Resources folder where country_boundaries.json is stored.

## Import the `country_boundaries.json` file with the following line in Terminal:

# ---- shell -----

# mongoimport --type json -d geo_data -c country_boundaries --drop --file country_boundaries.json
  
# ---- shell -----

client = MongoClient('mongodb://localhost:27017/')   
db = client['geo_data']                              
collection = db['country_boundaries']

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

# welcome page and routes
@app.route("/")

def welcome():
    return render_template('welcome.html')


#################################################
# Flask Routes
#################################################

## Data
#################################################
@app.route('/data/passport_data')

def passport_data():
    conn = psycopg2.connect(
        host= host,
        dbname= dbname,
        user= user,
        password= password,
        port= port
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
    return render_template('map_index.html')

@app.route('/interactive_charts')

def interactive_charts():
    return render_template('bar_index.html')

#################################################
# Initialize
#################################################

if __name__ == '__main__':
    app.run(debug=True)