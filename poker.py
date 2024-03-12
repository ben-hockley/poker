#Flask Server
import os
from flask import Flask, redirect, request, render_template, url_for

app = Flask(__name__)

ALLOWED_EXTENTIONS = set(['jpg', 'txt', 'svg', 'png', 'jpeg', 'gif'])

#redirect user to homepage when site loads
@app.route("/")
def redirectHome():
    return redirect("/home")

#load home template when in home subdirectory
@app.route("/home")
def renderHome():
    return render_template("home.html")

#load game, leaderboard or instructions when buttons clicked on homescreen
@app.route("/play-poker")
def renderGame():
    return render_template("game.html")

@app.route("/leaderboard")
def renderLeaderboard():
    return render_template("leaderboard.html")

@app.route("/instructions")
def renderInstructions():
    return render_template("instructions.html")



if __name__ == "__main__":
    app.run(debug=True)