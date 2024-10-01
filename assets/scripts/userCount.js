class UserTracker {
    constructor() {
        this.userID = this.getUserID();
        this.userName = this.getUserName(); // Get or prompt for username
        this.uniqueUserCount = this.getUniqueUserCount();
        this.totalVisitCount = this.getTotalVisitCount();

        //this.startTime = Date.now();
        this.scores = JSON.parse(localStorage.getItem(`scores_${this.userID}`)) || [];

        // Ask if the user wants to continue as an existing user
        const continueAsExisting = confirm("Do you want to continue as the existing user?");
        if (continueAsExisting) {
            alert(`Welcome back, ${this.userName}!`); // Welcome back message
           // this.incrementTotalVisitCount(); // Increment the visit count for existing users
        } else {
            // If they don't want to continue, prompt for a new username
            this.userName = this.promptForUserName();
            localStorage.setItem('userName', this.userName); // Save the new username
            this.incrementUniqueUserCount();
            //this.incrementTotalVisitCount();
        }
    }

    generateSimpleID() {
        return Math.floor(Math.random().toString(36).substring(2));
    }

    getUserID() {
        let userID = localStorage.getItem('userID');
        if (!userID) {
            userID = 'user_' + this.generateSimpleID();
            localStorage.setItem('userID', userID);
            //this.incrementUniqueUserCount(); // Increment the unique user count
        }
        return userID;
    }

    addScore(score) {
        this.scores.push(score);
        localStorage.setItem(`scores_${this.userID}`, JSON.stringify(this.scores));
    }

    getUserName() {
        return localStorage.getItem('userName') || null; // Return null if userName doesn't exist
    }

    promptForUserName() {
        let userName = prompt("Please enter your name:", "Guest");
        while (!userName || userName.trim() === "") {
            alert("Name cannot be empty. Please enter your name:");
            userName = prompt("Please enter your name:", "Guest");
        }
        return userName; // Return the valid username
    }

    getUniqueUserCount() {
        return localStorage.getItem('uniqueUserCount') || 0;
    }

    getTotalVisitCount() {
        return localStorage.getItem('totalVisitCount') || 0;
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
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        // Display user's name and other statistics
        ctx.fillText(`Current Player's Name: ` + this.userName, 500, 270);
        ctx.fillText('Total Visits: ' + this.totalVisitCount,500, 290);
        ctx.fillText('Unique Users: ' + this.uniqueUserCount, 500, 310);
        ctx.fillText(`Latest Score: ${this.scores.length > 0 ? this.scores[this.scores.length - 1] : 'N/A'}`, 500, 330); // Check if there are scores
        ctx.restore();
    }

    handleUserCount() {
        this.incrementTotalVisitCount(); // Increment the visit count on page load or game start
    }
}

//export default UserTracker;
