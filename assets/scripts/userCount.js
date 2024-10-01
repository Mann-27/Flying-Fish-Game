class UserTracker {
    constructor() {
        this.userID = this.getUserID();
        this.userName=this.getUserName();
       // this.width=this.canvas.width;
        this.uniqueUserCount = this.getUniqueUserCount();
        this.totalVisitCount = this.getTotalVisitCount();
        this.scores=JSON.parse(localStorage.getItem(`scores_${this.userId}`))||[];
       // this.startTime=Date.now();
    }

    generateSimpleID() {
        return Math.floor( Math.random().toString(36).substring(2));
    }

    getUserID() {
        let userID = localStorage.getItem('userID');
        if (!userID) {
            userID ='user_' + this.generateSimpleID();
            localStorage.setItem('userID', userID);

            // Increment the unique user count
            this.incrementUniqueUserCount();
        }
        return userID;
    }

    getUserName() {
        let userName = localStorage.getItem('userName');
        if (!userName) {
            userName = prompt("Please enter your name:", "Guest");
            while (!userName || userName.trim() === "") {
                alert("Name cannot be empty. Please enter your name:");
                userName = prompt("Please enter your name:", "Guest");
            }
            localStorage.setItem('userName', userName);
        }
        return userName;
    }
    getUniqueUserCount() {
        return localStorage.getItem('uniqueUserCount') || 0;
    }

    getTotalVisitCount() {
        return localStorage.getItem('totalVisitCount') || 0;
    }
    // getTimePlayed(){
    //     let endTime=Date.now();
    //     let timePlayed=Math.floor(endTime-this.startTime)/1000
    //     return timePlayed;
    // }
   addScore(score)
   {
    this.scores.push(score);
    localStorage.setItem(`scores_${this.userID}`,JSON.stringify(this.scores));
   }
    incrementUniqueUserCount() {
        let uniqueUserCount = Number(localStorage.getItem('uniqueUserCount')) || 0;
        uniqueUserCount += 1;
        localStorage.setItem('uniqueUserCount', uniqueUserCount);
        this.uniqueUserCount = uniqueUserCount;
    }

    incrementTotalVisitCount() {
        let totalVisitCount = Number(localStorage.getItem('totalVisitCount')) || 0;
        totalVisitCount += 1;
        localStorage.setItem('totalVisitCount', totalVisitCount);
        this.totalVisitCount = totalVisitCount;
    }

    drawVisitCount(ctx) {
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
      ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
          // Display user's name
        ctx.fillText('Player: ' + this.userName,300,300);
        ctx.fillText('Total Visits: ' + this.totalVisitCount,300,320);
        ctx.fillText('Unique Users: ' + this.uniqueUserCount, 300, 340);
        ctx.fillText(`Latest Score:${this.scores[this.scores.length - 1] || 'N/A'}`,300,360);
    }

    handleUserCount() {
        this.incrementTotalVisitCount(); // Increment the visit count on page load or game start
    }
}

//export default UserTracker;
